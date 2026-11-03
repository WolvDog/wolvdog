import { Crown, Flame, Shield, Zap } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

import { COLORS } from '@/constants/theme';
import { isStreakAtRisk } from '@/services/gamification';
import { useAppStore } from '@/store/useAppStore';

/** Barra superior: ofensiva, escudos, XP e selo Pro. */
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
  const atRisk = isStreakAtRisk(streak);
  const flameColor = streak.current === 0 || atRisk ? COLORS.lockedDark : COLORS.flame;

  return (
    <View className="flex-row items-center justify-between border-b-2 border-gray-100 bg-white px-4 py-3">
      <View className="flex-row items-center rounded-full bg-cloud px-3 py-1.5">
        <Text className="text-base">🐶</Text>
        <Text className="ml-1.5 font-extrabold text-ink-900" numberOfLines={1}>
          {petName ?? 'Seu cão'}
        </Text>
      </View>

      <View className="flex-row items-center gap-4">
        <View className="flex-row items-center" accessibilityLabel={`Ofensiva de ${streak.current} dias`}>
          <Flame size={22} color={flameColor} fill={flameColor} />
          <Text className="ml-1 text-base font-extrabold" style={{ color: flameColor }}>
            {streak.current}
          </Text>
        </View>

        <View className="flex-row items-center" accessibilityLabel={`${streak.freezesAvailable} escudos de ofensiva`}>
          <Shield size={20} color={COLORS.ice} fill={streak.freezesAvailable > 0 ? COLORS.ice : 'transparent'} />
          <Text className="ml-1 text-base font-extrabold text-ice-500">{streak.freezesAvailable}</Text>
        </View>

        <View className="flex-row items-center" accessibilityLabel={`${totalXp} pontos de experiência`}>
          <Zap size={20} color={COLORS.gold} fill={COLORS.gold} />
          <Text className="ml-1 text-base font-extrabold text-yellow-500">{totalXp}</Text>
        </View>

        <Pressable
          onPress={() => !isPro && openPaywall('profile')}
          accessibilityRole="button"
          accessibilityLabel={isPro ? 'Você é Pro' : 'Assinar WolverBark Pro'}
          className="rounded-full p-1"
          style={{ backgroundColor: isPro ? '#FFF4CC' : '#F3F4F6' }}
        >
          <Crown size={18} color={isPro ? '#E0A800' : COLORS.lockedDark} fill={isPro ? COLORS.gold : 'transparent'} />
        </Pressable>
      </View>
    </View>
  );
}
