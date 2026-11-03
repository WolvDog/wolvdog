import type { BehaviorChallenge, Difficulty, PetSize } from '@/types';

export const PET_SIZE_LABELS: Record<PetSize, string> = {
  mini: 'Mini',
  pequeno: 'Pequeno',
  medio: 'Médio',
  grande: 'Grande',
  gigante: 'Gigante',
};

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

export const DIFFICULTY_LABELS: Record<Difficulty, { label: string; emoji: string }> = {
  easy: { label: 'Fácil', emoji: '🌟' },
  medium: { label: 'Médio', emoji: '🐾' },
  hard: { label: 'Desafiador', emoji: '🌀' },
};

export function formatAge(months: number): string {
  if (months < 12) return `${months} ${months === 1 ? 'mês' : 'meses'}`;
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const y = `${years} ${years === 1 ? 'ano' : 'anos'}`;
  return rest ? `${y} e ${rest} ${rest === 1 ? 'mês' : 'meses'}` : y;
}
