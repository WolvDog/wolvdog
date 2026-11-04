import { router, useLocalSearchParams } from 'expo-router';
import { Clock, X } from 'lucide-react-native';
import { type ComponentRef, useEffect, useMemo, useRef, useState } from 'react';
import { BackHandler, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HeroButton } from '@/components/HeroButton';
import { ConceptStepView } from '@/components/lesson/ConceptStepView';
import { PracticeStepView } from '@/components/lesson/PracticeStepView';
import { QuizStepView } from '@/components/lesson/QuizStepView';
import { ValidationStepView } from '@/components/lesson/ValidationStepView';
import { VictoryStepView } from '@/components/lesson/VictoryStepView';
import { LoganSays } from '@/components/LoganSays';
import { SegmentedProgress } from '@/components/ProgressBar';
import { COLORS } from '@/constants/theme';
import { getLessonById, getModuleById } from '@/data/mockData';
import { useProgression } from '@/hooks/useProgression';
import { showConfirm } from '@/services/dialog';
import { personalize } from '@/services/personalize';
import { SPECIAL_MODULE_ID } from '@/data/specials';
import { getLessonState } from '@/services/progression';
import { type LessonCompletionResult, useAppStore } from '@/store/useAppStore';
import type { Lesson, LessonStep, ValidationOption } from '@/types';

/** Etapas da missão na ordem exibida: o quiz (se houver) entra entre a Dica e o Treino. */
type FlowStep = LessonStep | { type: 'quiz'; id: string };

function buildFlow(lesson: Lesson): FlowStep[] {
  const [concept, practice, validation, victory] = lesson.steps;
  const quiz: FlowStep[] = lesson.quiz?.length ? [{ type: 'quiz', id: `${lesson.id}-quiz` }] : [];
  return [concept, ...quiz, practice, validation, victory];
}

/** Treino com o cão x leitura x preparar o ambiente: o botão diz o que o tutor acabou de fazer. */
const PRACTICE_CTA = {
  practice: 'Treino feito',
  knowledge: 'Li e entendi',
  checklist: 'Preparativos feitos',
} as const;

const CTA_LABEL = {
  concept: 'Entendi!',
  quiz: '',
  practice: 'Treino feito',
  validation: 'Cumprir missão',
  victory: 'Continuar',
} as const;

