import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { supabase } from './supabase';

/**
 * Push enviado pelo servidor (Expo Push → FCM no Android).
 * Cada aparelho logado e com notificações permitidas salva seu token na tabela `push_tokens` (migração 008).
 * Não pede permissão aqui: isso acontece no onboarding e nos ajustes de lembrete.
 */
const PUSH_CHANNEL_ID = 'default';

let registered: { userId: string; token: string } | null = null;

export async function registerPushToken(userId: string): Promise<void> {
  if (Platform.OS === 'web' || !supabase || !Device.isDevice) return;
  if (registered?.userId === userId) return;
  try {
    const permission = await Notifications.getPermissionsAsync();
    if (!permission.granted) return;

    // Canal usado pelos pushes do servidor (o Expo envia para "default" quando o push não indica outro).
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(PUSH_CHANNEL_ID, {
        name: 'Avisos do WolverBark',
        importance: Notifications.AndroidImportance.HIGH,
        lightColor: '#FFC72C',
      });
    }

    const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
    const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });
    const { error } = await supabase.from('push_tokens').upsert({
      token,
      user_id: userId,
      platform: Platform.OS === 'ios' ? 'ios' : 'android',
      updated_at: new Date().toISOString(),
    });
    if (error) throw error;
    registered = { userId, token };
  } catch (e) {
    // Sem a migração 008, sem internet ou sem Firebase configurado: tenta de novo na próxima abertura.
    console.warn('[push] não foi possível registrar o aparelho', e);
  }
}

/** Ao sair da conta: este aparelho deixa de receber os pushes daquela conta. */
export async function unregisterPushToken(): Promise<void> {
  if (!registered || !supabase) return;
  const { token } = registered;
  registered = null;
  const { error } = await supabase.from('push_tokens').delete().eq('token', token);
  if (error) console.warn('[push] não foi possível remover o aparelho', error.message);
}
