import type { Difficulty } from '@/types';

/** Bônus de XP conforme o tutor reporta a dificuldade — treinos difíceis valem mais esforço. */
export const DIFFICULTY_XP_BONUS: Record<Difficulty, number> = {
  easy: 0,
  medium: 3,
  hard: 5,
};

/** Refazer uma lição concluída rende uma fração do XP original (prática espaçada). */
export const REPEAT_XP_MULTIPLIER = 0.5;

/** A cada N dias de ofensiva o tutor ganha XP extra. */
export const STREAK_BONUS_EVERY_DAYS = 7;
export const STREAK_BONUS_XP = 50;

export const MAX_STREAK_FREEZES = 2;
/** Usuários grátis ganham 1 escudo a cada 7 dias de ofensiva; Pro ganham 2. */
export const FREEZES_EARNED_PER_WEEK = { free: 1, pro: 2 } as const;

/** Curva de níveis do pet: XP acumulado necessário para atingir cada nível. */
export const LEVELS = [
  { level: 1, minXp: 0, title: 'Filhote Curioso' },
  { level: 2, minXp: 40, title: 'Aprendiz de Patas' },
  { level: 3, minXp: 100, title: 'Cão Educado' },
  { level: 4, minXp: 180, title: 'Parceiro de Passeio' },
  { level: 5, minXp: 280, title: 'Cão Herói' },
  { level: 6, minXp: 400, title: 'Lenda WolverBark' },
] as const;
