import { Pressable, Text, View } from 'react-native';

import { LoganSays } from '@/components/LoganSays';
import { COLORS } from '@/constants/theme';
import type { ValidationOption, ValidationStep } from '@/types';

interface ValidationStepViewProps {
  step: ValidationStep;
  selectedId: string | null;
  onSelect: (option: ValidationOption) => void;
}

export function ValidationStepView({ step, selectedId, onSelect }: ValidationStepViewProps) {
  const selected = step.options.find((o) => o.id === selectedId);

  return (
    <View>
      <Text className="mb-1 text-xs font-extrabold uppercase tracking-widest text-purple-500">Validação do treino</Text>
      <Text className="mb-5 text-2xl font-extrabold text-ink-900">{step.question}</Text>

      <LoganSays
        text={selected ? selected.loganFeedback : step.loganSpeech}
        mood={selected ? (selected.difficulty === 'easy' ? 'excited' : 'happy') : 'thinking'}
        size={80}
      />

      <View className="mt-6" accessibilityRole="radiogroup">
        {step.options.map((option) => {
          const active = option.id === selectedId;
          return (
            <Pressable
              key={option.id}
              onPress={() => onSelect(option)}
              accessibilityRole="radio"
              accessibilityState={{ selected: active }}
              className="mb-3"
            >
              {({ pressed }) => (
                <View
                  style={{
                    backgroundColor: active ? '#84D8FF' : '#E5E5E5',
                    borderRadius: 16,
                    paddingBottom: pressed ? 0 : 4,
                    marginTop: pressed ? 4 : 0,
                  }}
                >
                  <View
                    className="flex-row items-center rounded-2xl border-2 px-4 py-4"
                    style={{
                      borderColor: active ? '#84D8FF' : '#E5E5E5',
                      backgroundColor: active ? '#DDF4FF' : '#FFFFFF',
                    }}
                  >
                    <Text className="text-2xl">{option.emoji}</Text>
                    <Text
                      className="ml-3 flex-1 text-base font-bold"
                      style={{ color: active ? COLORS.ice : COLORS.ink }}
                    >
                      {option.label}
                    </Text>
                  </View>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
