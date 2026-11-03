import { router, useLocalSearchParams } from 'expo-router';
import { Clock, X } from 'lucide-react-native';
import { type ComponentRef, useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HeroButton } from '@/components/HeroButton';
import { ConceptStepView } from '@/components/lesson/ConceptStepView';
import { PracticeStepView } from '@/components/lesson/PracticeStepView';
import { ValidationStepView } from '@/components/lesson/ValidationStepView';
import { VictoryStepView } from '@/components/lesson/VictoryStepView';
import { LoganSays } from '@/components/LoganSays';
import { SegmentedProgress } from '@/components/ProgressBar';
import { COLORS } from '@/constants/theme';
import { getLessonById, getModuleById } from '@/data/mockData';
import { useProgression } from '@/hooks/useProgression';
import { showConfirm } from '@/services/dialog';
import { getLessonState } from '@/services/progression';
import { type LessonCompletionResult, useAppStore } from '@/store/useAppStore';
import type { ValidationOption } from '@/types';

const CTA_LABEL = {
  concept: 'Entendi!',
  practice: 'Treino feito',
  validation: 'Cumprir missão',
  victory: 'Continuar',
} as const;

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lesson = id ? getLessonById(id) : undefined;
  const module = lesson ? getModuleById(lesson.moduleId) : undefined;

  const { modules, snapshot } = useProgression();
  const openPaywall = useAppStore((s) => s.openPaywall);
  const draftIndex = useAppStore((s) => (id ? s.lessonDrafts[id] : undefined));
  const completeLesson = useAppStore((s) => s.completeLesson);
  const saveLessonDraft = useAppStore((s) => s.saveLessonDraft);

  // Retoma de onde parou, mas nunca direto na tela de vitória.
  const [stepIndex, setStepIndex] = useState(() => Math.min(draftIndex ?? 0, 2));
  const [answer, setAnswer] = useState<ValidationOption | null>(null);
  const [result, setResult] = useState<LessonCompletionResult | null>(null);
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [stepIndex]);

  if (!lesson || !module) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white px-8">
        <LoganSays layout="top" mood="thinking" text="Hmm, farejei por toda parte e não achei essa missão." />
        <HeroButton className="mt-6 w-full" label="Voltar para a trilha" onPress={() => router.back()} />
      </SafeAreaView>
    );
  }

  // Protege contra deep links para lições ainda bloqueadas (a vitória recém-conquistada não conta).
  const access = getLessonState(lesson, module, modules, snapshot);
  if (access.status === 'locked' && !result) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white px-8">
        <LoganSays
          layout="top"
          mood="thinking"
          text={
            access.requiresPro
              ? 'Essa missão faz parte do WolverBark Pro. Bora desbloquear juntos?'
              : 'Calma, campeão! Cumpra as missões anteriores para liberar esta.'
          }
        />
        {access.requiresPro && (
          <HeroButton className="mt-6 w-full" label="Conhecer o Pro" variant="hero" onPress={() => openPaywall('locked_module')} />
        )}
        <HeroButton className="mt-3 w-full" label="Voltar para a trilha" variant="secondary" onPress={() => router.back()} />
      </SafeAreaView>
    );
  }

  const step = lesson.steps[stepIndex]!;
  const isVictory = step.type === 'victory';

  const handleClose = async () => {
    if (isVictory) return router.back();
    const leave = await showConfirm('Sair da missão?', 'O Logan guarda seu progresso para você continuar depois.', {
      confirmText: 'Sair',
      cancelText: 'Continuar treinando',
      destructive: true,
    });
    if (!leave) return;
    saveLessonDraft(lesson.id, stepIndex);
    router.back();
  };

  const handleNext = () => {
    if (step.type === 'validation') {
      if (!answer) return;
      setResult(completeLesson(lesson.id, answer.difficulty));
    }
    if (isVictory) return router.back();
    setStepIndex((i) => i + 1);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Topo: fechar + barra de progresso */}
      <View className="flex-row items-center px-4 pb-2 pt-2">
        <Pressable onPress={handleClose} accessibilityRole="button" accessibilityLabel="Fechar missão" hitSlop={12}>
          <X size={28} color={COLORS.ink} strokeWidth={3} />
        </Pressable>
        <View className="ml-4 flex-1">
          <SegmentedProgress total={lesson.steps.length} current={stepIndex} color={module.color} />
        </View>
      </View>

      {!isVictory && (
        <View className="flex-row items-center px-5 pb-1">
          <Text className="flex-1 text-sm font-bold text-ink-400" numberOfLines={1}>
            {module.subtitle} · {lesson.title}
          </Text>
          <Clock size={14} color={COLORS.inkSoft} />
          <Text className="ml-1 text-sm font-bold text-ink-400">{lesson.durationMinutes} min</Text>
        </View>
      )}

      <ScrollView ref={scrollRef} className="flex-1" contentContainerStyle={{ padding: 20, paddingBottom: 32 }}>
        {step.type === 'concept' && <ConceptStepView step={step} />}
        {step.type === 'practice' && <PracticeStepView key={step.id} step={step} />}
        {step.type === 'validation' && (
          <ValidationStepView step={step} selectedId={answer?.id ?? null} onSelect={setAnswer} />
        )}
        {step.type === 'victory' && <VictoryStepView step={step} result={result} />}
      </ScrollView>

      <View className="border-t-2 border-ink-900 px-5 pb-4 pt-4">
        <HeroButton
          label={CTA_LABEL[step.type]}
          variant={isVictory ? 'hero' : 'primary'}
          disabled={step.type === 'validation' && !answer}
          onPress={handleNext}
        />
      </View>
    </SafeAreaView>
  );
}
