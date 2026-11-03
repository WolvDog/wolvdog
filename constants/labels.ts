import type { BehaviorChallenge, Difficulty, PetSize } from '@/types';

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

/** Fase da trilha que mais ajuda em cada desafio — usada para montar o plano do onboarding. */
export const CHALLENGE_FOCUS_PHASE: Record<BehaviorChallenge, number> = {
  xixi_fora_do_lugar: 1,
  pula_nas_pessoas: 1,
  nao_atende_chamado: 2,
  puxa_a_guia: 3,
  reatividade: 3,
  ansiedade_separacao: 4,
  destroi_objetos: 4,
  late_demais: 4,
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
