import { router } from 'expo-router';
import { Trophy } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/react/shallow';

import { ChunkyButton } from '@/components/ChunkyButton';
import { Logan } from '@/components/Logan';
import { LoganSays } from '@/components/LoganSays';
import { ModuleBanner } from '@/components/ModuleBanner';
import { PathNode } from '@/components/PathNode';
import { ProgressBar } from '@/components/ProgressBar';
import { StatsHeader } from '@/components/StatsHeader';
import { COLORS } from '@/constants/theme';
import { useProgression } from '@/hooks/useProgression';
import { showAlert } from '@/services/dialog';
import { isStreakAtRisk, toDateKey } from '@/services/gamification';
import { getLessonState, getModuleState } from '@/services/progression';
import { useAppStore } from '@/store/useAppStore';
import type { Lesson, LoganMood } from '@/types';

/** Deslocamentos horizontais que formam o zigue-zague da trilha. */
const ZIGZAG = [0, 52, 78, 52, 0, -52, -78, -52];

export default function TrailScreen() {
  const { snapshot, modules, currentLesson, completedCount, totalLessons } = useProgression();
  const { pet, streak, xpHistory, lastStreakEvent, dismissStreakEvent, openPaywall } = useAppStore(
    useShallow((s) => ({
      pet: s.pet,
      streak: s.streak,
      xpHistory: s.progress.xpHistory,
      lastStreakEvent: s.lastStreakEvent,
      dismissStreakEvent: s.dismissStreakEvent,
      openPaywall: s.openPaywall,
    })),
  );

  const petName = pet?.name ?? 'seu cão';
  const trainedToday = xpHistory.some((e) => e.date === toDateKey() && e.source === 'lesson');
  const greeting = getGreeting(petName, streak.current, trainedToday, isStreakAtRisk(streak), currentLesson);

  const handleLessonPress = (lesson: Lesson, status: string, requiresPro: boolean) => {
    if (requiresPro) return openPaywall('locked_module');
    if (status === 'locked') {
      return showAlert('Calma, campeão! 🐾', 'Conclua a lição anterior para liberar esta. Um passo de cada vez!');
    }
    router.push({ pathname: '/lesson/[id]', params: { id: lesson.id } });
  };

  let globalIndex = 0;

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white">
      <StatsHeader />

      <ScrollView contentContainerStyle={{ paddingBottom: 48 }}>
        {lastStreakEvent && (
          <Pressable onPress={dismissStreakEvent} className="mx-4 mt-4 rounded-2xl border-2 border-ice-500/40 bg-ice-100 p-4">
            <LoganSays
              size={60}
              mood={lastStreakEvent.event === 'frozen' ? 'hero' : 'sleepy'}
              text={
                lastStreakEvent.event === 'frozen'
                  ? `Ufa! Usei ${lastStreakEvent.freezesUsed} Escudo${lastStreakEvent.freezesUsed > 1 ? 's' : ''} pra proteger sua ofensiva. Bora treinar hoje? 🛡️`
                  : 'Sua ofensiva zerou... mas todo herói recomeça! Uma lição hoje e o foguinho volta. 🔥'
              }
            />
            <Text className="mt-2 text-right text-xs font-bold text-ice-500">Toque para fechar</Text>
          </Pressable>
        )}

        {/* Card diário do Logan */}
        <View className="mx-4 mt-4 rounded-3xl border-2 border-gray-200 bg-white p-4">
          <LoganSays text={greeting.text} mood={greeting.mood} size={72} />
          <View className="mt-4">
            <View className="mb-1.5 flex-row justify-between">
              <Text className="text-xs font-extrabold uppercase text-ink-400">Jornada de {petName}</Text>
              <Text className="text-xs font-extrabold text-ink-400">
                {completedCount}/{totalLessons} lições
              </Text>
            </View>
            <ProgressBar progress={completedCount / totalLessons} height={12} color={COLORS.akita} />
          </View>
          {currentLesson && (
            <ChunkyButton
              className="mt-4"
              label={trainedToday ? 'Treinar mais' : 'Treino de hoje'}
              onPress={() => router.push({ pathname: '/lesson/[id]', params: { id: currentLesson.id } })}
            />
          )}
        </View>

        {modules.map((module) => {
          const moduleState = getModuleState(module, modules, snapshot);
          const moduleCompleted = module.lessons.filter((l) => snapshot.completedLessons[l.id]).length;

          return (
            <View key={module.id}>
              <ModuleBanner
                module={module}
                status={moduleState.status}
                requiresPro={moduleState.requiresPro}
                completedCount={moduleCompleted}
                onPressLocked={() => moduleState.requiresPro && openPaywall('locked_module')}
              />

              <View className="items-center">
                {module.lessons.map((lesson) => {
                  const state = getLessonState(lesson, module, modules, snapshot);
                  const offsetX = ZIGZAG[globalIndex % ZIGZAG.length]!;
                  globalIndex += 1;
                  const isCurrent = currentLesson?.id === lesson.id;

                  return (
                    <View key={lesson.id} className="w-full items-center">
                      <PathNode
                        lesson={lesson}
                        status={state.status}
                        requiresPro={state.requiresPro}
                        isCurrent={isCurrent}
                        color={module.color}
                        colorDark={module.colorDark}
                        offsetX={offsetX}
                        onPress={() => handleLessonPress(lesson, state.status, state.requiresPro)}
                      />
                      {isCurrent && (
                        // Logan fica ao lado do nó atual, do lado oposto ao zigue-zague.
                        <View
                          pointerEvents="none"
                          style={[{ position: 'absolute', top: 30 }, offsetX > 0 ? { left: 24 } : { right: 24 }]}
                        >
                          <Logan size={86} mood="hero" />
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>

              {moduleState.requiresPro && module.phase === 2 && (
                <View className="mx-4 mt-2 rounded-2xl bg-hero-500/10 p-4">
                  <Text className="mb-3 text-center font-bold text-hero-700">
                    As próximas fases fazem parte do WolverBark Pro 👑
                  </Text>
                  <ChunkyButton label="Teste grátis de 7 dias" variant="hero" onPress={() => openPaywall('locked_module')} />
                </View>
              )}
            </View>
          );
        })}

        <View className="mt-10 items-center px-8">
          <Trophy size={44} color={COLORS.gold} fill={COLORS.gold} />
          <Text className="mt-2 text-center text-base font-extrabold text-ink-900">Novas fases toda semana</Text>
          <Text className="mt-1 text-center text-sm text-ink-400">Reatividade, latidos, truques e muito mais estão a caminho.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function getGreeting(
  petName: string,
  streak: number,
  trainedToday: boolean,
  atRisk: boolean,
  currentLesson: Lesson | undefined,
): { text: string; mood: LoganMood } {
  if (!currentLesson) {
    return {
      mood: 'proud',
      text: `Você concluiu tudo que está liberado! Revise uma lição favorita com ${petName} para manter o foguinho aceso.`,
    };
  }
  if (trainedToday) {
    return { mood: 'excited', text: `Treino de hoje feito! ${petName} agradece. Quer adiantar a próxima lição?` };
  }
  if (atRisk && streak > 0) {
    return {
      mood: 'thinking',
      text: `Sua ofensiva de ${streak} ${streak === 1 ? 'dia' : 'dias'} está em risco! 5 minutinhos com ${petName} e tá salva.`,
    };
  }
  return { mood: 'happy', text: `Au au! Pronto para treinar ${petName} hoje? Próxima missão: ${currentLesson.title}` };
}
