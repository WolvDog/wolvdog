import { router } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { COLORS, FONTS } from '@/constants/theme';
import { getLessonById } from '@/data/mockData';
import { getSeasonalHighlight } from '@/data/specials';
import { useAppStore } from '@/store/useAppStore';

/**
 * Card da missão da estação no topo da Home (calendário em data/specials.ts):
 * fogos no fim de ano, calor no verão, feriados, inverno e chuvas. É do Pro.
 */
export function SeasonalCard() {
  const highlight = getSeasonalHighlight();
  const lesson = highlight ? getLessonById(highlight.lessonId) : undefined;
  const sessions = useAppStore((s) => (lesson ? s.progress.completedLessons[lesson.id]?.timesCompleted ?? 0 : 0));
  const isPro = useAppStore((s) => s.isPro);
  const openPaywall = useAppStore((s) => s.openPaywall);
  if (!highlight || !lesson) return null;

  return (
    <Pressable
      onPress={() => (isPro ? router.push({ pathname: '/lesson/[id]', params: { id: lesson.id } }) : openPaywall('locked_module'))}
      accessibilityRole="button"
      accessibilityLabel={`${highlight.kicker}: ${lesson.title}`}
      className="mx-4 mt-4 flex-row items-center rounded-xl border-2 border-ink-900 p-4"
      style={{ backgroundColor: COLORS.heroDark }}
    >
      <View className="h-14 w-14 items-center justify-center rounded-xl border-2 border-ink-900 bg-claw-500">
        <Text style={{ fontSize: 30 }}>{lesson.icon}</Text>
      </View>
      <View className="ml-3 flex-1">
        <Text className="text-[10px] font-bold uppercase" style={{ color: COLORS.claw }}>
          {highlight.kicker}
          {isPro ? '' : ' · Pro 👑'}
        </Text>
        <Text style={{ fontFamily: FONTS.display, fontSize: 19, color: COLORS.white }}>{lesson.title.toUpperCase()}</Text>
        <Text className="text-xs leading-4" style={{ color: COLORS.heroLight }}>
          {sessions > 0 ? `${sessions} ${sessions === 1 ? 'treino feito' : 'treinos feitos'}. ${highlight.text}` : highlight.text}
        </Text>
      </View>
      <ChevronRight size={22} color={COLORS.claw} />
    </Pressable>
  );
}
