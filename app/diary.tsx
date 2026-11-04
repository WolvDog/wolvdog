import { router } from 'expo-router';
import { X } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/react/shallow';

import { BehaviorChart } from '@/components/BehaviorChart';
import { HeroButton } from '@/components/HeroButton';
import { LoganSays } from '@/components/LoganSays';
import { RATING_LABELS } from '@/constants/labels';
import { COLORS, FONTS } from '@/constants/theme';
import { toDateKey, weekStart } from '@/services/gamification';
import { tap } from '@/services/haptics';
import { useAppStore } from '@/store/useAppStore';
import type { BehaviorRating } from '@/types';

const RATINGS: BehaviorRating[] = [1, 2, 3, 4, 5];

/** Check-in semanal do diário de comportamento: nota de 1 a 5 por desafio + evolução. */
export default function DiaryScreen() {
  const { pet, behaviorLog, setBehaviorRating } = useAppStore(
    useShallow((s) => ({ pet: s.pet, behaviorLog: s.behaviorLog, setBehaviorRating: s.setBehaviorRating })),
  );
  const week = weekStart(toDateKey());
  const challenges = pet?.challenges ?? [];
  const thisWeek = behaviorLog[week] ?? {};
  const answered = challenges.filter((c) => thisWeek[c] !== undefined).length;
  const petName = pet?.name ?? 'seu pet';

  return (
    <SafeAreaView className="flex-1 bg-cloud">
      <View className="flex-row items-center justify-between border-b-2 border-ink-900 bg-white px-4 py-3">
        <Text style={{ fontFamily: FONTS.display, fontSize: 20, color: COLORS.ink }}>DIÁRIO DE {petName.toUpperCase()}</Text>
        <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Fechar" hitSlop={12}>
          <X size={26} color={COLORS.ink} strokeWidth={3} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <LoganSays
          mood="thinking"
          text={
            challenges.length > 0
              ? `Como ${petName} se saiu nesta semana em cada desafio? Leva 30 segundos e mostra a evolução de verdade.`
              : `Ainda não sei quais são os desafios de ${petName}. Escolha no perfil e eu acompanho a evolução toda semana!`
          }
        />

        {challenges.length === 0 ? (
          <HeroButton className="mt-6" label="Escolher desafios" onPress={() => router.replace('/pet-edit')} />
        ) : (
          challenges.map((challenge) => {
            const current = thisWeek[challenge];
            return (
              <View key={challenge} className="mt-5 rounded-xl border-2 border-ink-900 bg-white p-4">
                <BehaviorChart challenge={challenge} log={behaviorLog} />
                <Text className="mb-2 mt-4 text-xs font-bold uppercase text-ink-400">Como foi esta semana?</Text>
                <View className="flex-row justify-between">
                  {RATINGS.map((r) => {
                    const active = current === r;
                    return (
                      <Pressable
                        key={r}
                        onPress={() => {
                          tap();
                          setBehaviorRating(week, challenge, r);
                        }}
                        accessibilityRole="radio"
                        accessibilityState={{ selected: active }}
                        accessibilityLabel={`${r}: ${RATING_LABELS[r].label}`}
                        className="items-center rounded-lg border-2 px-1 py-2"
                        style={{
                          width: '19%',
                          borderColor: active ? COLORS.ink : COLORS.locked,
                          backgroundColor: active ? COLORS.claw : COLORS.white,
                        }}
                      >
                        <Text className="text-xl">{RATING_LABELS[r].emoji}</Text>
                        <Text className="mt-0.5 text-center text-[9px] font-bold text-ink-600" numberOfLines={2}>
                          {RATING_LABELS[r].label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            );
          })
        )}

        {challenges.length > 0 && (
          <HeroButton
            className="mt-6"
            label={answered === challenges.length ? 'Check-in feito!' : `Salvar (${answered}/${challenges.length})`}
            variant={answered === challenges.length ? 'hero' : 'primary'}
            onPress={() => router.back()}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