export default function LessonScreen() {
  const { id, review } = useLocalSearchParams<{ id: string; review?: string }>();
  // Reforço: pula a explicação e vai direto ao treino prático.
  const isReview = review === '1';
  const petName = useAppStore((s) => s.pet?.name);
  const petSex = useAppStore((s) => s.pet?.sex);
  // Os textos usam {pet}, {o_pet}, {para_pet}… para chamar o cão pelo nome com o artigo certo.
  const lesson = useMemo(() => {
    const base = id ? getLessonById(id) : undefined;
    return base ? personalize(base, { name: petName, sex: petSex }) : undefined;
  }, [id, petName, petSex]);
  const module = lesson ? getModuleById(lesson.moduleId) : undefined;

  const { modules, snapshot } = useProgression();
  const openPaywall = useAppStore((s) => s.openPaywall);
  const draftIndex = useAppStore((s) => (id ? s.lessonDrafts[id] : undefined));
  const completeLesson = useAppStore((s) => s.completeLesson);
  const saveLessonDraft = useAppStore((s) => s.saveLessonDraft);

  const flow = useMemo(() => (lesson ? buildFlow(lesson) : []), [lesson]);
  const practiceIndex = flow.findIndex((s) => s.type === 'practice');

  // Retoma de onde parou, mas nunca direto na tela de vitória.
  const [stepIndex, setStepIndex] = useState(() => (isReview ? practiceIndex : Math.min(draftIndex ?? 0, flow.length - 2)));
  const [quizCorrect, setQuizCorrect] = useState(0);
  const [answer, setAnswer] = useState<ValidationOption | null>(null);
  const [result, setResult] = useState<LessonCompletionResult | null>(null);
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
  // Evita cumprir a missão duas vezes com toques rápidos no botão.
  const completedRef = useRef(false);
  const closeRef = useRef<() => void>(() => router.back());

  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [stepIndex]);

  // Botão "voltar" do Android: mesmo fluxo do X (pergunta e guarda o progresso).
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      closeRef.current();
      return true;
    });
    return () => sub.remove();
  }, []);

  if (!lesson || !module) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white px-8">
        <LoganSays layout="top" mood="thinking" text="Hmm, farejei por toda parte e não achei essa missão." />
        <HeroButton className="mt-6 w-full" label="Voltar para a trilha" onPress={() => router.back()} />
      </SafeAreaView>
    );
  }

  // Protege contra deep links para lições ainda bloqueadas (a vitória recém-conquistada não conta).
  // Missões especiais (ex.: fogos de fim de ano) ficam fora da trilha e sempre liberadas.
  const access =
    lesson.moduleId === SPECIAL_MODULE_ID ? ({ status: 'available', requiresPro: false } as const) : getLessonState(lesson, module, modules, snapshot);
  if (access.status === 'locked' && !result) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white px-8">
        <LoganSays
          layout="top"
          mood="thinking"
          text={
            access.requiresPro
              ? 'Essa missão faz parte do WolverBark Pro. Bora desbloquear juntos?'
              : 'Calma! Cumpra as missões anteriores para liberar esta.'
          }
        />
        {access.requiresPro && (
          <HeroButton className="mt-6 w-full" label="Conhecer o Pro" variant="hero" onPress={() => openPaywall('locked_module')} />
        )}
        <HeroButton className="mt-3 w-full" label="Voltar para a trilha" variant="secondary" onPress={() => router.back()} />
      </SafeAreaView>
    );
  }

  const step = flow[stepIndex]!;
  const isVictory = step.type === 'victory';

  const handleClose = async () => {
    if (isVictory) return router.back();
    const leave = await showConfirm('Sair da missão?', 'O Logan guarda seu progresso para você continuar depois.', {
      confirmText: 'Sair',
      cancelText: 'Continuar treinando',
      destructive: true,
    });
    if (!leave) return;
    if (!isReview) saveLessonDraft(lesson.id, stepIndex);
    router.back();
  };
  closeRef.current = () => void handleClose();

  const handleNext = () => {
    if (step.type === 'validation') {
      if (!answer || completedRef.current) return;
      completedRef.current = true;
      setResult(completeLesson(lesson.id, answer.difficulty, quizCorrect));
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
          <SegmentedProgress total={flow.length} current={stepIndex} color={module.color} />
        </View>
      </View>

      {!isVictory && (
        <View className="flex-row items-center px-5 pb-1">
          <Text className="flex-1 text-sm font-bold text-ink-400" numberOfLines={1}>
            {isReview ? 'Reforço' : module.subtitle} · {lesson.title}
          </Text>
          <Clock size={14} color={COLORS.inkSoft} />
          <Text className="ml-1 text-sm font-bold text-ink-400">{lesson.durationMinutes} min</Text>
        </View>
      )}

      <ScrollView ref={scrollRef} className="flex-1" contentContainerStyle={{ padding: 20, paddingBottom: 32 }}>
        {step.type === 'concept' && <ConceptStepView step={step} />}
        {step.type === 'quiz' && lesson.quiz && (
          <QuizStepView
            questions={lesson.quiz}
            onComplete={(correct) => {
              setQuizCorrect(correct);
              setStepIndex((i) => i + 1);
            }}
          />
        )}
        {step.type === 'practice' && (
          <PracticeStepView key={step.id} step={step} onTargetReached={() => setStepIndex((i) => Math.min(i + 1, flow.length - 1))} />
        )}
        {step.type === 'validation' && (
          <ValidationStepView step={step} selectedId={answer?.id ?? null} onSelect={setAnswer} />
        )}
        {step.type === 'victory' && <VictoryStepView step={step} result={result} />}
      </ScrollView>

      {/* O quiz tem os próprios botões de avançar. */}
      {step.type !== 'quiz' && (
        <View className="border-t-2 border-ink-900 px-5 pb-4 pt-4">
          <HeroButton
            label={step.type === 'practice' ? PRACTICE_CTA[step.kind ?? 'practice'] : CTA_LABEL[step.type]}
            variant={isVictory ? 'hero' : 'primary'}
            disabled={step.type === 'validation' && !answer}
            onPress={handleNext}
          />
        </View>
      )}
    </SafeAreaView>
  );
}
