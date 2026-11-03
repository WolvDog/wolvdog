import { Text, View } from 'react-native';

import { CHALLENGE_LABELS, RATING_LABELS } from '@/constants/labels';
import { COLORS } from '@/constants/theme';
import { addDays, weekStart, toDateKey } from '@/services/gamification';
import type { BehaviorChallenge, BehaviorLog } from '@/types';

const WEEKS = 8;
const RATING_COLORS = ['#E5484D', '#F28C28', '#FFC72C', '#3B5CC4', '#1E3A8A'];

/** Últimas semanas do diário para um desafio: barras de 1 (fora de controle) a 5 (sob controle). */
export function BehaviorChart({ challenge, log }: { challenge: BehaviorChallenge; log: BehaviorLog }) {
  const thisWeek = weekStart(toDateKey());
  const weeks = Array.from({ length: WEEKS }, (_, i) => addDays(thisWeek, (i - (WEEKS - 1)) * 7));
  const values = weeks.map((w) => log[w]?.[challenge]);
  const rated = values.filter((v): v is NonNullable<typeof v> => v !== undefined);
  const first = rated[0];
  const last = rated[rated.length - 1];
  const trend = first !== undefined && last !== undefined && rated.length > 1 ? last - first : 0;

  return (
    <View>
      <View className="mb-2 flex-row items-center justify-between">
        <Text className="flex-1 font-bold text-ink-900" numberOfLines={1}>
          {CHALLENGE_LABELS[challenge].emoji} {CHALLENGE_LABELS[challenge].label}
        </Text>
        {last !== undefined && (
          <Text className="text-xs font-bold" style={{ color: trend > 0 ? COLORS.hero : trend < 0 ? COLORS.danger : COLORS.inkSoft }}>
            {trend > 0 ? `▲ melhorou ${trend}` : trend < 0 ? `▼ piorou ${-trend}` : RATING_LABELS[last].label}
          </Text>
        )}
      </View>
      <View className="h-16 flex-row items-end gap-1.5">
        {values.map((v, i) => (
          <View key={weeks[i]} className="flex-1 items-center">
            <View
              className="w-full rounded-t-md"
              style={{
                height: v ? (v / 5) * 56 + 4 : 4,
                backgroundColor: v ? RATING_COLORS[v - 1] : COLORS.locked,
                borderWidth: v ? 1.5 : 0,
                borderColor: COLORS.ink,
              }}
            />
          </View>
        ))}
      </View>
      <View className="mt-1 flex-row justify-between">
        <Text className="text-[10px] text-ink-400">{WEEKS} semanas atrás</Text>
        <Text className="text-[10px] font-bold text-ink-600">esta semana</Text>
      </View>
    </View>
  );
}
