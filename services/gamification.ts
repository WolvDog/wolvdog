import {
  DIFFICULTY_XP_BONUS,
  FREEZES_EARNED_PER_WEEK,
  LEVELS,
  MAX_STREAK_FREEZES,
  REPEAT_XP_MULTIPLIER,
  STREAK_BONUS_EVERY_DAYS,
  STREAK_BONUS_XP,
} from '@/constants/gamification';
import type { Difficulty, Lesson, LessonCompletion, Streak } from '@/types';

// ---------------------------------------------------------------------------
// Datas — sempre no fuso local do usuário, no formato YYYY-MM-DD.
// ---------------------------------------------------------------------------

export function toDateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function keyToUtc(key: string): number {
  const [y, m, d] = key.split('-').map(Number);
  return Date.UTC(y ?? 1970, (m ?? 1) - 1, d ?? 1);
}

export function daysBetween(fromKey: string, toKey: string): number {
  return Math.round((keyToUtc(toKey) - keyToUtc(fromKey)) / 86_400_000);
}

export function addDays(key: string, amount: number): string {
  const date = new Date(keyToUtc(key) + amount * 86_400_000);
  return date.toISOString().slice(0, 10);
}

// ---------------------------------------------------------------------------
// Streak
// ---------------------------------------------------------------------------

export type StreakReconcileEvent = 'none' | 'frozen' | 'lost';

export interface StreakReconcileResult {
  streak: Streak;
  event: StreakReconcileEvent;
  freezesUsed: number;
}

/**
 * Executado ao abrir o app: verifica se dias foram perdidos desde a última atividade.
 * Se houver Escudos suficientes, eles cobrem os dias perdidos; senão a ofensiva zera.
 */
export function reconcileStreak(streak: Streak, today: string = toDateKey()): StreakReconcileResult {
  if (!streak.lastActiveDate || streak.current === 0) {
    return { streak, event: 'none', freezesUsed: 0 };
  }

  const gap = daysBetween(streak.lastActiveDate, today);
  if (gap <= 1) return { streak, event: 'none', freezesUsed: 0 };

  const missedDays = gap - 1;
  if (streak.freezesAvailable >= missedDays) {
    const frozen = Array.from({ length: missedDays }, (_, i) => addDays(streak.lastActiveDate!, i + 1));
    return {
      event: 'frozen',
      freezesUsed: missedDays,
      streak: {
        ...streak,
        freezesAvailable: streak.freezesAvailable - missedDays,
        frozenDates: [...streak.frozenDates, ...frozen],
        // Mantém a ofensiva "viva": o último dia coberto passa a ser ontem.
        lastActiveDate: addDays(today, -1),
      },
    };
  }

  return { event: 'lost', freezesUsed: 0, streak: { ...streak, current: 0 } };
}

export interface StreakActivityResult {
  streak: Streak;
  increased: boolean;
  bonusXp: number;
  freezesEarned: number;
}

/** Registra uma lição concluída hoje e incrementa a ofensiva (no máximo 1x por dia). */
export function registerStreakActivity(
  streak: Streak,
  isPro: boolean,
  today: string = toDateKey(),
): StreakActivityResult {
  if (streak.lastActiveDate === today) {
    return { streak, increased: false, bonusXp: 0, freezesEarned: 0 };
  }

  const continues = streak.lastActiveDate !== null && daysBetween(streak.lastActiveDate, today) === 1;
  const current = continues ? streak.current + 1 : 1;
  const milestone = current % STREAK_BONUS_EVERY_DAYS === 0;

  const earned = milestone ? FREEZES_EARNED_PER_WEEK[isPro ? 'pro' : 'free'] : 0;
  const freezesAvailable = Math.min(MAX_STREAK_FREEZES, streak.freezesAvailable + earned);

  return {
    increased: true,
    bonusXp: milestone ? STREAK_BONUS_XP : 0,
    freezesEarned: freezesAvailable - streak.freezesAvailable,
    streak: {
      ...streak,
      current,
      longest: Math.max(streak.longest, current),
      lastActiveDate: today,
      freezesAvailable,
    },
  };
}

/** Ofensiva está em risco quando o tutor treinou ontem mas ainda não treinou hoje. */
export function isStreakAtRisk(streak: Streak, today: string = toDateKey()): boolean {
  return streak.current > 0 && streak.lastActiveDate !== today;
}

// ---------------------------------------------------------------------------
// XP & Níveis
// ---------------------------------------------------------------------------

export function calculateLessonXp(
  lesson: Lesson,
  difficulty: Difficulty,
  previous?: LessonCompletion,
): number {
  const base = lesson.xpReward + DIFFICULTY_XP_BONUS[difficulty];
  return previous ? Math.round(base * REPEAT_XP_MULTIPLIER) : base;
}

export interface LevelInfo {
  level: number;
  title: string;
  /** 0..1 até o próximo nível (1 quando no nível máximo). */
  progress: number;
  xpIntoLevel: number;
  xpForNextLevel: number | null;
}

export function getLevelInfo(totalXp: number): LevelInfo {
  let index = 0;
  LEVELS.forEach((l, i) => {
    if (totalXp >= l.minXp) index = i;
  });
  const current = LEVELS[index]!;
  const next = LEVELS[index + 1];

  if (!next) {
    return { level: current.level, title: current.title, progress: 1, xpIntoLevel: totalXp - current.minXp, xpForNextLevel: null };
  }

  const span = next.minXp - current.minXp;
  return {
    level: current.level,
    title: current.title,
    progress: (totalXp - current.minXp) / span,
    xpIntoLevel: totalXp - current.minXp,
    xpForNextLevel: span,
  };
}
