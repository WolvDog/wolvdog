import { Text, View } from 'react-native';

import { OptionCard } from '@/components/form';
import { LoganSays } from '@/components/LoganSays';
import { COLORS } from '@/constants/theme';
import type { ValidationOption, ValidationStep } from '@/types';

import { StepHeading } from './StepHeading';

interface ValidationStepViewProps {
  step: ValidationStep;
  selectedId: string | null;
  onSelect: (option: ValidationOption) => void;
}

export function ValidationStepView({ step, selectedId, onSelect }: ValidationStepViewProps) {
  const selected = step.options.find((o) => o.id === selectedId);

  return (
    <View>
      <StepHeading kicker="Relatório do treino" color={COLORS.clawDark} title={step.question} />

      <LoganSays
        text={selected ? selected.loganFeedback : step.loganSpeech}
        mood={selected ? (selected.difficulty === 'easy' ? 'excited' : 'happy') : 'thinking'}
        size={80}
      />

      <View className="mt-6" accessibilityRole="radiogroup">
        {step.options.map((option) => (
          <OptionCard
            key={option.id}
            title={option.label}
            emoji={option.emoji}
            active={option.id === selectedId}
            onPress={() => onSelect(option)}
          />
        ))}
      </View>
      {!selected && <Text className="mt-1 text-center text-xs text-ink-400">Escolha uma opção para cumprir a missão.</Text>}
    </View>
  );
}
