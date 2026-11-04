import { router } from 'expo-router';
import { ClipboardList } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

import { COLORS, FONTS } from '@/constants/theme';
import { toDateKey, weekStart } from '@/services/gamification';
import { useAppStore } from '@/store/useAppStore';

/** Convite para o check-in semanal do diário, enquanto ele não foi feito nesta semana. */
export function DiaryPrompt() {
  const { petName, challenges, behaviorLog } = useAppStore(
    useShallow((s) => ({ petName: s.pet?.name ?? 'seu pet', challenges: s.pet?.challenges ?? [], behaviorLog: s.behaviorLog })),
  );
  const week = behaviorLog[weekStart(toDateKey())] ?? {};
  const pending = challenges.filter((c) => week[c] === undefined).length;
  if (challenges.length === 0 || pending === 0) return null;

  return (
    <Pressable
      onPress={() => router.push('/diary')}
      accessibilityRole="button"
      className="mx-4 mt-4 flex-row items-center rounded-xl border-2 border-ink-900 bg-claw-100 p-4"
    >
      <View className="h-11 w-11 items-center justify-center rounded-lg border-2 border-ink-900 bg-claw-500">
        <ClipboardList size={22} color={COLORS.ink} />
      </View>
      <View className="ml-3 flex-1">
        <Text style={{ fontFamily: FONTS.display, fontSize: 15, color: COLORS.ink }}>CHECK-IN DA SEMANA</Text>
        <Text className="text-sm text-ink-600">Como {petName} foi nos desafios? 30 segundos.</Text>
      </View>
      <Text style={{ fontFamily: FONTS.display, fontSize: 22, color: COLORS.ink }}>›</Text>
    </Pressable>
  );
}
