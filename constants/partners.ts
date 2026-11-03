/**
 * Parceiros (creches, hotéis, adestradores) com código de indicação.
 * O código fica salvo no perfil do tutor para medir aquisição e conversão por parceiro.
 * O desconto em si é configurado nas lojas (Offer Codes / promo codes) via RevenueCat.
 */
export interface Partner {
  code: string;
  name: string;
  /** Benefício exibido no app. */
  perk: string;
}

export const PARTNERS: Partner[] = [
  { code: 'GARRIDOSP', name: 'Creche Garrido', perk: '30% off no 1º mês ou 10% off no plano anual' },
];

export function findPartner(code: string | null | undefined): Partner | undefined {
  if (!code) return undefined;
  const normalized = code.trim().toUpperCase();
  return PARTNERS.find((p) => p.code === normalized);
}
