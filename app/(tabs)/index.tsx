import { router } from 'expo-router';
import { Target } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/react/shallow';

import { HeroButton } from '@/components/HeroButton';
import { DiaryPrompt } from '@/components/DiaryPrompt';
import { ClawMarks } from '@/components/icons';
import { LoganSays } from '@/components/LoganSays';
import { MissionRow } from '@/components/MissionRow';
import { ModuleBanner } from '@/components/ModuleBanner';
import { ProgressBar } from '@/components/ProgressBar';
import { ReviewCard } from '@/components/ReviewCard';
import { StatsHeader } from '@/components/StatsHeader';
import { WeekTracker } from '@/components/WeekTracker';
import { TERMS } from '@/constants/brand';
import { COLORS, FONTS } from '@/constants/theme';
import { useProgression } from '@/hooks/useProgression';
import { useWeekStatus } from '@/hooks/useWeekStatus';
import { showAlert } from '@/services/dialog';
import { toDateKey, type WeekStatus } from '@/services/gamification';
import { getLessonState, getModuleState } from '@/services/progression';
import { getDueReviews } from '@/services/review';
import { useAppStore } from '@/store/useAppStore';
import type { Lesson, LoganMood } from '@/types';

export default function MissionMapScreen() {
  const { snapshot, modules, currentLesson, completedCount, totalLessons } = useProgression();
  const { pet, tutorName, dailyGoal, reviews, xpHistory, lastStreakEvent, dismissStreakEvent, openPaywall } = useAppStore(
    useShallow((s) => ({
      pet: s.pet,
      tutorName: s.user.name,
      dailyGoal: s.user.dailyGoalMinutes,
      reviews: s.reviews,
      xpHistory: s.progress.xpHistory,
      lastStreakEvent: s.lastStreakEvent,
      dismissStreakEvent: s.dismissStreakEvent,
      openPaywall: s.openPaywall,
    })),
  );

  const petName = pet?.name ?? 'seu cão';
  const trainedToday = xpHistory.some((e) => e.date === toDateKey() && e.source === 'lesson');
  const week = useWeekStatus();
  const dueReviews = getDueReviews(reviews);
  const greeting = getGreeting(tutorName, petName, week, trainedToday, dueReviews.length, currentLesson);

  const handleMissionPress = (lesson: Lesson, status: string, requiresPro: boolean) => {
    if (requiresPro) return openPaywall('locked_module');
    if (status === 'locked') {
      return showAlert('Calma, campeão! 🐾', 'Cumpra a missão anterior para liberar esta. Um passo de cada vez!');
    }
    router.push({ pathname: '/lesson/[id]', params: { id: lesson.id } });
  };

  let globalIndex = 0;

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white">
      <StatsHeader />

      <ScrollView className="bg-cloud" contentContainerStyle={{ paddingBottom: 48 }}>
        {lastStreakEvent && (
          <Pressable onPress={dismissStreakEvent} className="mx-4 mt-4 rounded-xl border-2 border-ink-900 bg-hero-100 p-4">
            <LoganSays
              size={60}
              mood={lastStreakEvent.event === 'frozen' ? 'hero' : 'sleepy'}
              text={
                lastStreakEvent.event === 'frozen'
                  ? `A semana passada ficou abaixo da meta, mas desenterrei ${lastStreakEvent.freezesUsed} ${lastStreakEvent.freezesUsed > 1 ? TERMS.freezes : TERMS.freeze} e sua sequência continua! 🦴`
                  : 'Sua sequência de semanas zerou... mas todo herói recomeça! Bata a meta desta semana e voltamos com tudo. 🐾'
              }
            />
            <Text className="mt-2 text-right text-xs font-bold text-hero-500">Toque para fechar</Text>
          </Pressable>
        )}

        {/* Briefing diário do Logan */}
        <View className="mx-4 mt-4 rounded-xl border-2 border-ink-900 bg-white p-4">
          <LoganSays text={greeting.text} mood={greeting.mood} size={72} />
          <View className="mt-4">
            <WeekTracker week={week} />
          </View>
          <View className="mt-4">
            <View className="mb-1.5 flex-row items-center justify-between">
              <Text style={{ fontFamily: FONTS.displayMedium, fontSize: 12, letterSpacing: 1, color: COLORS.inkSoft }}>
                JORNADA DE {petName.toUpperCase()}
              </Text>
              <View className="flex-row items-center">
                <Target size={12} color={COLORS.inkSoft} />
                <Text className="ml-1 text-xs font-bold text-ink-400">
                  Meta {dailyGoal} min · {completedCount}/{totalLessons} {TERMS.lessons.toLowerCase()}
                </Text>
              </View>
            </View>
            <ProgressBar progress={completedCount / totalLessons} height={10} color={COLORS.hero} />
          </View>
          {dueReviews[0] ? (
            // Reforço pendente vem antes de conteúdo novo.
            <HeroButton
              className="mt-4"
              label="Reforço de hoje"
              onPress={() => router.push({ pathname: '/lesson/[id]', params: { id: dueReviews[0]!.lessonId, review: '1' } })}
            />
          ) : currentLesson ? (
            <HeroButton
              className="mt-4"
              label={trainedToday ? 'Mais uma missão' : 'Missão de hoje'}
              onPress={() => router.push({ pathname: '/lesson/[id]', params: { id: currentLesson.id } })}
            />
          ) : null}
        </View>

        <ReviewCard items={dueReviews} />
        <DiaryPrompt />

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

              {module.lessons.map((lesson, i) => {
                const state = getLessonState(lesson, module, modules, snapshot);
                const side = globalIndex % 2 === 0 ? 'right' : 'left';
                globalIndex += 1;

                return (
                  <MissionRow
                    key={lesson.id}
                    lesson={lesson}
                    status={state.status}
                    requiresPro={state.requiresPro}
                    isCurrent={currentLesson?.id === lesson.id}
                    side={side}
                    isFirst={i === 0}
                    isLast={i === module.lessons.length - 1}
                    onPress={() => handleMissionPress(lesson, state.status, state.requiresPro)}
                  />
                );
              })}

              {moduleState.requiresPro && module.phase === 2 && (
                <View className="mx-4 mt-2 rounded-xl border-2 border-ink-900 bg-hero-500 p-4">
                  <Text className="mb-3 text-center font-bold text-white">As próximas fases fazem parte do WolverBark Pro 👑</Text>
                  <HeroButton label="Teste grátis de 7 dias" onPress={() => openPaywall('locked_module')} />
                </View>
              )}
            </View>
          );
        })}

        <View className="mt-10 items-center px-8">
          <ClawMarks size={44} />
          <Text className="mt-2 text-center text-ink-900" style={{ fontFamily: FONTS.display, fontSize: 18 }}>
            NOVAS FASES TODA SEMANA
          </Text>
          <Text className="mt-1 text-center text-sm text-ink-400">Reatividade, latidos, truques e muito mais estão a caminho.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function getGreeting(
  tutorName: string,
  petName: string,
  week: WeekStatus,
  trainedToday: boolean,
  reviewsDue: number,
  currentLesson: Lesson | undefined,
): { text: string; mood: LoganMood } {
  const tutor = tutorName.trim() || 'parceiro';
  const left = week.goal - week.done;
  if (trainedToday) {
    return week.goalMet
      ? { mood: 'proud', text: `Meta da semana batida, ${tutor}! ${petName} está ficando afiado. Treino extra é sempre bem-vindo.` }
      : { mood: 'excited', text: `Treino de hoje feito! Faltam ${left} ${left === 1 ? 'treino' : 'treinos'} para fechar a semana com ${petName}.` };
  }
  if (week.atRisk) {
    return {
      mood: 'thinking',
      text: `${tutor}, a meta da semana está em risco: faltam ${left} ${left === 1 ? 'treino' : 'treinos'}. Bora treinar ${petName} hoje?`,
    };
  }
  if (reviewsDue > 0) {
    return { mood: 'hero', text: `Au au, ${tutor}! Separei ${reviewsDue === 1 ? 'um reforço rápido' : `${reviewsDue} reforços rápidos`} para ${petName} não esquecer o que aprendeu.` };
  }
  if (!currentLesson) {
    return { mood: 'proud', text: `Você cumpriu tudo que está liberado, ${tutor}! Revise uma missão favorita com ${petName}.` };
  }
  return { mood: 'happy', text: `Au au, ${tutor}! Pronto para treinar ${petName} hoje? Próxima missão: ${currentLesson.title}` };
}
