import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import type { ReminderSettings } from '@/types';

import { addDays, toDateKey } from './gamification';

/** Quantos dias à frente deixamos agendados. Reagendamos ao abrir o app e ao cumprir missões. */
const DAYS_AHEAD = 7;
const CHANNEL_ID = 'daily-reminder';

export const remindersSupported = Platform.OS !== 'web';

if (remindersSupported) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export async function requestReminderPermission(): Promise<boolean> {
  if (!remindersSupported) return false;
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Lembretes do Logan',
      importance: Notifications.AndroidImportance.HIGH,
      lightColor: '#FFC72C',
    });
  }
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (!current.canAskAgain) return false;
  const asked = await Notifications.requestPermissionsAsync();
  return asked.granted;
}

interface ReminderContext {
  reminder: ReminderSettings;
  petName: string;
  tutorName: string;
  /** Sequência em semanas. */
  streakWeeks: number;
  /** Treinos que faltam para bater a meta desta semana. */
  weekRemaining: number;
  trainedToday: boolean;
}

/** Mensagens do Logan — variam a cada dia para não ficarem repetitivas. */
function buildMessage(ctx: ReminderContext, dayOffset: number): { title: string; body: string } {
  const { petName, tutorName, streakWeeks, weekRemaining } = ctx;
  const tutor = tutorName || 'parceiro';
  // A sequência só é "conhecida" para o primeiro lembrete; nos dias seguintes usamos mensagens genéricas.
  // O progresso da semana só é "conhecido" para os primeiros lembretes; depois usamos mensagens genéricas.
  if (dayOffset <= 1 && weekRemaining > 0) {
    return {
      title: `🐾 Faltam ${weekRemaining} ${weekRemaining === 1 ? 'treino' : 'treinos'} para fechar a semana`,
      body:
        streakWeeks > 0
          ? `${tutor}, sua sequência de ${streakWeeks} ${streakWeeks === 1 ? 'semana' : 'semanas'} está em jogo. 5 minutinhos com ${petName}?`
          : `${tutor}, 5 minutinhos com ${petName} hoje e a meta da semana fica mais perto.`,
    };
  }
  const pool = [
    { title: `${petName} está te esperando! 🦴`, body: 'A missão de hoje leva poucos minutos. O Logan já separou tudo.' },
    { title: 'Hora do treino, herói! ⚡', body: `Pequenos treinos todo dia fazem ${petName} evoluir rápido.` },
    { title: 'Au au! Missão do dia disponível', body: `${tutor}, que tal treinar com ${petName} agora?` },
    { title: `${petName} quer aprender algo novo 🐶`, body: 'Abra o WolverBark e cumpra a missão de hoje.' },
    { title: 'O Logan passou aqui 👀', body: `Ainda dá tempo de garantir as garras de hoje com ${petName}.` },
  ];
  return pool[(dayOffset + new Date().getDate()) % pool.length]!;
}

/**
 * Reagenda os lembretes dos próximos dias. Se o tutor já treinou hoje,
 * o lembrete de hoje é pulado — ninguém gosta de ser cobrado depois de cumprir a missão.
 */
export async function rescheduleReminders(ctx: ReminderContext): Promise<void> {
  if (!remindersSupported) return;
  await Notifications.cancelAllScheduledNotificationsAsync();
  if (!ctx.reminder.enabled) return;

  const permission = await Notifications.getPermissionsAsync();
  if (!permission.granted) return;

  const now = new Date();
  const today = toDateKey(now);

  for (let offset = 0; offset < DAYS_AHEAD; offset++) {
    if (offset === 0 && ctx.trainedToday) continue;
    const [y, m, d] = addDays(today, offset).split('-').map(Number);
    const when = new Date(y!, m! - 1, d!, ctx.reminder.hour, ctx.reminder.minute);
    if (when <= now) continue;

    await Notifications.scheduleNotificationAsync({
      content: { ...buildMessage(ctx, offset), sound: true },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: when, channelId: CHANNEL_ID },
    });
  }
}

export function formatTime(hour: number, minute: number): string {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

export const REMINDER_TIMES = [
  { hour: 7, minute: 30, label: 'Manhã', emoji: '🌅' },
  { hour: 12, minute: 30, label: 'Almoço', emoji: '☀️' },
  { hour: 18, minute: 30, label: 'Fim da tarde', emoji: '🌇' },
  { hour: 20, minute: 30, label: 'Noite', emoji: '🌙' },
] as const;
