import type { PartnerInfo } from '@/types';

import { supabase } from './supabase';

/**
 * Parceiros B2B2C (creches, hotéis, adestradores) com código de indicação.
 * A lista oficial vive na tabela `partners` do Supabase (migração 005) — nenhum parceiro fica fixo no app.
 * O código fica salvo no perfil do tutor para medir aquisição e conversão por parceiro;
 * o desconto em si é uma oferta criada na loja (Google Play: tag google_offer_tag), comprada pelo app via RevenueCat.
 */
export type Partner = PartnerInfo;

/** Códigos de teste usados quando o app roda sem Supabase (desenvolvimento local). */
const DEV_PARTNERS: Partner[] = [
  { code: 'PARCEIRO30', name: 'Parceiro de teste', perk: '30% off no 1º período', discountPercent: 30, googleOfferTag: 'parceiro-30' },
  { code: 'AUAU', name: 'Cupom AUAU', perk: 'Indicação da creche AUAU' },
];

/** Normaliza o que o tutor digita: caixa alta, sem espaços. */
export function normalizePartnerCode(input: string): string {
  return input.replace(/\s/g, '').toUpperCase();
}

/** Busca um parceiro ativo pelo código. Retorna null se não existir (ou se falhar a conexão). */
export async function lookupPartner(input: string): Promise<Partner | null> {
  const code = normalizePartnerCode(input);
  if (!code) return null;

  if (!supabase) return DEV_PARTNERS.find((p) => p.code === code) ?? null;

  const { data, error } = await supabase
    .from('partners')
    .select('code, name, perk, discount_percent, google_offer_tag, offering_id')
    .eq('code', code)
    .maybeSingle();
  if (error) {
    console.warn('[partners]', error.message);
    return null;
  }
  if (!data) return null;
  return {
    code: data.code,
    name: data.name,
    perk: data.perk,
    discountPercent: data.discount_percent ?? null,
    googleOfferTag: data.google_offer_tag ?? null,
    offeringId: data.offering_id ?? null,
  };
}
