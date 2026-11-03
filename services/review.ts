import {
  DAILY_REVIEW_LIMIT,
  REVIEW_FIRST_INTERVAL,
  REVIEW_GROWTH,
  REVIEW_MAX_INTERVAL,
} from '@/constants/gamification';
import type { Difficulty, ReviewItem } from '@/types';

import { addDays, toDateKey } from './gamification';

/**
 * Reforço adaptativo (repetição espaçada): cada missão cumprida volta para revisão.
 * "Difícil" volta amanhã; quanto mais fácil, mais o intervalo cresce.
 */
export function scheduleReview(previous: ReviewItem | undefined, lessonId: string, difficulty: Difficulty, today = toDateKey()): ReviewItem {
  const intervalDays = previous
    ? difficulty === 'hard'
      ? REVIEW_FIRST_INTERVAL.hard
      : Math.min(REVIEW_MAX_INTERVAL, Math.max(previous.intervalDays + 1, Math.round(previous.intervalDays * REVIEW_GROWTH[difficulty])))
    : REVIEW_FIRST_INTERVAL[difficulty];

  return { lessonId, intervalDays, lastDifficulty: difficulty, dueDate: addDays(today, intervalDays) };
}

/** Reforços disponíveis hoje — os atrasados e os "difíceis" primeiro. */
export function getDueReviews(reviews: Record<string, ReviewItem>, today = toDateKey(), limit = DAILY_REVIEW_LIMIT): ReviewItem[] {
  const weight = { hard: 0, medium: 1, easy: 2 } as const;
  return Object.values(reviews)
    .filter((r) => r.dueDate <= today)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate) || weight[a.lastDifficulty] - weight[b.lastDifficulty])
    .slice(0, limit);
}
