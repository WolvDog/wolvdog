import { Check } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { TERMS, weeks } from '@/constants/brand';
import { COLORS, FONTS } from '@/constants/theme';
import type { WeekStatus } from '@/services/gamification';

const LABELS = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];

/** Semana de segunda a domingo com os dias treinados e o progresso da meta semanal. */
export function WeekTracker({ week }: { week: WeekStatus }) {
  const remaining = Math.max(0, week.goal - week.done);

  return (
    <View>
      <View className="mb-2 flex-row items-center justify-between">
        <Text style={{ fontFamily: FONTS.displayMedium, fontSize: 12, letterSpacing: 1, color: COLORS.inkSoft }}>
          SEMANA · {week.done}/{week.goal} TREINOS
        </Text>
        <Text className="text-xs font-bold" style={{ color: week.goalMet ? COLORS.akitaDark : COLORS.inkSoft }}>
          {TERMS.streak}: {weeks(week.displayStreak)}
        </Text>
      </View>

      <View className="flex-row justify-between">
        {week.calendar.map((day, i) => (
          <View key={day.date} className="items-center">
            <View
              className="h-9 w-9 items-center justify-center rounded-lg border-2"
              style={{
                backgroundColor: day.trained ? COLORS.akita : COLORS.white,
                borderColor: day.trained || day.isToday ? COLORS.ink : COLORS.locked,
                borderStyle: day.isFuture ? 'dashed' : 'solid',
              }}
            >
              {day.trained && <Check size={18} color={COLORS.white} strokeWidth={3.5} />}
            </View>
            <Text className="mt-1 text-[11px] font-bold" style={{ color: day.isToday ? COLORS.ink : COLORS.lockedDark }}>
              {LABELS[i]}
            </Text>
          </View>
        ))}
      </View>

      <Text className="mt-2 text-xs" style={{ color: week.atRisk ? COLORS.danger : COLORS.inkSoft }}>
        {week.goalMet
          ? '🏆 Meta da semana batida! Treinos extras deixam o cão ainda mais afiado.'
          : week.atRisk
            ? `⚠️ Faltam ${remaining} ${remaining === 1 ? 'treino' : 'treinos'} e só ${week.daysLeft} ${week.daysLeft === 1 ? 'dia' : 'dias'} na semana!`
            : `Faltam ${remaining} ${remaining === 1 ? 'treino' : 'treinos'} para fechar a semana.`}
      </Text>
    </View>
  );
}
