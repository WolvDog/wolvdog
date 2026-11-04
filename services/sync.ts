import { AppState } from 'react-native';

import { useAppStore } from '@/store/useAppStore';

import { repository } from './api';
import { isSupabaseConfigured, supabase } from './supabase';

const PUSH_DEBOUNCE_MS = 1500;

let applyingRemote = false;
let pushTimer: ReturnType<typeof setTimeout> | null = null;
/** Mudou algo depois que o último envio tirou a foto do estado? */
let changedDuringPush = false;
/** Conta já conciliada nesta abertura do app (evita puxar duas vezes no INITIAL_SESSION + SIGNED_IN). */
let reconciledFor: string | null = null;

async function pushNow(userId: string) {
  if (pushTimer) {
    clearTimeout(pushTimer);
    pushTimer = null;
  }
  const store = useAppStore.getState();
  store.setSyncStatus('syncing');
  changedDuringPush = false;
  try {
    await repository.push(userId, store.getCloudSnapshot());
    if (changedDuringPush) useAppStore.getState().setSyncStatus('idle');
    else useAppStore.getState().markSynced(userId);
  } catch (e) {
    // Fica marcado como pendente: tenta de novo na próxima mudança ou ao abrir o app.
    console.warn('[sync] push falhou', e);
    useAppStore.getState().setSyncStatus('error');
  }
}

/**
 * Concilia aparelho e nuvem ao abrir o app ou entrar na conta:
 * - mudanças locais que não chegaram à nuvem (treino offline) são enviadas primeiro, sem perder nada;
 * - senão, se a conta já tem jornada salva, a nuvem vence (traz o que foi feito em outro aparelho);
 * - conta nova recebe o que o tutor já fez no aparelho (inclusive o onboarding).
 */
export async function syncOnSignIn(userId: string) {
  const store = useAppStore.getState();
  if (store.syncedUserId === userId && store.pendingPush && store.hasOnboarded) return pushNow(userId);

  store.setSyncStatus('syncing');
  try {
    const remote = await repository.pull(userId);
    if (remote?.hasOnboarded) {
      applyingRemote = true;
      useAppStore.getState().applyCloudSnapshot(remote);
      applyingRemote = false;
      // A sequência salva pode ter semanas fechadas desde o último envio.
      useAppStore.getState().reconcileStreakOnOpen();
      useAppStore.getState().markSynced(userId);
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

  const unsubscribe = useAppStore.subscribe((state, prev) => {
    if (applyingRemote || !state.authUserId) return;
    const changed =
      state.progress !== prev.progress ||
      state.streak !== prev.streak ||
      state.reviews !== prev.reviews ||
      state.behaviorLog !== prev.behaviorLog ||
      state.guideReads !== prev.guideReads ||
      state.pet !== prev.pet ||
      state.user !== prev.user ||
      state.isPro !== prev.isPro ||
      state.hasOnboarded !== prev.hasOnboarded;
    if (!changed) return;

    changedDuringPush = true;
    state.markPendingPush();
    if (pushTimer) clearTimeout(pushTimer);
    const userId = state.authUserId;
    pushTimer = setTimeout(() => void pushNow(userId), PUSH_DEBOUNCE_MS);
  });

  // Indo para segundo plano: envia já o que estava esperando o debounce (o app pode ser fechado).
  const appState = AppState.addEventListener('change', (next) => {
    const userId = useAppStore.getState().authUserId;
    if (next === 'background' && pushTimer && userId) void pushNow(userId);
  });

  return () => {
    unsubscribe();
    appState.remove();
  };
}

/** Escuta a sessão do Supabase e mantém a store em dia. */
export function startAuthListener(): () => void {
  const store = useAppStore.getState();
  if (!supabase) {
    store.setAuth(null);
    return () => {};
  }

  // INITIAL_SESSION chega logo ao assinar (com a sessão salva, se houver); SIGNED_IN, ao entrar na conta.
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    const user = session?.user;
    useAppStore.getState().setAuth(user ? { userId: user.id, email: user.email ?? null } : null);
    if (!user || (event !== 'INITIAL_SESSION' && event !== 'SIGNED_IN')) return;
    if (reconciledFor === user.id) return;
    reconciledFor = user.id;
    void syncOnSignIn(user.id);
  });

  return () => data.subscription.unsubscribe();
}

export async function signOut() {
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = null;
  reconciledFor = null;
  await supabase?.auth.signOut();
  useAppStore.getState().clearLocalData();
}
