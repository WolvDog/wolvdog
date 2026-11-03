import { useAppStore } from '@/store/useAppStore';

import { repository } from './api';
import { isSupabaseConfigured, supabase } from './supabase';

const PUSH_DEBOUNCE_MS = 1500;

let applyingRemote = false;
let pushTimer: ReturnType<typeof setTimeout> | null = null;

async function pushNow(userId: string) {
  const store = useAppStore.getState();
  store.setSyncStatus('syncing');
  try {
    await repository.push(userId, store.getCloudSnapshot());
    useAppStore.getState().setSyncStatus('synced');
  } catch (e) {
    console.warn('[sync] push falhou', e);
    useAppStore.getState().setSyncStatus('error');
  }
}

/**
 * Logo após o login: se a conta já tem jornada salva, a nuvem vence;
 * se é conta nova, envia o que o tutor já fez no aparelho (inclusive o onboarding).
 */
export async function syncOnSignIn(userId: string) {
  const store = useAppStore.getState();
  store.setSyncStatus('syncing');
  try {
    const remote = await repository.pull(userId);
    if (remote?.hasOnboarded) {
      applyingRemote = true;
      useAppStore.getState().applyCloudSnapshot(remote);
      applyingRemote = false;
      useAppStore.getState().setSyncStatus('synced');
    } else {
      await pushNow(userId);
    }
  } catch (e) {
    applyingRemote = false;
    console.warn('[sync] pull falhou', e);
    useAppStore.getState().setSyncStatus('error');
  }
}

/** Observa a store e envia mudanças relevantes para a nuvem (com debounce). Retorna a função de cancelamento. */
export function startAutoSync(): () => void {
  if (!isSupabaseConfigured) return () => {};

  return useAppStore.subscribe((state, prev) => {
    if (applyingRemote || !state.authUserId) return;
    const changed =
      state.progress !== prev.progress ||
      state.streak !== prev.streak ||
      state.reviews !== prev.reviews ||
      state.behaviorLog !== prev.behaviorLog ||
      state.pet !== prev.pet ||
      state.user !== prev.user ||
      state.hasOnboarded !== prev.hasOnboarded;
    if (!changed) return;

    if (pushTimer) clearTimeout(pushTimer);
    const userId = state.authUserId;
    pushTimer = setTimeout(() => void pushNow(userId), PUSH_DEBOUNCE_MS);
  });
}

/** Escuta a sessão do Supabase e mantém a store em dia. */
export function startAuthListener(): () => void {
  const store = useAppStore.getState();
  if (!supabase) {
    store.setAuth(null);
    return () => {};
  }

  void supabase.auth.getSession().then(({ data }) => {
    const user = data.session?.user;
    useAppStore.getState().setAuth(user ? { userId: user.id, email: user.email ?? null } : null);
  });

  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    const user = session?.user;
    useAppStore.getState().setAuth(user ? { userId: user.id, email: user.email ?? null } : null);
    if (event === 'SIGNED_IN' && user) void syncOnSignIn(user.id);
  });

  return () => data.subscription.unsubscribe();
}

export async function signOut() {
  if (pushTimer) clearTimeout(pushTimer);
  await supabase?.auth.signOut();
  useAppStore.getState().clearLocalData();
}
