import type { LessonCompletion, Pet, UserProgress } from '@/types';

/**
 * Repositório de dados "Supabase-ready".
 * Hoje tudo vive no Zustand persistido localmente (offline-first). Quando as variáveis
 * EXPO_PUBLIC_SUPABASE_* forem definidas, implemente SupabaseRepository com @supabase/supabase-js
 * seguindo o schema em supabase/schema.sql — o store chama apenas esta interface.
 */
export interface WolverBarkRepository {
  upsertPet(pet: Pet): Promise<void>;
  saveLessonCompletion(userId: string, completion: LessonCompletion): Promise<void>;
  fetchProgress(userId: string): Promise<UserProgress | null>;
}

export const isSupabaseConfigured = Boolean(
  process.env.EXPO_PUBLIC_SUPABASE_URL && process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
);

/** Implementação local: no-op, pois o estado já é persistido pelo store. */
const localRepository: WolverBarkRepository = {
  async upsertPet() {},
  async saveLessonCompletion() {},
  async fetchProgress() {
    return null;
  },
};

export const repository: WolverBarkRepository = localRepository;
