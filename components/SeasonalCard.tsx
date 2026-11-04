import { router } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { COLORS, FONTS } from '@/constants/theme';
import { fogosLesson, isFireworksSeason } from '@/data/specials';
import { useAppStore } from '@/store/useAppStore';

/** Card de destaque da missão especial de fim de ano (fogos), no topo da Home durante a temporada. */
export function SeasonalCard() {
  const sessions = useAppStore((s) => s.progress.completedLessons[fogosLesson.id]?.timesCompleted ?? 0);
  if (!isFireworksSeason()) return null;

  return (
    <Pressable
      onPress={() => router.push({ pathname: '/lesson/[id]', params: { id: fogosLesson.id } })}
      accessibilityRole="button"
      accessibilityLabel={`Missão especial: ${fogosLesson.title}`}
      className="mx-4 mt-4 flex-row items-center rounded-xl border-2 border-ink-900 p-4"
      style={{ backgroundColor: COLORS.heroDark }}
    >
      <View className="h-14 w-14 items-center justify-center rounded-xl border-2 border-ink-900 bg-claw-500">
        <Text style={{ fontSize: 30 }}>{fogosLesson.icon}</Text>
      </View>
      <View className="ml-3 flex-1">
        <Text className="text-[10px] font-bold uppercase" style={{ color: COLORS.claw }}>
          Missão especial · fim de ano
        </Text>
        <Text style={{ fontFamily: FONTS.display, fontSize: 19, color: COLORS.white }}>{fogosLesson.title.toUpperCase()}</Text>
        <Text className="text-xs leading-4" style={{ color: COLORS.heroLight }}>
          {sessions > 0
            ? `${sessions} ${sessions === 1 ? 'treino feito' : 'treinos feitos'}. Um por dia até o Réveillon!`
            : 'Treine com sons baixinhos e chegue ao Réveillon sem pânico.'}
        </Text>
      </View>
      <ChevronRight size={22} color={COLORS.claw} />
    </Pressable>
  );
}
