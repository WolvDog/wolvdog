import type { ReactNode } from 'react';
import { Bone, Crown, PawPrint } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

import { points, TERMS, weeks } from '@/constants/brand';
import { COLORS, FONTS } from '@/constants/theme';
import { useWeekStatus } from '@/hooks/useWeekStatus';
import { useAppStore } from '@/store/useAppStore';

import { ClawMarks } from './icons';

/** Barra superior: sequência, ossos reserva, garras e selo Pro. */
export function StatsHeader() {
  const { streak, totalXp, isPro, petName, openPaywall } = useAppStore(
    useShallow((s) => ({
      streak: s.streak,
      totalXp: s.progress.totalXp,
      isPro: s.isPro,
      petName: s.pet?.name,
      openPaywall: s.openPaywall,
    })),
  );
  const week = useWeekStatus();
  const streakColor = week.goalMet ? COLORS.akita : week.done > 0 ? COLORS.akitaDark : COLORS.lockedDark;

  return (
    <View className="flex-row items-center justify-between border-b-2 border-ink-900 bg-white px-4 py-3">
      <View className="flex-row items-center rounded-lg border-2 border-ink-900 bg-claw-500 px-2.5 py-1">
        <Text className="text-sm">🐶</Text>
        <Text className="ml-1.5 max-w-[90px] text-ink-900" style={{ fontFamily: FONTS.display, fontSize: 15 }} numberOfLines={1}>
          {petName ?? 'Seu Pet'}
        </Text>
      </View>

      <View className="flex-row items-center gap-4">
        <Stat
          label={`Semana: ${week.done} de ${week.goal} treinos. ${TERMS.streak}: ${weeks(week.displayStreak)}`}
          value={`${week.done}/${week.goal}`}
          color={streakColor}
        >
          <PawPrint size={20} color={streakColor} fill={week.goalMet ? streakColor : 'transparent'} />
        </Stat>
        <Stat label={`${streak.freezesAvailable} ${TERMS.freezes}`} value={streak.freezesAvailable} color={COLORS.hero}>
          <Bone size={20} color={COLORS.hero} fill={streak.freezesAvailable > 0 ? COLORS.heroLight : 'transparent'} />
        </Stat>
        <Stat label={points(totalXp)} value={totalXp} color={COLORS.ink}>
          <ClawMarks size={20} />
        </Stat>

        <Pressable
          onPress={() => !isPro && openPaywall('profile')}
          accessibilityRole="button"
          accessibilityLabel={isPro ? 'Você é Pro' : 'Assinar WolvDog Pro'}
          className="rounded-md border-2 p-0.5"
          style={{ backgroundColor: isPro ? COLORS.claw : COLORS.white, borderColor: isPro ? COLORS.ink : COLORS.locked }}
        >
          <Crown size={17} color={isPro ? COLORS.ink : COLORS.lockedDark} fill={isPro ? COLORS.ink : 'transparent'} />
        </Pressable>
      </View>
    </View>
  );
}

function Stat({ children, value, color, label }: { children: ReactNode; value: number | string; color: string; label: string }) {
  return (
    <View className="flex-row items-center" accessibilityLabel={label}>
      {children}
      <Text className="ml-1" style={{ fontFamily: FONTS.display, fontSize: 16, color }}>
        {value}
      </Text>
    </View>
  );
}
