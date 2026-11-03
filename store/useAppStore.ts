import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { getLessonById, MOCK_USER } from '@/data/mockData';
import { repository } from '@/services/api';
import {
  calculateLessonXp,
  getLevelInfo,
  reconcileStreak,
  registerStreakActivity,
  type StreakReconcileEvent,
  toDateKey,
} from '@/services/gamification';
import type { Difficulty, LessonCompletion, Pet, Streak, User, UserProgress } from '@/types';

export interface LessonCompletionResult {
  xpEarned: number;
  streakBonusXp: number;
  totalXp: number;
  streak: Streak;
  streakIncreased: boolean;
  freezesEarned: number;
  isFirstCompletion: boolean;
  leveledUpTo: number | null;
}

export type PaywallSource = 'locked_module' | 'profile' | 'streak_freeze' | 'add_pet';

type PetInput = Omit<Pet, 'id' | 'ownerId' | 'createdAt'> & Partial<Pick<Pet, 'id'>>;

export interface OnboardingInput {
  tutorName: string;
  dailyGoalMinutes: User['dailyGoalMinutes'];
  pet: PetInput;
}

interface AppState {
  // --- estado persistido ---
  hasOnboarded: boolean;
  user: User;
  pet: Pet | null;
  isPro: boolean;
  progress: UserProgress;
  streak: Streak;
  lessonDrafts: Record<string, number>;

  // --- estado efêmero ---
  hasHydrated: boolean;
  paywall: { visible: boolean; source: PaywallSource | null };
  lastStreakEvent: { event: Exclude<StreakReconcileEvent, 'none'>; freezesUsed: number } | null;

  // --- ações ---
  completeOnboarding: (input: OnboardingInput) => void;
  restartOnboarding: () => void;
  savePet: (pet: PetInput) => void;
  completeLesson: (lessonId: string, difficulty: Difficulty) => LessonCompletionResult | null;
  saveLessonDraft: (lessonId: string, stepIndex: number) => void;
  clearLessonDraft: (lessonId: string) => void;
  reconcileStreakOnOpen: () => void;
  dismissStreakEvent: () => void;
  setPro: (isPro: boolean) => void;
  openPaywall: (source: PaywallSource) => void;
  closePaywall: () => void;
  resetProgress: () => void;
}

const initialProgress: UserProgress = { totalXp: 0, completedLessons: {}, xpHistory: [] };

const initialStreak: Streak = {
  current: 0,
  longest: 0,
  lastActiveDate: null,
  freezesAvailable: 1, // presente de boas-vindas do Logan
  frozenDates: [],
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      hasOnboarded: false,
      user: MOCK_USER,
      pet: null,
      isPro: false,
      progress: initialProgress,
      streak: initialStreak,
      lessonDrafts: {},

      hasHydrated: false,
      paywall: { visible: false, source: null },
      lastStreakEvent: null,

      completeOnboarding: ({ tutorName, dailyGoalMinutes, pet }) => {
        set((s) => ({ user: { ...s.user, name: tutorName, dailyGoalMinutes } }));
        get().savePet(pet);
        set({ hasOnboarded: true });
      },

      restartOnboarding: () => set({ hasOnboarded: false }),

      savePet: (input) => {
        const current = get().pet;
        const pet: Pet = {
          ...input,
          id: input.id ?? current?.id ?? `pet-${Date.now()}`,
          ownerId: get().user.id,
          createdAt: current?.createdAt ?? new Date().toISOString(),
        };
        set({ pet });
        void repository.upsertPet(pet);
      },

      completeLesson: (lessonId, difficulty) => {
        const lesson = getLessonById(lessonId);
        if (!lesson) return null;

        const { progress, streak, isPro, user, lessonDrafts } = get();
        const today = toDateKey();
        const previous = progress.completedLessons[lessonId];

        const xpEarned = calculateLessonXp(lesson, difficulty, previous);
        const activity = registerStreakActivity(streak, isPro, today);
        const totalXp = progress.totalXp + xpEarned + activity.bonusXp;

        const completion: LessonCompletion = {
          lessonId,
          completedAt: new Date().toISOString(),
          xpEarned: (previous?.xpEarned ?? 0) + xpEarned,
          difficulty,
          timesCompleted: (previous?.timesCompleted ?? 0) + 1,
        };

        const levelBefore = getLevelInfo(progress.totalXp).level;
        const levelAfter = getLevelInfo(totalXp).level;

        const xpHistory = [...progress.xpHistory, { date: today, amount: xpEarned, source: 'lesson' as const }];
        if (activity.bonusXp > 0) xpHistory.push({ date: today, amount: activity.bonusXp, source: 'streak_bonus' });

        const { [lessonId]: _discarded, ...remainingDrafts } = lessonDrafts;

        set({
          progress: {
            totalXp,
            completedLessons: { ...progress.completedLessons, [lessonId]: completion },
            xpHistory,
          },
          streak: activity.streak,
          lessonDrafts: remainingDrafts,
        });
        void repository.saveLessonCompletion(user.id, completion);

        return {
          xpEarned,
          streakBonusXp: activity.bonusXp,
          totalXp,
          streak: activity.streak,
          streakIncreased: activity.increased,
          freezesEarned: activity.freezesEarned,
          isFirstCompletion: !previous,
          leveledUpTo: levelAfter > levelBefore ? levelAfter : null,
        };
      },

      saveLessonDraft: (lessonId, stepIndex) =>
        set((s) => ({ lessonDrafts: { ...s.lessonDrafts, [lessonId]: stepIndex } })),

      clearLessonDraft: (lessonId) =>
        set((s) => {
          const { [lessonId]: _discarded, ...rest } = s.lessonDrafts;
          return { lessonDrafts: rest };
        }),

      reconcileStreakOnOpen: () => {
        const result = reconcileStreak(get().streak);
        if (result.event === 'none') return;
        set({ streak: result.streak, lastStreakEvent: { event: result.event, freezesUsed: result.freezesUsed } });
      },

      dismissStreakEvent: () => set({ lastStreakEvent: null }),

      setPro: (isPro) => set({ isPro }),

      openPaywall: (source) => set({ paywall: { visible: true, source } }),
      // Mantém a origem durante a animação de saída para o título não trocar.
      closePaywall: () => set((s) => ({ paywall: { ...s.paywall, visible: false } })),

      resetProgress: () =>
        set({ progress: initialProgress, streak: initialStreak, lessonDrafts: {}, lastStreakEvent: null }),
    }),
    {
      name: 'wolverbark-store',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        hasOnboarded: s.hasOnboarded,
        user: s.user,
        pet: s.pet,
        isPro: s.isPro,
        progress: s.progress,
        streak: s.streak,
        lessonDrafts: s.lessonDrafts,
      }),
      onRehydrateStorage: () => () => {
        useAppStore.setState({ hasHydrated: true });
      },
    },
  ),
);
