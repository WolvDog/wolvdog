import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { AppState, Platform } from 'react-native';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

/** Sem as variáveis no .env o app funciona 100% local (sem login). */
export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url!, anonKey!, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : null;

// Renova o token só com o app em primeiro plano (recomendação do Supabase para React Native).
if (supabase && Platform.OS !== 'web') {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') void supabase.auth.startAutoRefresh();
    else void supabase.auth.stopAutoRefresh();
  });
}

/** Traduz os erros mais comuns do Supabase Auth para o usuário. */
export function authErrorMessage(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('unable to validate email') || m.includes('invalid email')) return 'Esse e-mail não parece válido.';
  if (m.includes('expired') || (m.includes('invalid') && m.includes('token'))) return 'Código inválido ou expirado. Confira o e-mail ou peça um novo.';
  if (m.includes('rate limit')) return 'Muitos e-mails enviados em pouco tempo. Aguarde alguns minutos e tente de novo.';
  if (m.includes('security purposes')) return 'Aguarde alguns segundos antes de pedir outro código.';
  if (m.includes('signups not allowed')) return 'Cadastros estão temporariamente desativados.';
  if (m.includes('network')) return 'Sem conexão. Verifique sua internet.';
  return message;
}
