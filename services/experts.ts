import type { Expert } from '@/types';

import { supabase } from './supabase';

/**
 * Especialista que assina o Guia do Tutor (tabela `experts`, migração 007).
 * Nenhum nome fica fixo no app: sem cadastro ativo, o Guia aparece como conteúdo WolverBark genérico.
 * Retorna `undefined` se não deu para consultar (sem internet), para o app manter o que já tinha salvo.
 */
export async function fetchActiveExpert(): Promise<Expert | null | undefined> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('experts')
    .select('id, display_name, title, registry, avatar_url, validated_guides')
    .eq('active', true)
    .order('sort')
    .limit(1)
    .maybeSingle();
  if (error) {
    console.warn('[experts]', error.message);
    return undefined;
  }
  if (!data) return null;
  return {
    id: data.id,
    displayName: data.display_name,
    title: data.title,
    registry: data.registry ?? null,
    avatarUrl: data.avatar_url ?? null,
    validatedGuides: data.validated_guides ?? [],
  };
}

/** Selo exibido no guia: só diz "validado" se a especialista aprovou aquele guia. */
export function guideSeal(expert: Expert | null, slug: string): { label: string; validated: boolean } {
  if (!expert) return { label: 'Conteúdo WolverBark · siga sempre a orientação do seu veterinário', validated: false };
  const who = expert.registry ? `${expert.displayName} (${expert.registry})` : expert.displayName;
  return expert.validatedGuides.includes(slug)
    ? { label: `Validado por ${who}`, validated: true }
    : { label: `Em revisão por ${who}`, validated: false };
}
