import type { SubscriptionPlan } from '@/types';

/** Direito de acesso no RevenueCat que libera o Pro. */
export const PRO_ENTITLEMENT_ID = 'pro';

export interface PurchaseResult {
  isPro: boolean;
  cancelled?: boolean;
  error?: string;
}

/** O que as telas usam. Implementações: purchases.ts (celular) e purchases.web.ts (web). */
export interface PurchasesApi {
  /** true quando as compras são reais (RevenueCat): aí o Pro vem da loja, não do botão. */
  readonly live: boolean;
  /**
   * Liga o SDK na primeira chamada e associa as compras à conta (id do Supabase; null = sem conta).
   * onProChange recebe o estado do Pro sempre que a loja informar (compra, renovação, expiração, troca de conta).
   */
  identify(appUserId: string | null, onProChange: (isPro: boolean) => void): Promise<void>;
  getPlans(): Promise<SubscriptionPlan[]>;
  purchase(plan: SubscriptionPlan): Promise<PurchaseResult>;
  restore(): Promise<PurchaseResult>;
}
