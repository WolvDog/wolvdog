import { PURCHASES_MOCK } from '@/constants/revenuecat';
import { SUBSCRIPTION_PLANS } from '@/data/mockData';

import { mockPurchases, withLocalDiscount } from './purchases.mock';
import type { PurchasesApi } from './purchases.types';

export { PRO_ENTITLEMENT_ID, type PurchaseResult } from './purchases.types';

/**
 * Na web não há loja: a assinatura é feita no app do celular e o Pro chega pela conta
 * (o webhook do RevenueCat marca profiles.is_pro, e a sincronização traz para cá).
 */
const APP_ONLY =
  'A assinatura é feita pelo app WolvDog no celular, pela App Store ou pelo Google Play. Depois de assinar, entre com a mesma conta aqui.';

export const PurchasesService: PurchasesApi = {
  live: false,

  async identify() {},

  async getPlans(partner) {
    return PURCHASES_MOCK ? mockPurchases.getPlans(partner) : withLocalDiscount(SUBSCRIPTION_PLANS, partner);
  },

  async purchase(plan) {
    return PURCHASES_MOCK ? mockPurchases.purchase(plan) : { isPro: false, error: APP_ONLY };
  },

  async restore() {
    return PURCHASES_MOCK ? mockPurchases.restore() : { isPro: false, error: APP_ONLY };
  },
};
