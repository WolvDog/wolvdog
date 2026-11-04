import type { BehaviorChallenge, Difficulty, PetEnergy, PetExperience, PetSex, PetSize, TutorGender } from '@/types';

export const PET_SIZE_LABELS: Record<PetSize, string> = {
  mini: 'Mini',
  pequeno: 'Pequeno',
  medio: 'Médio',
  grande: 'Grande',
  gigante: 'Gigante',
};

export const PET_SIZE_DETAILS: Record<PetSize, { emoji: string; range: string }> = {
  mini: { emoji: '🐁', range: 'até 4 kg' },
  pequeno: { emoji: '🐕', range: '4 a 10 kg' },
  medio: { emoji: '🐕‍🦺', range: '10 a 25 kg' },
  grande: { emoji: '🦮', range: '25 a 45 kg' },
  gigante: { emoji: '🐻', range: 'mais de 45 kg' },
};

/** Sugere o porte a partir do peso informado. */
export function sizeFromWeight(kg: number): PetSize {
  if (kg <= 4) return 'mini';
  if (kg <= 10) return 'pequeno';
  if (kg <= 25) return 'medio';
  if (kg <= 45) return 'grande';
  return 'gigante';
}

export const BREED_SUGGESTIONS = [
  'Vira-lata (SRD)',
  'Shih Tzu',
  'Golden Retriever',
  'Labrador',
  'Border Collie',
  'Bulldog Francês',
  'Spitz Alemão',
  'Akita Inu',
  'Pastor Alemão',
  'Poodle',
  'Yorkshire',
  'Pinscher',
];

export const CHALLENGE_LABELS: Record<BehaviorChallenge, { label: string; emoji: string }> = {
  xixi_fora_do_lugar: { label: 'Xixi fora do lugar', emoji: '💦' },
  puxa_a_guia: { label: 'Puxa a guia', emoji: '🦮' },
  late_demais: { label: 'Late demais', emoji: '🔊' },
  pula_nas_pessoas: { label: 'Pula nas pessoas', emoji: '🦘' },
  ansiedade_separacao: { label: 'Ansiedade de separação', emoji: '😰' },
  destroi_objetos: { label: 'Destrói objetos', emoji: '🧸' },
  nao_atende_chamado: { label: 'Não atende ao chamado', emoji: '🙉' },
  reatividade: { label: 'Reatividade', emoji: '⚡' },
};

/** Fase (id do módulo) que mais ajuda em cada desafio — usada para montar o plano do onboarding. */
export const CHALLENGE_FOCUS_MODULE: Record<BehaviorChallenge, string> = {
  xixi_fora_do_lugar: 'm-sanitario',
  pula_nas_pessoas: 'm1-boas-maneiras',
  nao_atende_chamado: 'm2-comandos-basicos',
  puxa_a_guia: 'm3-passeio',
  reatividade: 'm3-passeio',
  ansiedade_separacao: 'm4-ansiedade',
  destroi_objetos: 'm5-alimentacao',
  late_demais: 'm4-ansiedade',
};

export const DIFFICULTY_LABELS: Record<Difficulty, { label: string; emoji: string }> = {
  easy: { label: 'Fácil', emoji: '🌟' },
  medium: { label: 'Médio', emoji: '🐾' },
  hard: { label: 'Desafiador', emoji: '🌀' },
};

export function formatWeight(kg: number): string {
  return `${kg.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} kg`;
}

export function formatAge(months: number): string {
  if (months < 12) return `${months} ${months === 1 ? 'mês' : 'meses'}`;
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const y = `${years} ${years === 1 ? 'ano' : 'anos'}`;
  return rest ? `${y} e ${rest} ${rest === 1 ? 'mês' : 'meses'}` : y;
}

/** Escala do diário de comportamento: 1 = fora de controle, 5 = sob controle. */
export const RATING_LABELS = {
  1: { emoji: '😣', label: 'Fora de controle' },
  2: { emoji: '😕', label: 'Difícil' },
  3: { emoji: '😐', label: 'Médio' },
  4: { emoji: '🙂', label: 'Quase lá' },
  5: { emoji: '😎', label: 'Sob controle' },
} as const;

export const TUTOR_GENDER_LABELS: Record<TutorGender, string> = {
  female: 'Mulher',
  male: 'Homem',
  undisclosed: 'Prefiro não dizer',
};

export const PET_SEX_LABELS: Record<PetSex, { label: string; emoji: string }> = {
  male: { label: 'Macho', emoji: '♂️' },
  female: { label: 'Fêmea', emoji: '♀️' },
};

export const PET_ENERGY_LABELS: Record<PetEnergy, { emoji: string; title: string; subtitle: string; short: string }> = {
  high: { emoji: '⚡', title: 'Elétrico, ligado no 220v', subtitle: 'Não para um segundo', short: 'Energia alta' },
  balanced: { emoji: '🐾', title: 'Equilibrado', subtitle: 'Gosta de brincar, mas sabe descansar', short: 'Energia equilibrada' },
  calm: { emoji: '🛋️', title: 'Tranquilão', subtitle: 'Adora uma soneca e sombra fresca', short: 'Tranquilão' },
};

export const PET_EXPERIENCE_LABELS: Record<PetExperience, { emoji: string; title: string; subtitle: string; short: string }> = {
  none: { emoji: '🟢', title: 'Zero bala', subtitle: 'Começando do zero absoluto', short: 'Começando do zero' },
  basic: { emoji: '🟡', title: 'O básico', subtitle: 'Já senta quando vê um petisco', short: 'Sabe o básico' },
  advanced: { emoji: '🔵', title: 'Já manja', subtitle: 'Sabe vários truques', short: 'Já manja de truques' },
};

/** Máscara DD/MM/AAAA enquanto o tutor digita. */
export function maskBirthDate(text: string): string {
  const d = text.replace(/\D/g, '').slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

/** Converte DD/MM/AAAA em YYYY-MM-DD; null se a data for inválida ou fora de 13–100 anos. */
export function parseBirthDate(masked: string): string | null {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(masked);
  if (!m) return null;
  const [, dd, mm, yyyy] = m;
  const date = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
  if (date.getDate() !== Number(dd) || date.getMonth() !== Number(mm) - 1) return null;
  const age = (Date.now() - date.getTime()) / (365.25 * 86_400_000);
  if (age < 13 || age > 100) return null;
  return `${yyyy}-${mm}-${dd}`;
}

export function formatBirthDate(iso: string | null): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}
