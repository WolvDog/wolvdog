import type {
  BehaviorChallenge,
  Difficulty,
  LessonCompletion,
  Pet,
  PetSize,
  BehaviorLog,
  ReviewItem,
  Streak,
  User,
  UserProgress,
} from '@/types';

import { supabase } from './supabase';

/** Tudo o que é sincronizado com a nuvem. Rascunhos de missão ficam só no aparelho. */
export interface CloudSnapshot {
  hasOnboarded: boolean;
  isPro: boolean;
  user: Pick<User, 'name' | 'dailyGoalMinutes' | 'weeklyGoalDays' | 'reminder' | 'partnerCode'>;
  pet: Pet | null;
  progress: UserProgress;
  streak: Streak;
  reviews: Record<string, ReviewItem>;
  behaviorLog: BehaviorLog;
}

/**
 * Repositório Supabase seguindo supabase/schema.sql.
 * Estratégia offline-first: o app grava local (Zustand) e envia o estado completo em segundo plano.
 */
export const repository = {
  async pull(userId: string): Promise<CloudSnapshot | null> {
    if (!supabase) return null;

    const [profile, pets, completions, xpEvents, streak] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
      supabase.from('pets').select('*').eq('owner_id', userId).order('created_at').limit(1),
      supabase.from('lesson_completions').select('*').eq('user_id', userId),
      supabase.from('xp_events').select('*').eq('user_id', userId).order('seq'),
      supabase.from('streaks').select('*').eq('user_id', userId).maybeSingle(),
    ]);
    const error = profile.error ?? pets.error ?? completions.error ?? xpEvents.error ?? streak.error;
    if (error) throw error;
    if (!profile.data) return null;

    const p = profile.data;
    const petRow = pets.data?.[0];

    return {
      hasOnboarded: p.has_onboarded,
      isPro: p.is_pro,
      user: {
        name: p.name,
        dailyGoalMinutes: p.daily_goal_minutes,
        weeklyGoalDays: p.weekly_goal_days ?? 3,
        partnerCode: p.partner_code ?? null,
        reminder: { enabled: p.reminder_enabled, hour: p.reminder_hour, minute: p.reminder_minute },
      },
      pet: petRow
        ? {
            id: petRow.id,
            ownerId: petRow.owner_id,
            name: petRow.name,
            breed: petRow.breed,
            ageMonths: petRow.age_months,
            size: petRow.size as PetSize,
            weightKg: petRow.weight_kg != null ? Number(petRow.weight_kg) : undefined,
            photoUri: petRow.photo_url ?? undefined,
            challenges: petRow.challenges as BehaviorChallenge[],
            createdAt: petRow.created_at,
          }
        : null,
      progress: {
        totalXp: p.total_xp,
        completedLessons: Object.fromEntries(
          (completions.data ?? []).map((c): [string, LessonCompletion] => [
            c.lesson_id,
            {
              lessonId: c.lesson_id,
              completedAt: c.completed_at,
              xpEarned: c.xp_earned,
              difficulty: c.difficulty as Difficulty,
              timesCompleted: c.times_completed,
            },
          ]),
        ),
        xpHistory: (xpEvents.data ?? []).map((e) => ({ date: e.date, amount: e.amount, source: e.source })),
      },
      streak: streak.data
        ? {
            current: streak.data.current,
            longest: streak.data.longest,
            lastActiveDate: streak.data.last_active_date,
            freezesAvailable: streak.data.freezes_available,
            frozenWeeks: streak.data.frozen_dates ?? [],
            lastEvaluatedWeek: streak.data.last_evaluated_week ?? null,
          }
        : { current: 0, longest: 0, lastActiveDate: null, freezesAvailable: 1, frozenWeeks: [], lastEvaluatedWeek: null },
      reviews: (p.review_queue as Record<string, ReviewItem> | null) ?? {},
      behaviorLog: (p.behavior_log as BehaviorLog | null) ?? {},
    };
  },

  async push(userId: string, snap: CloudSnapshot): Promise<void> {
    if (!supabase) return;
    const db = supabase;

    // O perfil precisa existir antes das tabelas filhas (chave estrangeira).
    const profile = await db.from('profiles').upsert({
      id: userId,
      name: snap.user.name,
      daily_goal_minutes: snap.user.dailyGoalMinutes,
      weekly_goal_days: snap.user.weeklyGoalDays,
      review_queue: snap.reviews,
      partner_code: snap.user.partnerCode,
      behavior_log: snap.behaviorLog,
      total_xp: snap.progress.totalXp,
      has_onboarded: snap.hasOnboarded,
      reminder_enabled: snap.user.reminder.enabled,
      reminder_hour: snap.user.reminder.hour,
      reminder_minute: snap.user.reminder.minute,
      updated_at: new Date().toISOString(),
    });
    if (profile.error) throw profile.error;

    const writes = [
      db.from('streaks').upsert({
        user_id: userId,
        current: snap.streak.current,
        longest: snap.streak.longest,
        last_active_date: snap.streak.lastActiveDate,
        freezes_available: snap.streak.freezesAvailable,
        frozen_dates: snap.streak.frozenWeeks,
        last_evaluated_week: snap.streak.lastEvaluatedWeek,
      }),
    ];

    if (snap.pet) {
      writes.push(
        db.from('pets').upsert({
          id: snap.pet.id,
          owner_id: userId,
          name: snap.pet.name,
          breed: snap.pet.breed,
          age_months: snap.pet.ageMonths,
          size: snap.pet.size,
          weight_kg: snap.pet.weightKg ?? null,
          // Fotos locais (file://) ainda não vão para o Storage — só URLs públicas.
          photo_url: snap.pet.photoUri?.startsWith('http') ? snap.pet.photoUri : null,
          challenges: snap.pet.challenges,
        }),
      );
    }

    const completions = Object.values(snap.progress.completedLessons);
    if (completions.length > 0) {
      writes.push(
        db.from('lesson_completions').upsert(
          completions.map((c) => ({
            user_id: userId,
            lesson_id: c.lessonId,
            completed_at: c.completedAt,
            xp_earned: c.xpEarned,
            difficulty: c.difficulty,
            times_completed: c.timesCompleted,
          })),
        ),
      );
    }

    if (snap.progress.xpHistory.length > 0) {
      writes.push(
        db.from('xp_events').upsert(
          snap.progress.xpHistory.map((e, seq) => ({ user_id: userId, seq, date: e.date, amount: e.amount, source: e.source })),
        ),
      );
    }

    const results = await Promise.all(writes);
    const failed = results.find((r) => r.error);
    if (failed?.error) throw failed.error;
  },
};
