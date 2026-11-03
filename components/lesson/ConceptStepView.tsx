import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { LoganSays } from '@/components/LoganSays';
import { COLORS } from '@/constants/theme';
import type { ConceptStep } from '@/types';

import { StepHeading } from './StepHeading';

export function ConceptStepView({ step }: { step: ConceptStep }) {
  const [showWhy, setShowWhy] = useState(false);

  return (
    <View>
      <StepHeading kicker="Dica do Logan" color={COLORS.akitaDark} title={step.title} />

      <LoganSays text={step.loganSpeech} mood={step.loganMood} size={92} />

      <View className="mt-6 rounded-xl border-2 border-ink-900 bg-white p-5">
        <Text className="text-base leading-7 text-ink-900">{step.body}</Text>
      </View>

      {step.whyItWorks && (
        <Pressable
          onPress={() => setShowWhy((v) => !v)}
          className="mt-4 rounded-xl border-2 border-hero-500 bg-hero-50 p-4"
          accessibilityRole="button"
          accessibilityState={{ expanded: showWhy }}
        >
          <Text className="font-bold text-hero-500">🔬 Por que funciona? {showWhy ? '▲' : '▼'}</Text>
          {showWhy && <Text className="mt-2 text-sm leading-6 text-ink-600">{step.whyItWorks}</Text>}
        </Pressable>
      )}
    </View>
  );
}
