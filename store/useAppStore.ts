import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { getLessonById, MOCK_USER } from '@/data/mockData';
import type { CloudSnapshot } from '@/services/api';
import {
  calculateLessonXp,
  getLevelInfo,
  getWeekStatus,
  reconcileWeeks,
  registerWeekActivity,
  type StreakReconcileEvent,
  toDateKey,
} from '@/services/gamification';
import { scheduleReview } from '@/services/review';
import type {
  Difficulty,
  LessonCompletion,
  Pet,
  ReminderSettings,
  ReviewItem,
  Streak,
  User,
  UserProgress,
  WeeklyGoalDays,
} from '@/types';

export interface LessonCompletionResult {
  xpEarned: number;
  /** Bônus por bater a meta semanal com esta missão. */
  streakBonusXp: number;
  totalXp: number;
  /** Treinos da semana após esta missão, e a meta. */
  weekDone: number;
  weekGoal: number;
  weekGoalReached: boolean;
  /** Sequência exibida em semanas (inclui a atual se a meta foi batida). */
  streakWeeks: number;
  freezesEarned: number;
  isFirstCompletion: boolean;
  leveledUpTo: number | null;
  /** Em quantos dias o Logan traz esta missão de volta como reforço. */
  reviewInDays: number;
}

export type PaywallSource = 'locked_module' | 'profile' | 'streak_freeze' | 'add_pet';
export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error';

type PetInput = Omit<Pet, 'id' | 'ownerId' | 'createdAt'> & Partial<Pick<Pet, 'id'>>;

export interface OnboardingInput {
  tutorName: string;
  dailyGoalMinutes: User['dailyGoalMinutes'];
  weeklyGoalDays: WeeklyGoalDays;
  reminder: ReminderSettings;
  pet: PetInput;
}

interface AppState {
  // --- estado persistido ---
  hasOnboarded: boolean;
  /** Tutor escolheu "continuar sem conta" (dados só no aparelho). */
  authSkipped: boolean;
  user: User;
  pet: Pet | null;
  isPro: boolean;
  progress: UserProgress;
  streak: Streak;
  /** Fila de reforço adaptativo (missões cumpridas que voltam para revisão). */
  reviews: Record<string, ReviewItem>;
  lessonDrafts: Record<string, number>;

  // --- estado efêmero ---
  hasHydrated: boolean;
  /** Sessão do Supabase já foi verificada na abertura do app. */
  authReady: boolean;
  authUserId: string | null;
  authEmail: string | null;
  /** Tutor tocou em "Já tenho conta" antes do onboarding — libera a tela de login. */
  loginRequested: boolean;
  syncStatus: SyncStatus;
  paywall: { visible: boolean; source: PaywallSource | null };
  lastStreakEvent: { event: Exclude<StreakReconcileEvent, 'none'>; freezesUsed: number } | null;

  // --- ações ---
  completeOnboarding: (input: OnboardingInput) => void;
  restartOnboarding: () => void;
  savePet: (pet: PetInput) => void;
  setReminder: (reminder: ReminderSettings) => void;
  setWeeklyGoal: (days: WeeklyGoalDays) => void;
  completeLesson: (lessonId: string, difficulty: Difficulty) => LessonCompletionResult | null;
  saveLessonDraft: (lessonId: string, stepIndex: number) => void;
  clearLessonDraft: (lessonId: string) => void;
  reconcileStreakOnOpen: () => void;
  dismissStreakEvent: () => void;
  setPro: (isPro: boolean) => void;
  openPaywall: (source: PaywallSource) => void;
  closePaywall: () => void;
  resetProgress: () => void;

  setAuth: (auth: { userId: string; email: string | null } | null) => void;
  skipAuth: () => void;
  requestLogin: (requested: boolean) => void;
  setSyncStatus: (status: SyncStatus) => void;
  getCloudSnapshot: () => CloudSnapshot;
  applyCloudSnapshot: (snap: CloudSnapshot) => void;
  /** Ao sair da conta: limpa os dados locais para não misturar contas no mesmo aparelho. */
  clearLocalData: () => void;
}

