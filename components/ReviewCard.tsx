import { router } from 'expo-router';
import { RotateCcw } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { COLORS, FONTS } from '@/constants/theme';
import { getLessonById } from '@/data/mockData';
import type { ReviewItem } from '@/types';

const REASON = {
  hard: 'Foi difícil da última vez',
  medium: 'Hora de fixar',
  easy: 'Revisão para não esquecer',
} as const;

/** "Treino de Reforço": missões já cumpridas que voltam para revisão (repetição espaçada). */
export function ReviewCard({ items }: { items: ReviewItem[] }) {
  if (items.length === 0) return null;

  return (
    <View className="mx-4 mt-4 overflow-hidden rounded-xl border-2 border-ink-900 bg-white">
      <View className="flex-row items-center bg-hero-500 px-4 py-2.5">
        <RotateCcw size={16} color={COLORS.claw} strokeWidth={3} />
        <Text className="ml-2" style={{ fontFamily: FONTS.display, fontSize: 15, letterSpacing: 1, color: COLORS.white }}>
          TREINO DE REFORÇO
        </Text>
        <Text className="ml-auto text-xs font-bold text-white/80">2–3 min cada</Text>
      </View>

      {items.map((item, i) => {
        const lesson = getLessonById(item.lessonId);
        if (!lesson) return null;
        return (
          <Pressable
            key={item.lessonId}
            onPress={() => router.push({ pathname: '/lesson/[id]', params: { id: lesson.id, review: '1' } })}
            accessibilityRole="button"
            accessibilityLabel={`Reforçar ${lesson.title}`}
            className="flex-row items-center px-4 py-3"
            style={{ borderTopWidth: i === 0 ? 0 : 1, borderTopColor: COLORS.locked }}
          >
            <Text className="text-2xl">{lesson.icon}</Text>
            <View className="ml-3 flex-1">
              <Text className="font-bold text-ink-900" numberOfLines={1}>
                {lesson.title}
              </Text>
              <Text className="text-xs" style={{ color: item.lastDifficulty === 'hard' ? COLORS.danger : COLORS.inkSoft }}>
                {REASON[item.lastDifficulty]}
              </Text>
            </View>
            <View className="rounded-md border-2 border-ink-900 bg-claw-500 px-2.5 py-1">
              <Text style={{ fontFamily: FONTS.display, fontSize: 12, color: COLORS.ink }}>REFORÇAR</Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
