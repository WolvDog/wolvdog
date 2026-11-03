import { useEffect } from 'react';
import { AppState } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

import { toDateKey } from '@/services/gamification';
import { remindersSupported, rescheduleReminders } from '@/services/notifications';
import { useAppStore } from '@/store/useAppStore';

import { useWeekStatus } from './useWeekStatus';

/** Mantém os lembretes do Logan agendados conforme o estado do tutor (e ao voltar para o app). */
export function useReminderSync() {
  const { reminder, petName, tutorName, lastActiveDate, hasOnboarded } = useAppStore(
    useShallow((s) => ({
      reminder: s.user.reminder,
      petName: s.pet?.name ?? 'Seu cão',
      tutorName: s.user.name,
      lastActiveDate: s.streak.lastActiveDate,
      hasOnboarded: s.hasOnboarded,
    })),
  );
  const week = useWeekStatus();
  const streakWeeks = week.displayStreak;
  const weekRemaining = Math.max(0, week.goal - week.done);

  useEffect(() => {
    if (!remindersSupported || !hasOnboarded) return;

    const run = () =>
      void rescheduleReminders({
        reminder,
        petName,
        tutorName,
        streakWeeks,
        weekRemaining,
        trainedToday: lastActiveDate === toDateKey(),
      }).catch((e) => console.warn('[reminders]', e));

    run();
    const sub = AppState.addEventListener('change', (state) => state === 'active' && run());
    return () => sub.remove();
  }, [reminder, petName, tutorName, streakWeeks, weekRemaining, lastActiveDate, hasOnboarded]);
}
