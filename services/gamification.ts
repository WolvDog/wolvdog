import {
  DIFFICULTY_XP_BONUS,
  FREEZE_EVERY_WEEKS,
  LEVELS,
  MAX_STREAK_FREEZES,
  REPEAT_XP_MULTIPLIER,
  WEEK_GOAL_BONUS_XP,
} from '@/constants/gamification';
import type { Difficulty, Lesson, LessonCompletion, Streak, XpEvent } from '@/types';

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

/** Segunda-feira da semana do dia informado (as semanas vão de segunda a domingo). */
export function weekStart(key: string): string {
  const weekday = new Date(keyToUtc(key)).getUTCDay(); // 0 = domingo
  return addDays(key, -((weekday + 6) % 7));
}

// ---------------------------------------------------------------------------
// Sequência semanal
// ---------------------------------------------------------------------------

/** Dias (YYYY-MM-DD) em que o tutor cumpriu ao menos uma missão. */
export function trainingDays(history: XpEvent[]): Set<string> {
  return new Set(history.filter((e) => e.source === 'lesson').map((e) => e.date));
}

export function daysTrainedInWeek(days: Set<string>, week: string): number {
  let count = 0;
  for (let i = 0; i < 7; i++) if (days.has(addDays(week, i))) count++;
  return count;
}

export interface WeekStatus {
  week: string;
  /** Dias treinados nesta semana. */
  done: number;
  goal: number;
  goalMet: boolean;
  /** Dias restantes na semana, contando hoje. */
  daysLeft: number;
  /** Só dá para bater a meta treinando todos os dias que restam. */
  atRisk: boolean;
  /** Sequência exibida: semanas fechadas + a atual, se a meta já foi batida. */
  displayStreak: number;
  /** Segunda a domingo: treinou naquele dia? */
  calendar: { date: string; trained: boolean; isToday: boolean; isFuture: boolean }[];
}

export function getWeekStatus(streak: Streak, history: XpEvent[], goal: number, today: string = toDateKey()): WeekStatus {
  const week = weekStart(today);
  const days = trainingDays(history);
  const done = daysTrainedInWeek(days, week);
  const goalMet = done >= goal;
  const daysLeft = 7 - daysBetween(week, today);
  const trainedToday = days.has(today);
  const remainingNeeded = goal - done;
  return {
    week,
    done,
    goal,
    goalMet,
    daysLeft,
    atRisk: !goalMet && remainingNeeded >= (trainedToday ? daysLeft - 1 : daysLeft),
    displayStreak: streak.current + (goalMet ? 1 : 0),
    calendar: Array.from({ length: 7 }, (_, i) => {
      const date = addDays(week, i);
      return { date, trained: days.has(date), isToday: date === today, isFuture: date > today };
    }),
  };
}

export type StreakReconcileEvent = 'none' | 'frozen' | 'lost';

export interface StreakReconcileResult {
  streak: Streak;
  event: StreakReconcileEvent;
  freezesUsed: number;
}

/**
 * Ao abrir o app: fecha as semanas que já terminaram. Semana com a meta cumprida soma 1;
 * semana abaixo da meta consome um Osso Reserva ou zera a sequência.
 */
export function reconcileWeeks(
  streak: Streak,
  history: XpEvent[],
  goal: number,
  today: string = toDateKey(),
): StreakReconcileResult {
  const lastClosed = addDays(weekStart(today), -7);
  if (!streak.lastEvaluatedWeek) {
    return { streak: { ...streak, lastEvaluatedWeek: lastClosed }, event: 'none', freezesUsed: 0 };
  }
  if (streak.lastEvaluatedWeek >= lastClosed) return { streak, event: 'none', freezesUsed: 0 };

  const days = trainingDays(history);
  let next = { ...streak, frozenWeeks: [...streak.frozenWeeks] };
  let freezesUsed = 0;
  let lost = false;

  for (let week = addDays(streak.lastEvaluatedWeek, 7); week <= lastClosed; week = addDays(week, 7)) {
    if (daysTrainedInWeek(days, week) >= goal) {
      next.current += 1;
      next.longest = Math.max(next.longest, next.current);
    } else if (next.current > 0 && next.freezesAvailable > 0) {
      next.freezesAvailable -= 1;
      next.frozenWeeks.push(week);
      freezesUsed += 1;
    } else {
      if (next.current > 0) lost = true;
      next.current = 0;
    }
  }
  next = { ...next, lastEvaluatedWeek: lastClosed };

  const event: StreakReconcileEvent = lost ? 'lost' : freezesUsed > 0 ? 'frozen' : 'none';
  return { streak: next, event, freezesUsed };
}

export interface WeekActivityResult {
  streak: Streak;
  /** Esta missão fez o tutor bater a meta da semana agora. */
  weekGoalReached: boolean;
  bonusXp: number;
  freezesEarned: number;
}

/** Registra uma missão cumprida hoje. `historyBefore` é o histórico antes desta missão. */
export function registerWeekActivity(
  streak: Streak,
  historyBefore: XpEvent[],
  goal: number,
  isPro: boolean,
  today: string = toDateKey(),
): WeekActivityResult {
  const week = weekStart(today);
  const days = trainingDays(historyBefore);
  const before = daysTrainedInWeek(days, week);
  const after = days.has(today) ? before : before + 1;
  const weekGoalReached = before < goal && after >= goal;

  let freezesEarned = 0;
  let next: Streak = { ...streak, lastActiveDate: today };
  if (weekGoalReached) {
    const weeksInARow = streak.current + 1;
    next.longest = Math.max(next.longest, weeksInARow);
    if (weeksInARow % FREEZE_EVERY_WEEKS[isPro ? 'pro' : 'free'] === 0) {
      const freezesAvailable = Math.min(MAX_STREAK_FREEZES, streak.freezesAvailable + 1);
      freezesEarned = freezesAvailable - streak.freezesAvailable;
      next = { ...next, freezesAvailable };
    }
  }

  return { streak: next, weekGoalReached, bonusXp: weekGoalReached ? WEEK_GOAL_BONUS_XP : 0, freezesEarned };
}

// ---------------------------------------------------------------------------
// Garras (XP) & Patentes
// ---------------------------------------------------------------------------

export function calculateLessonXp(lesson: Lesson, difficulty: Difficulty, previous?: LessonCompletion): number {
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
