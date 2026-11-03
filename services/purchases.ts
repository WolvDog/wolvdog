import { SUBSCRIPTION_PLANS } from '@/data/mockData';
import type { SubscriptionPlan } from '@/types';

/**
 * Camada de assinatura preparada para o RevenueCat.
 *
 * Para ativar de verdade:
 *   1. npx expo install react-native-purchases
 *   2. Em configure(): Purchases.configure({ apiKey: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY! })
 *   3. getPlans(): mapear (await Purchases.getOfferings()).current?.availablePackages → SubscriptionPlan
 *   4. purchase(): Purchases.purchasePackage(pkg) e checar customerInfo.entitlements.active['pro']
 *
 * A interface abaixo não muda — as telas continuam iguais.
 */

export const PRO_ENTITLEMENT_ID = 'pro';

export interface PurchaseResult {
  isPro: boolean;
  cancelled?: boolean;
  error?: string;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let configured = false;

export const PurchasesService = {
  configure(_appUserId: string): void {
    configured = true;
  },

  async getPlans(): Promise<SubscriptionPlan[]> {
    await wait(150);
    return SUBSCRIPTION_PLANS;
  },

  async purchase(plan: SubscriptionPlan): Promise<PurchaseResult> {
    if (!configured) return { isPro: false, error: 'Assinaturas indisponíveis no momento.' };
    await wait(900);
    // Mock: toda compra simulada inicia o teste grátis com sucesso.
    console.info(`[PurchasesService] Mock purchase: ${plan.revenueCatPackageId}`);
    return { isPro: true };
  },

  async restore(): Promise<PurchaseResult> {
    await wait(700);
    return { isPro: false, error: 'Nenhuma assinatura encontrada para esta conta.' };
  },
};
