import type { PetSex } from '@/types';

/** Nome usado quando o pet ainda não tem nome cadastrado. */
export const DEFAULT_PET_NAME = 'Caramelo';

export function petDisplayName(name: string | null | undefined): string {
  return name?.trim() || DEFAULT_PET_NAME;
}

/** O mínimo do pet que os textos precisam: nome e sexo (para o/a, do/da…). */
export interface PetTextInfo {
  name?: string | null;
  sex?: PetSex | null;
}

/**
 * Formas do nome com artigo, para o português soar natural ("com água para o Caramelo", "da Lola").
 * Sem sexo informado (pets antigos), usa o nome sem artigo em vez de chutar.
 * O nome padrão (Caramelo) é tratado como macho.
 */
export function getPetGrammar(pet: PetTextInfo | null | undefined) {
  const name = petDisplayName(pet?.name);
  const sex: PetSex | null = pet?.sex ?? (pet?.name?.trim() ? null : 'male');
  const art = sex === 'female' ? 'a' : sex === 'male' ? 'o' : '';
  const withArt = (prefix: string, contracted: string) => (sex ? `${contracted} ${name}` : `${prefix} ${name}`);
  return {
    name,
    /** "o Caramelo" / "a Lola" / "Mel" */
    o: art ? `${art} ${name}` : name,
    /** "O Caramelo" / "A Lola" / "Mel" (começo de frase) */
    O: art ? `${art.toUpperCase()} ${name}` : name,
    do: withArt('de', sex === 'female' ? 'da' : 'do'),
    no: withArt('em', sex === 'female' ? 'na' : 'no'),
    para: withArt('para', sex === 'female' ? 'para a' : 'para o'),
    com: withArt('com', sex === 'female' ? 'com a' : 'com o'),
    ao: withArt('a', sex === 'female' ? 'à' : 'ao'),
    ele: sex === 'female' ? 'ela' : 'ele',
    Ele: sex === 'female' ? 'Ela' : 'Ele',
    /** Terminação de adjetivos: "animado"/"animada". */
    oA: sex === 'female' ? 'a' : 'o',
  };
}

export type PetGrammar = ReturnType<typeof getPetGrammar>;

/**
 * Marcadores aceitos nos textos das missões e guias:
 * {pet} nome · {o_pet} {O_pet} · {do_pet} {no_pet} {para_pet} {com_pet} {ao_pet} · {ele} {Ele} · {o/a}
 */
const TOKENS: Record<string, keyof PetGrammar> = {
  '{pet}': 'name',
  '{o_pet}': 'o',
  '{O_pet}': 'O',
  '{do_pet}': 'do',
  '{no_pet}': 'no',
  '{para_pet}': 'para',
  '{com_pet}': 'com',
  '{ao_pet}': 'ao',
  '{ele}': 'ele',
  '{Ele}': 'Ele',
  '{o/a}': 'oA',
};
const TOKEN_RE = /\{(?:pet|o_pet|O_pet|do_pet|no_pet|para_pet|com_pet|ao_pet|ele|Ele|o\/a)\}/g;

export function fillPetText(text: string, grammar: PetGrammar): string {
  return text.includes('{') ? text.replace(TOKEN_RE, (t) => grammar[TOKENS[t]!]) : text;
}

/** Atalho para um texto só: aceita o pet (nome + sexo) ou só o nome. */
export function fillPetName(text: string, pet: PetTextInfo | string | null | undefined): string {
  return fillPetText(text, getPetGrammar(typeof pet === 'string' ? { name: pet } : pet));
}

/** Aplica nome e gramática do pet em todos os textos de um objeto (lição, etapas, quiz, guia). */
export function personalize<T>(value: T, pet: PetTextInfo | null | undefined): T {
  const grammar = getPetGrammar(pet);
  const walk = (v: unknown): unknown => {
    if (typeof v === 'string') return fillPetText(v, grammar);
    if (Array.isArray(v)) return v.map(walk);
    if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, walk(x)]));
    return v;
  };
  return walk(value) as T;
}
