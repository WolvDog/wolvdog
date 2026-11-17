import { SUBSCRIPTION_PLANS } from '@/data/mockData';
import type { SubscriptionPlan } from '@/types';

import type { PurchaseResult } from './purchases.types';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Compras simuladas: toda compra inicia o teste grátis com sucesso. Só para testadores (PURCHASES_MOCK). */
export const mockPurchases = {
  async getPlans(): Promise<SubscriptionPlan[]> {
    await wait(150);
    return SUBSCRIPTION_PLANS;
  },

  async purchase(plan: SubscriptionPlan): Promise<PurchaseResult> {
    await wait(900);
    console.info(`[purchases] compra simulada: ${plan.revenueCatPackageId}`);
    return { isPro: true };
  },

  async restore(): Promise<PurchaseResult> {
    await wait(700);
    return { isPro: false, error: 'Nenhuma assinatura encontrada para esta conta.' };
  },
};
