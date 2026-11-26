import { Platform } from 'react-native';
import Purchases, { type CustomerInfo, LOG_LEVEL, type PurchasesPackage, type SubscriptionOption } from 'react-native-purchases';

import { PURCHASES_MOCK, REVENUECAT_API_KEYS } from '@/constants/revenuecat';
import { SUBSCRIPTION_PLANS } from '@/data/mockData';
import type { PartnerInfo, PlanDiscount, PlanPeriod, SubscriptionPlan } from '@/types';

import { formatBRL } from './pricing';
import { mockPurchases } from './purchases.mock';
import { PRO_ENTITLEMENT_ID, type PurchaseResult, type PurchasesApi } from './purchases.types';

export { PRO_ENTITLEMENT_ID, type PurchaseResult } from './purchases.types';

/**
 * Assinatura de verdade pelo RevenueCat (App Store / Google Play).
 * - Conta: o app_user_id do RevenueCat é o id do Supabase, e o webhook (supabase/functions/revenuecat-webhook) marca profiles.is_pro.
 * - Planos: oferta "default", pacotes $rc_annual, $rc_six_month e $rc_monthly; preço e teste grátis vêm da loja.
 * - Cupom vitalício: oferta do RevenueCat com planos de preço menor (partners.offering_id), comprada no lugar do plano cheio.
 * - Cupom só na 1ª cobrança (Android): oferta do plano base com a tag do cupom (partners.google_offer_tag).
 * Sem chave para a plataforma (iPhone até a Apple ativar) ou com PURCHASES_MOCK, usa as compras simuladas.
 */
const API_KEY = Platform.OS === 'ios' ? REVENUECAT_API_KEYS.ios : Platform.OS === 'android' ? REVENUECAT_API_KEYS.android : '';
const LIVE = !PURCHASES_MOCK && API_KEY.length > 0;

const PERIOD_SUFFIX: Record<PlanPeriod, string> = { annual: 'ano', semiannual: 'semestre', monthly: 'mês' };
const DAYS_PER_UNIT: Record<string, number> = { DAY: 1, WEEK: 7, MONTH: 30, YEAR: 365 };
const MONTHS: Record<PlanPeriod, number> = { annual: 12, semiannual: 6, monthly: 1 };
const PERIOD_WORDS: Record<PlanPeriod, [string, string]> = { annual: ['ano', 'anos'], semiannual: ['semestre', 'semestres'], monthly: ['mês', 'meses'] };

let configured = false;
let currentUserId: string | null = null;
let notifyPro: (isPro: boolean) => void = () => {};
/** Pacotes da última leitura da oferta, por identificador ($rc_annual…). */
let packages = new Map<string, PurchasesPackage>();
/** Todas as ofertas do RevenueCat (para os cupons de desconto vitalício). */
let allOfferings: Record<string, { availablePackages: PurchasesPackage[] }> = {};
/** Cupom só na 1ª cobrança (Android): plano → opção da loja com a tag do cupom. */
let discountOptions = new Map<string, SubscriptionOption>();
/** Cupom vitalício: plano → pacote de preço menor da oferta do cupom. */
let discountPackages = new Map<string, PurchasesPackage>();

const hasPro = (info: CustomerInfo) => info.entitlements.active[PRO_ENTITLEMENT_ID] !== undefined;

/** Plano local (título, selo, desconto) com o preço e o teste grátis que a loja informou. */
function withStoreData(plan: SubscriptionPlan, pkg: PurchasesPackage): SubscriptionPlan {
  const { product } = pkg;
  const intro = product.introPrice;
  const trialDays = intro && intro.price === 0 ? intro.periodNumberOfUnits * (DAYS_PER_UNIT[intro.periodUnit] ?? 1) : 0;
  return {
    ...plan,
    priceCents: Math.round(product.price * 100),
    priceLabel: `${product.priceString}/${PERIOD_SUFFIX[plan.period]}`,
    pricePerMonthLabel: product.pricePerMonthString ? `${product.pricePerMonthString}/mês` : plan.pricePerMonthLabel,
    trialDays,
  };
}

/** Preço da oferta do parceiro (Android), lido da própria loja. null = a loja não tem oferta com essa tag. */
function partnerDiscount(
  plan: SubscriptionPlan,
  pkg: PurchasesPackage,
  partner: PartnerInfo | null | undefined,
): { discount: PlanDiscount; option: SubscriptionOption } | null {
  const tag = partner?.googleOfferTag;
  if (!tag || Platform.OS !== 'android') return null;
  const option = pkg.product.subscriptionOptions?.find((o) => o.tags.includes(tag));
  const phase = option?.introPhase;
  if (!option || !phase || phase.price.amountMicros <= 0) return null;

  const cents = Math.round(phase.price.amountMicros / 10_000);
  const percent = partner?.discountPercent ?? Math.round((1 - cents / plan.priceCents) * 100);
  const [one, many] = PERIOD_WORDS[plan.period];
  const cycles = phase.billingCycleCount;
  const when = cycles === null ? 'enquanto a assinatura durar' : cycles === 1 ? `no 1º ${one}` : `nos primeiros ${cycles} ${many}`;
  return {
    option,
    discount: {
      percent,
      priceLabel: `${phase.price.formatted}/${PERIOD_SUFFIX[plan.period]}`,
      pricePerMonthLabel: `${formatBRL(Math.round(cents / MONTHS[plan.period]))}/mês`,
      termsLabel: cycles === null ? `${phase.price.formatted} ${when}` : `${phase.price.formatted} ${when}; depois, ${plan.priceLabel}`,
    },
  };
}

