import { router } from 'expo-router';
import { Bell, Cloud, CloudOff, LogOut } from 'lucide-react-native';
import { Pressable, Switch, Text, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

import { COLORS, FONTS } from '@/constants/theme';
import { showAlert, showConfirm } from '@/services/dialog';
import { formatTime, REMINDER_TIMES, remindersSupported, requestReminderPermission } from '@/services/notifications';
import { isSupabaseConfigured } from '@/services/supabase';
import { signOut } from '@/services/sync';
import { useAppStore } from '@/store/useAppStore';

import { Chip } from './form';
import { HeroButton } from './HeroButton';

const TITLE = { fontFamily: FONTS.display, fontSize: 20, color: COLORS.ink } as const;

const SYNC_LABEL = {
  idle: 'Conectado',
  syncing: 'Sincronizando…',
  synced: 'Tudo salvo na nuvem',
  error: 'Falha ao sincronizar — tentaremos de novo',
} as const;

/** Cartões de lembretes diários e de conta/sincronização, exibidos no perfil. */
export function AccountSettings() {
  const { reminder, setReminder, authEmail, authUserId, syncStatus } = useAppStore(
    useShallow((s) => ({
      reminder: s.user.reminder,
      setReminder: s.setReminder,
      authEmail: s.authEmail,
      authUserId: s.authUserId,
      syncStatus: s.syncStatus,
    })),
  );

  async function toggleReminder(enabled: boolean) {
    if (enabled && !(await requestReminderPermission())) {
      return showAlert('Notificações bloqueadas', 'Ative as notificações do WolverBark nos ajustes do celular.');
    }
    setReminder({ ...reminder, enabled });
  }

  async function handleSignOut() {
    const ok = await showConfirm('Sair da conta?', 'Sua jornada continua salva na nuvem. Os dados deste aparelho serão limpos.', {
      confirmText: 'Sair',
      destructive: true,
    });
    if (ok) await signOut();
  }

  return (
    <>
      {/* Lembretes do Logan */}
      <View className="mt-4 rounded-xl border-2 border-ink-900 bg-white p-5">
        <View className="flex-row items-center">
          <Bell size={22} color={COLORS.ink} fill={reminder.enabled ? COLORS.claw : 'transparent'} />
          <Text className="ml-2 flex-1" style={TITLE}>
            LEMBRETE DIÁRIO
          </Text>
          <Switch
            value={reminder.enabled}
            onValueChange={(v) => void toggleReminder(v)}
            disabled={!remindersSupported}
            trackColor={{ true: COLORS.hero, false: COLORS.locked }}
            thumbColor={reminder.enabled ? COLORS.claw : COLORS.white}
          />
        </View>
        <Text className="mt-1 text-sm text-ink-600">
          {remindersSupported
            ? reminder.enabled
              ? `O Logan te chama às ${formatTime(reminder.hour, reminder.minute)} — só se a missão do dia ainda não foi feita.`
              : 'Desligado. Tutores com lembrete treinam bem mais vezes por semana!'
            : 'Os lembretes funcionam no app do celular.'}
        </Text>
        {reminder.enabled && (
          <View className="mt-3 flex-row flex-wrap gap-2">
            {REMINDER_TIMES.map((t) => (
              <Chip
                key={t.label}
                label={`${t.emoji} ${formatTime(t.hour, t.minute)}`}
                active={reminder.hour === t.hour && reminder.minute === t.minute}
                onPress={() => setReminder({ ...reminder, hour: t.hour, minute: t.minute })}
              />
            ))}
          </View>
        )}
      </View>

      {/* Conta e nuvem */}
      {isSupabaseConfigured && (
        <View className="mt-4 rounded-xl border-2 border-ink-900 bg-white p-5">
          <View className="flex-row items-center">
            {authUserId ? <Cloud size={22} color={COLORS.hero} /> : <CloudOff size={22} color={COLORS.lockedDark} />}
            <Text className="ml-2" style={TITLE}>
              CONTA
            </Text>
          </View>
          {authUserId ? (
            <>
              <Text className="mt-1 text-sm text-ink-900">{authEmail}</Text>
              <Text className="mt-0.5 text-xs" style={{ color: syncStatus === 'error' ? COLORS.danger : COLORS.inkSoft }}>
                {SYNC_LABEL[syncStatus]}
              </Text>
              <Pressable onPress={() => void handleSignOut()} className="mt-3 flex-row items-center self-start py-1">
                <LogOut size={16} color={COLORS.danger} />
                <Text className="ml-1.5 text-sm font-bold" style={{ color: COLORS.danger }}>
                  Sair da conta
                </Text>
              </Pressable>
            </>
          ) : (
            <>
              <Text className="mt-1 text-sm text-ink-600">
                Seu progresso está só neste aparelho. Crie uma conta para não perder nada se trocar de celular.
              </Text>
              <HeroButton
                className="mt-3"
                label="Criar conta grátis"
                onPress={() => router.push({ pathname: '/auth', params: { mode: 'signup' } })}
              />
            </>
          )}
        </View>
      )}
    </>
  );
}
