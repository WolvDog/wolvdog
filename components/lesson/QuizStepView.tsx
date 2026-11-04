import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { HeroButton } from '@/components/HeroButton';
import { ClawMarks } from '@/components/icons';
import { LoganSays } from '@/components/LoganSays';
import { QUIZ_XP_PER_CORRECT } from '@/constants/gamification';
import { COLORS, FONTS } from '@/constants/theme';
import { HapticStyle, tap } from '@/services/haptics';
import type { QuizQuestion } from '@/types';

import { StepHeading } from './StepHeading';

interface QuizStepViewProps {
  questions: QuizQuestion[];
  /** Chamado ao fim do quiz com o número de acertos. */
  onComplete: (correct: number) => void;
}

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

/** Quiz de múltipla escolha das missões teóricas: uma pergunta por vez, com explicação após responder. */
export function QuizStepView({ questions, onComplete }: QuizStepViewProps) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);

  const q = questions[index]!;
  const answered = selected !== null;
  const isRight = selected === q.correctIndex;
  const isLast = index === questions.length - 1;

  function choose(i: number) {
    if (answered) return;
    setSelected(i);
    const right = i === q.correctIndex;
    tap(right ? HapticStyle.Medium : HapticStyle.Heavy);
    if (right) setCorrect((c) => c + 1);
  }

  function next() {
    if (isLast) return onComplete(correct);
    setIndex((i) => i + 1);
    setSelected(null);
  }

  return (
    <View>
      <StepHeading kicker={`Quiz do Logan · ${index + 1}/${questions.length}`} color={COLORS.akitaDark} title={q.question} />

      <LoganSays
        size={72}
        mood={!answered ? 'thinking' : isRight ? 'excited' : 'happy'}
        text={!answered ? 'Escolha a resposta certa. Cada acerto vale garras!' : isRight ? `Isso aí! ${q.explanation}` : `Quase! ${q.explanation}`}
      />

      <View className="mt-5">
        {q.options.map((option, i) => {
          const isCorrectOption = i === q.correctIndex;
          const isChosen = i === selected;
          const bg = !answered ? COLORS.white : isCorrectOption ? COLORS.heroLight : isChosen ? '#FDECEC' : COLORS.white;
          const border = !answered ? '#D5D8DE' : isCorrectOption ? COLORS.hero : isChosen ? COLORS.danger : '#E4E6EB';
          return (
            <Pressable
              key={option}
              onPress={() => choose(i)}
              disabled={answered}
              accessibilityRole="radio"
              accessibilityState={{ selected: isChosen, disabled: answered }}
              className="mb-2.5 flex-row items-center rounded-xl px-4 py-3.5"
              style={{ backgroundColor: bg, borderColor: border, borderWidth: answered && (isCorrectOption || isChosen) ? 2.5 : 2 }}
            >
              <View className="mr-3 h-7 w-7 items-center justify-center rounded-md border-2" style={{ borderColor: COLORS.ink }}>
                <Text style={{ fontFamily: FONTS.display, fontSize: 14, color: COLORS.ink }}>
                  {answered && isCorrectOption ? '✓' : answered && isChosen ? '✗' : LETTERS[i]}
                </Text>
              </View>
              <Text className="flex-1 text-[15px] font-bold" style={{ color: COLORS.ink }}>
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {answered && (
        <>
          <View className="mt-1 flex-row items-center justify-center">
            <ClawMarks size={16} color={isRight ? COLORS.claw : COLORS.locked} />
            <Text className="ml-1.5 text-sm font-bold" style={{ color: isRight ? COLORS.ink : COLORS.inkSoft }}>
              {isRight ? `+${QUIZ_XP_PER_CORRECT} garras` : 'Sem garras desta vez'}
            </Text>
          </View>
          <HeroButton className="mt-4" label={isLast ? 'Ir para o treino' : 'Próxima pergunta'} onPress={next} />
        </>
      )}
    </View>
  );
}
