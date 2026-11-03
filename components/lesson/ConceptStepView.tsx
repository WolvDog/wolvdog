import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { LoganSays } from '@/components/LoganSays';
import type { ConceptStep } from '@/types';

export function ConceptStepView({ step }: { step: ConceptStep }) {
  const [showWhy, setShowWhy] = useState(false);

  return (
    <View>
      <Text className="mb-1 text-xs font-extrabold uppercase tracking-widest text-akita-600">Dica do Logan</Text>
      <Text className="mb-5 text-2xl font-extrabold text-ink-900">{step.title}</Text>

      <LoganSays text={step.loganSpeech} mood={step.loganMood} size={92} />

      <View className="mt-6 rounded-2xl border-2 border-gray-200 bg-white p-5">
        <Text className="text-base leading-7 text-ink-900">{step.body}</Text>
      </View>

      {step.whyItWorks && (
        <Pressable
          onPress={() => setShowWhy((v) => !v)}
          className="mt-4 rounded-2xl border-2 border-ice-500/30 bg-ice-100 p-4"
          accessibilityRole="button"
          accessibilityState={{ expanded: showWhy }}
        >
          <Text className="font-extrabold text-ice-500">🔬 Por que funciona? {showWhy ? '▲' : '▼'}</Text>
          {showWhy && <Text className="mt-2 text-sm leading-6 text-ink-600">{step.whyItWorks}</Text>}
        </Pressable>
      )}
    </View>
  );
}
