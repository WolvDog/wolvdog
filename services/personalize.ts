/** Nome usado quando o pet ainda não tem nome cadastrado. */
export const DEFAULT_PET_NAME = 'Caramelo';

/** Marcador usado nos textos das missões: vira o nome do cão do tutor (ex.: "{pet}, vem!"). */
const PET_TOKEN = /\{pet\}/g;

export function petDisplayName(name: string | null | undefined): string {
  return name?.trim() || DEFAULT_PET_NAME;
}

export function fillPetName(text: string, petName: string | null | undefined): string {
  return text.replace(PET_TOKEN, petDisplayName(petName));
}

/** Aplica o nome do pet em todos os textos de um objeto (lição, etapas, quiz). */
export function personalize<T>(value: T, petName: string | null | undefined): T {
  const name = petDisplayName(petName);
  const walk = (v: unknown): unknown => {
    if (typeof v === 'string') return v.includes('{pet}') ? v.replace(PET_TOKEN, name) : v;
    if (Array.isArray(v)) return v.map(walk);
    if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, walk(x)]));
    return v;
  };
  return walk(value) as T;
}
