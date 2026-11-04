import type { Difficulty } from '@/types';

/** Bônus de garras conforme o tutor reporta a dificuldade — treinos difíceis valem mais esforço. */
export const DIFFICULTY_XP_BONUS: Record<Difficulty, number> = {
  easy: 0,
  medium: 3,
  hard: 5,
};

/** Refazer uma missão (ou o reforço) rende uma fração das garras originais. */
export const REPEAT_XP_MULTIPLIER = 0.5;

/** Garras por resposta certa nos quizzes (só na primeira vez que a missão é cumprida). */
export const QUIZ_XP_PER_CORRECT = 2;

/** Garras extras ao atingir a meta semanal de treinos. */
export const WEEK_GOAL_BONUS_XP = 30;

export const MAX_STREAK_FREEZES = 2;
/** A cada N semanas seguidas com a meta cumprida, o tutor ganha 1 Osso Reserva. */
export const FREEZE_EVERY_WEEKS = { free: 4, pro: 2 } as const;

export const WEEKLY_GOAL_OPTIONS = [
  { days: 3, title: '3x por semana', subtitle: 'Leve — ótimo para começar' },
  { days: 4, title: '4x por semana', subtitle: 'Recomendado — evolução constante' },
  { days: 5, title: '5x por semana', subtitle: 'Intenso — resultado mais rápido' },
  { days: 7, title: 'Todo dia', subtitle: 'Modo herói' },
] as const;

/**
 * Repetição espaçada do reforço: dias até a próxima revisão, conforme o relato do tutor.
 * "Difícil" volta no dia seguinte; "fácil" espaça cada vez mais.
 */
export const REVIEW_FIRST_INTERVAL: Record<Difficulty, number> = { hard: 1, medium: 3, easy: 7 };
export const REVIEW_GROWTH: Record<Difficulty, number> = { hard: 0, medium: 1.5, easy: 2.5 };
export const REVIEW_MAX_INTERVAL = 60;
export const DAILY_REVIEW_LIMIT = 3;

/** Curva de patentes do pet: garras acumuladas necessárias para cada nível. */
export const LEVELS = [
  { level: 1, minXp: 0, title: 'Filhote Curioso' },
  { level: 2, minXp: 40, title: 'Aprendiz de Patas' },
  { level: 3, minXp: 100, title: 'Cão Educado' },
  { level: 4, minXp: 180, title: 'Parceiro de Passeio' },
  { level: 5, minXp: 280, title: 'Cão Herói' },
  { level: 6, minXp: 400, title: 'Lenda WolverBark' },
] as const;
