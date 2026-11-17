import { SUBSCRIPTION_PLANS } from '@/data/mockData';
import type { PartnerInfo, PlanPeriod, SubscriptionPlan } from '@/types';

import { formatBRL } from './pricing';
import type { PurchaseResult } from './purchases.types';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const MONTHS: Record<PlanPeriod, number> = { monthly: 1, semiannual: 6, annual: 12 };
const SUFFIX: Record<PlanPeriod, string> = { monthly: '/mês', semiannual: '/semestre', annual: '/ano' };

/**
 * Preço com cupom calculado no aparelho, só para a compra simulada e para a web (que não vende).
 * Nas lojas, o preço com desconto vem da própria oferta (purchases.ts).
 */
export function withLocalDiscount(plans: SubscriptionPlan[], partner?: PartnerInfo | null): SubscriptionPlan[] {
  const percent = partner?.discountPercent;
  if (!percent) return plans;
  return plans.map((plan) => {
    const cents = Math.round(plan.priceCents * (1 - percent / 100));
    return {
      ...plan,
      discount: {
        percent,
        priceLabel: `${formatBRL(cents)}${SUFFIX[plan.period]}`,
        pricePerMonthLabel: `${formatBRL(Math.round(cents / MONTHS[plan.period]))}/mês`,
        termsLabel: `${partner.perk}; depois, ${plan.priceLabel}`,
      },
    };
  });
}

/** Compras simuladas: toda compra libera o Pro com sucesso. Só para testadores (PURCHASES_MOCK). */
export const mockPurchases = {
  async getPlans(partner?: PartnerInfo | null): Promise<SubscriptionPlan[]> {
    await wait(150);
    return withLocalDiscount(SUBSCRIPTION_PLANS, partner);
  },

  async purchase(plan: SubscriptionPlan): Promise<PurchaseResult> {
    await wait(900);
    console.info(`[purchases] compra simulada: ${plan.revenueCatPackageId}${plan.discount ? ` com ${plan.discount.percent}% off` : ''}`);
    return { isPro: true };
  },

  async restore(): Promise<PurchaseResult> {
    await wait(700);
    return { isPro: false, error: 'Nenhuma assinatura encontrada para esta conta.' };
  },
};
