import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { MODULES } from '@/data/mockData';
import { getLevelInfo } from '@/services/gamification';
import { getCurrentLesson, type ProgressSnapshot } from '@/services/progression';
import { useAppStore } from '@/store/useAppStore';

/** Snapshot reativo do progresso + dados derivados usados pela trilha e pelo perfil. */
export function useProgression() {
  const { completedLessons, lessonDrafts, isPro, totalXp } = useAppStore(
    useShallow((s) => ({
      completedLessons: s.progress.completedLessons,
      lessonDrafts: s.lessonDrafts,
      isPro: s.isPro,
      totalXp: s.progress.totalXp,
    })),
  );

  return useMemo(() => {
    const snapshot: ProgressSnapshot = { completedLessons, lessonDrafts, isPro };
    const totalLessons = MODULES.reduce((sum, m) => sum + m.lessons.length, 0);
    const completedCount = Object.keys(completedLessons).length;
    return {
      snapshot,
      modules: MODULES,
      currentLesson: getCurrentLesson(MODULES, snapshot),
      level: getLevelInfo(totalXp),
      totalXp,
      completedCount,
      totalLessons,
    };
  }, [completedLessons, lessonDrafts, isPro, totalXp]);
}
