import type { PartnerInfo } from '@/types';

import { supabase } from './supabase';

/**
 * Parceiros B2B2C (creches, hotéis, adestradores) com código de indicação.
 * A lista oficial vive na tabela `partners` do Supabase (migração 005) — nenhum parceiro fica fixo no app.
 * O código fica salvo no perfil do tutor para medir aquisição e conversão por parceiro;
 * o desconto em si é configurado nas lojas (Offer Codes / promo codes) via RevenueCat.
 */
export type Partner = PartnerInfo;

/** Códigos de teste usados quando o app roda sem Supabase (desenvolvimento local). */
const DEV_PARTNERS: Partner[] = [
  { code: 'PARCEIRO30', name: 'Parceiro de teste', perk: '30% off no 1º mês' },
  { code: 'AUAU', name: 'Cupom AUAU', perk: '10% off no plano anual' },
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

  const { data, error } = await supabase.from('partners').select('code, name, perk').eq('code', code).maybeSingle();
  if (error) {
    console.warn('[partners]', error.message);
    return null;
  }
  return (data as Partner | null) ?? null;
}
