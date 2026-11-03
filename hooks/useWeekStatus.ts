import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { getWeekStatus, toDateKey } from '@/services/gamification';
import { useAppStore } from '@/store/useAppStore';

/** Situação da semana atual (treinos feitos x meta) e a sequência em semanas. */
export function useWeekStatus() {
  const { streak, history, goal } = useAppStore(
    useShallow((s) => ({ streak: s.streak, history: s.progress.xpHistory, goal: s.user.weeklyGoalDays })),
  );
  const today = toDateKey();
  return useMemo(() => getWeekStatus(streak, history, goal, today), [streak, history, goal, today]);
}