const initialProgress: UserProgress = { totalXp: 0, completedLessons: {}, xpHistory: [] };

const initialStreak: Streak = {
  current: 0,
  longest: 0,
  lastActiveDate: null,
  freezesAvailable: 1, // presente de boas-vindas do Logan
  frozenWeeks: [],
  lastEvaluatedWeek: null,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      hasOnboarded: false,
      authSkipped: false,
      user: MOCK_USER,
      pet: null,
      isPro: false,
      progress: initialProgress,
      streak: initialStreak,
      reviews: {},
      lessonDrafts: {},

      hasHydrated: false,
      authReady: false,
      authUserId: null,
      authEmail: null,
      loginRequested: false,
      syncStatus: 'idle',
      paywall: { visible: false, source: null },
      lastStreakEvent: null,

      completeOnboarding: ({ tutorName, dailyGoalMinutes, weeklyGoalDays, reminder, pet }) => {
        set((s) => ({ user: { ...s.user, name: tutorName, dailyGoalMinutes, weeklyGoalDays, reminder } }));
        get().savePet(pet);
        set({ hasOnboarded: true });
      },

      restartOnboarding: () => set({ hasOnboarded: false }),

      savePet: (input) => {
        const current = get().pet;
        const pet: Pet = {
          ...input,
          id: input.id ?? current?.id ?? `pet-${Date.now()}`,
          ownerId: get().authUserId ?? get().user.id,
          createdAt: current?.createdAt ?? new Date().toISOString(),
        };
        set({ pet });
      },

      setReminder: (reminder) => set((s) => ({ user: { ...s.user, reminder } })),

      setWeeklyGoal: (weeklyGoalDays) => set((s) => ({ user: { ...s.user, weeklyGoalDays } })),

      completeLesson: (lessonId, difficulty) => {
        const lesson = getLessonById(lessonId);
        if (!lesson) return null;

        const { progress, streak, isPro, lessonDrafts, reviews, user } = get();
        const today = toDateKey();
        const previous = progress.completedLessons[lessonId];
        const goal = user.weeklyGoalDays;

        const xpEarned = calculateLessonXp(lesson, difficulty, previous);
        const activity = registerWeekActivity(streak, progress.xpHistory, goal, isPro, today);
        const totalXp = progress.totalXp + xpEarned + activity.bonusXp;
        const review = scheduleReview(reviews[lessonId], lessonId, difficulty, today);

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
        const week = getWeekStatus(activity.streak, xpHistory, goal, today);

        const { [lessonId]: _discarded, ...remainingDrafts } = lessonDrafts;

        set({
          progress: {
            totalXp,
            completedLessons: { ...progress.completedLessons, [lessonId]: completion },
            xpHistory,
          },
          streak: activity.streak,
          reviews: { ...reviews, [lessonId]: review },
          lessonDrafts: remainingDrafts,
        });

        return {
          xpEarned,
          streakBonusXp: activity.bonusXp,
          totalXp,
          weekDone: week.done,
          weekGoal: goal,
          weekGoalReached: activity.weekGoalReached,
          streakWeeks: week.displayStreak,
          freezesEarned: activity.freezesEarned,
          isFirstCompletion: !previous,
          leveledUpTo: levelAfter > levelBefore ? levelAfter : null,
          reviewInDays: review.intervalDays,
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
        const { streak, progress, user } = get();
        const result = reconcileWeeks(streak, progress.xpHistory, user.weeklyGoalDays);
        if (result.streak !== streak) set({ streak: result.streak });
        if (result.event === 'none') return;
        set({ streak: result.streak, lastStreakEvent: { event: result.event, freezesUsed: result.freezesUsed } });
      },

      dismissStreakEvent: () => set({ lastStreakEvent: null }),

      setPro: (isPro) => set({ isPro }),

      openPaywall: (source) => set({ paywall: { visible: true, source } }),
      // Mantém a origem durante a animação de saída para o título não trocar.
      closePaywall: () => set((s) => ({ paywall: { ...s.paywall, visible: false } })),

      resetProgress: () =>
        set({ progress: initialProgress, streak: initialStreak, reviews: {}, lessonDrafts: {}, lastStreakEvent: null }),

      setAuth: (auth) =>
        set({
          authReady: true,
          authUserId: auth?.userId ?? null,
          authEmail: auth?.email ?? null,
          ...(auth ? { authSkipped: false } : {}),
        }),

      skipAuth: () => set({ authSkipped: true }),

      requestLogin: (loginRequested) => set({ loginRequested }),

      setSyncStatus: (syncStatus) => set({ syncStatus }),

      getCloudSnapshot: () => {
        const s = get();
        return {
          hasOnboarded: s.hasOnboarded,
          isPro: s.isPro,
          user: {
            name: s.user.name,
            dailyGoalMinutes: s.user.dailyGoalMinutes,
            weeklyGoalDays: s.user.weeklyGoalDays,
            reminder: s.user.reminder,
          },
          pet: s.pet,
          progress: s.progress,
          streak: s.streak,
          reviews: s.reviews,
        };
      },

      applyCloudSnapshot: (snap) =>
        set((s) => ({
          hasOnboarded: snap.hasOnboarded,
          // Enquanto o RevenueCat é simulado, mantém o Pro local também.
          isPro: snap.isPro || s.isPro,
          user: { ...s.user, ...snap.user },
          // A foto ainda vive só no aparelho: preserva a local se for o mesmo pet.
          pet: snap.pet ? { ...snap.pet, photoUri: snap.pet.photoUri ?? (s.pet?.id === snap.pet.id ? s.pet.photoUri : undefined) } : null,
          progress: snap.progress,
          streak: snap.streak,
          reviews: snap.reviews,
        })),

      clearLocalData: () =>
        set({
          hasOnboarded: false,
          authSkipped: false,
          user: MOCK_USER,
          pet: null,
          isPro: false,
          progress: initialProgress,
          streak: initialStreak,
          reviews: {},
          lessonDrafts: {},
          lastStreakEvent: null,
          syncStatus: 'idle',
        }),
    }),
    {
      name: 'wolverbark-store',
      version: 3,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        hasOnboarded: s.hasOnboarded,
        authSkipped: s.authSkipped,
        user: s.user,
        pet: s.pet,
        isPro: s.isPro,
        progress: s.progress,
        streak: s.streak,
        reviews: s.reviews,
        lessonDrafts: s.lessonDrafts,
      }),
      migrate: (persisted, version) => {
        const state = persisted as Partial<AppState>;
        // v2: lembretes diários no perfil do tutor.
        if (version < 2 && state.user) {
          state.user = { ...MOCK_USER, ...state.user, reminder: state.user.reminder ?? MOCK_USER.reminder };
        }
        // v3: sequência passa a ser semanal + fila de reforço.
        if (version < 3) {
          if (state.user) state.user = { ...state.user, weeklyGoalDays: state.user.weeklyGoalDays ?? 3 };
          const old = state.streak as Partial<Streak> | undefined;
          state.streak = { ...initialStreak, freezesAvailable: old?.freezesAvailable ?? 1, lastActiveDate: old?.lastActiveDate ?? null };
          // Missões já cumpridas entram na fila de reforço a partir de amanhã.
          const today = toDateKey();
          state.reviews = Object.fromEntries(
            Object.values(state.progress?.completedLessons ?? {}).map((c) => [c.lessonId, scheduleReview(undefined, c.lessonId, c.difficulty, today)]),
          );
        }
        return state as AppState;
      },
      onRehydrateStorage: () => () => {
        useAppStore.setState({ hasHydrated: true });
      },
    },
  ),
);