/** Cupom vitalício: o mesmo plano na oferta do cupom (preço menor, renovado com desconto). */
function offeringDiscount(
  plan: SubscriptionPlan,
  partner: PartnerInfo | null | undefined,
): { discount: PlanDiscount; pkg: PurchasesPackage } | null {
  const offeringId = partner?.offeringId;
  if (!offeringId) return null;
  const pkg = allOfferings[offeringId]?.availablePackages.find((p) => p.identifier === plan.revenueCatPackageId);
  if (!pkg) return null;
  const { product } = pkg;
  const cents = Math.round(product.price * 100);
  const percent = partner?.discountPercent ?? Math.round((1 - cents / plan.priceCents) * 100);
  const priceLabel = `${product.priceString}/${PERIOD_SUFFIX[plan.period]}`;
  return {
    pkg,
    discount: {
      percent,
      priceLabel,
      pricePerMonthLabel: product.pricePerMonthString
        ? `${product.pricePerMonthString}/mês`
        : `${formatBRL(Math.round(cents / MONTHS[plan.period]))}/mês`,
      termsLabel: `${priceLabel} enquanto a assinatura estiver ativa`,
    },
  };
}

async function loadPackages(): Promise<Map<string, PurchasesPackage>> {
  const offerings = await Purchases.getOfferings();
  allOfferings = offerings.all;
  packages = new Map((offerings.current?.availablePackages ?? []).map((p) => [p.identifier, p]));
  return packages;
}

const livePurchases: PurchasesApi = {
  live: true,

  async identify(appUserId, onProChange) {
    notifyPro = onProChange;
    if (!configured) {
      configured = true;
      currentUserId = appUserId;
      void Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.DEBUG : LOG_LEVEL.WARN);
      Purchases.configure({ apiKey: API_KEY, appUserID: appUserId ?? undefined });
      Purchases.addCustomerInfoUpdateListener((info) => notifyPro(hasPro(info)));
      try {
        notifyPro(hasPro(await Purchases.getCustomerInfo()));
      } catch (e) {
        console.warn('[purchases] getCustomerInfo falhou', e);
      }
      return;
    }
    if (appUserId === currentUserId) return;
    currentUserId = appUserId;
    try {
      if (appUserId) {
        const { customerInfo } = await Purchases.logIn(appUserId);
        notifyPro(hasPro(customerInfo));
      } else if (!(await Purchases.isAnonymous())) {
        notifyPro(hasPro(await Purchases.logOut()));
      }
    } catch (e) {
      console.warn('[purchases] troca de conta falhou', e);
    }
  },

  async getPlans(partner) {
    try {
      const byId = await loadPackages();
      discountOptions = new Map();
      discountPackages = new Map();
      const plans = SUBSCRIPTION_PLANS.flatMap((plan) => {
        const pkg = byId.get(plan.revenueCatPackageId);
        if (!pkg) return [];
        const storePlan = withStoreData(plan, pkg);
        const lifetime = offeringDiscount(storePlan, partner);
        if (lifetime) {
          discountPackages.set(plan.id, lifetime.pkg);
          return [{ ...storePlan, discount: lifetime.discount }];
        }
        const offer = partnerDiscount(storePlan, pkg, partner);
        if (!offer) return [storePlan];
        discountOptions.set(plan.id, offer.option);
        return [{ ...storePlan, discount: offer.discount }];
      });
      return plans.length > 0 ? plans : SUBSCRIPTION_PLANS;
    } catch (e) {
      console.warn('[purchases] getOfferings falhou', e);
      return SUBSCRIPTION_PLANS;
    }
  },

  async purchase(plan) {
    let pkg = packages.get(plan.revenueCatPackageId);
    if (!pkg) {
      try {
        pkg = (await loadPackages()).get(plan.revenueCatPackageId);
      } catch {
        // segue para a mensagem abaixo
      }
    }
    if (!pkg) return { isPro: false, error: 'Os planos não estão disponíveis na loja agora. Tente de novo em instantes.' };

    try {
      const lifetimePkg = plan.discount ? discountPackages.get(plan.id) : undefined;
      const option = plan.discount && !lifetimePkg ? discountOptions.get(plan.id) : undefined;
      const { customerInfo } = lifetimePkg
        ? await Purchases.purchasePackage(lifetimePkg)
        : option
          ? await Purchases.purchaseSubscriptionOption(option)
          : await Purchases.purchasePackage(pkg);
      if (hasPro(customerInfo)) return { isPro: true };
      return { isPro: false, error: 'A compra foi feita, mas o Pro ainda não foi liberado. Toque em "Restaurar compras" em instantes.' };
    } catch (e) {
      if ((e as { userCancelled?: boolean | null }).userCancelled) return { isPro: false, cancelled: true };
      console.warn('[purchases] compra falhou', e);
      return { isPro: false, error: 'Não foi possível concluir a compra. Nenhum valor foi cobrado; tente de novo em instantes.' };
    }
  },

  async restore() {
    try {
      const info = await Purchases.restorePurchases();
      if (hasPro(info)) return { isPro: true };
      return { isPro: false, error: 'Nenhuma assinatura ativa encontrada na conta da loja deste celular.' };
    } catch (e) {
      console.warn('[purchases] restaurar falhou', e);
      return { isPro: false, error: 'Não foi possível verificar suas compras agora. Tente de novo em instantes.' };
    }
  },
};

const simulated: PurchasesApi = {
  live: false,
  async identify() {},
  getPlans: mockPurchases.getPlans,
  purchase: mockPurchases.purchase,
  restore: mockPurchases.restore,
};

export const PurchasesService: PurchasesApi = LIVE ? livePurchases : simulated;
