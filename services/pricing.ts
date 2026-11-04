import type { PlanPeriod, SubscriptionPlan } from '@/types';

/** Plano base inclui 1 cão; cada cão adicional custa esta fração do plano base. */
export const EXTRA_PET_RATE = 0.5;

const PERIOD_SUFFIX: Record<PlanPeriod, string> = {
  monthly: '/mês',
  semiannual: '/semestre',
  annual: '/ano',
};

export function formatBRL(cents: number): string {
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export interface PriceBreakdown {
  baseCents: number;
  extraPets: number;
  extraCents: number;
  totalCents: number;
  /** Ex.: "R$ 34,99/mês + 1 cão adicional (R$ 17,49) = R$ 52,48/mês". */
  summary: string;
}

/** Total da assinatura para N cães no mesmo tutor (1 incluso + adicionais a 50%). */
export function calculateSubscription(plan: SubscriptionPlan, totalPets: number): PriceBreakdown {
  const extraPets = Math.max(0, totalPets - 1);
  const extraCents = extraPets * plan.extraPetPriceCents;
  const totalCents = plan.priceCents + extraCents;
  const suffix = PERIOD_SUFFIX[plan.period];
  const summary =
    extraPets === 0
      ? `${formatBRL(plan.priceCents)}${suffix}`
      : `${formatBRL(plan.priceCents)}${suffix} + ${extraPets} ${extraPets === 1 ? 'cão adicional' : 'cães adicionais'} (${formatBRL(extraCents)}) = ${formatBRL(totalCents)}${suffix}`;
  return { baseCents: plan.priceCents, extraPets, extraCents, totalCents, summary };
}

export function extraPetLabel(plan: SubscriptionPlan): string {
  return `+${formatBRL(plan.extraPetPriceCents)}${PERIOD_SUFFIX[plan.period]} por cão adicional`;
}
