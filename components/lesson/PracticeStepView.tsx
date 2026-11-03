import * as Haptics from 'expo-haptics';
import { Minus, Pause, Play, Plus, RotateCcw } from 'lucide-react-native';
import { useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';

import { LoganSays } from '@/components/LoganSays';
import { ProgressBar } from '@/components/ProgressBar';
import { COLORS } from '@/constants/theme';
import { useCountdown } from '@/hooks/useCountdown';
import type { PracticeStep } from '@/types';

function tap(style = Haptics.ImpactFeedbackStyle.Light) {
  if (Platform.OS !== 'web') void Haptics.impactAsync(style);
}

export function PracticeStepView({ step }: { step: PracticeStep }) {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const toggle = (i: number) => {
    tap();
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <View>
      <Text className="mb-1 text-xs font-extrabold uppercase tracking-widest text-hero-500">Passo a passo prático</Text>
      <Text className="mb-5 text-2xl font-extrabold text-ink-900">{step.title}</Text>

      <LoganSays text={step.loganSpeech} mood={step.loganMood} size={80} />

      <View className="mt-6">
        {step.instructions.map((instruction, i) => {
          const done = checked.has(i);
          return (
            <Pressable
              key={i}
              onPress={() => toggle(i)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: done }}
              className="mb-2.5 flex-row items-start rounded-2xl border-2 p-3.5"
              style={{ borderColor: done ? COLORS.leaf : '#E5E5E5', backgroundColor: done ? '#F1FBE8' : '#FFFFFF' }}
            >
              <View
                className="h-7 w-7 items-center justify-center rounded-full"
                style={{ backgroundColor: done ? COLORS.leaf : '#E5E5E5' }}
              >
                <Text className="text-sm font-extrabold" style={{ color: done ? '#FFFFFF' : COLORS.inkSoft }}>
                  {done ? '✓' : i + 1}
                </Text>
              </View>
              <Text
                className="ml-3 flex-1 text-[15px] leading-6"
                style={{ color: done ? COLORS.inkSoft : COLORS.ink, textDecorationLine: done ? 'line-through' : 'none' }}
              >
                {instruction}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {(step.timerSeconds || step.targetReps) && (
        <View className="mt-3 flex-row gap-3">
          {step.timerSeconds ? <TimerCard seconds={step.timerSeconds} /> : null}
          {step.targetReps ? <RepCounter target={step.targetReps} /> : null}
        </View>
      )}

      {step.avoid && step.avoid.length > 0 && (
        <View className="mt-5 rounded-2xl border-2 border-red-200 bg-red-50 p-4">
          <Text className="mb-2 font-extrabold text-red-500">🚫 Evite</Text>
          {step.avoid.map((a) => (
            <Text key={a} className="mb-1 text-sm leading-5 text-ink-600">
              • {a}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

function TimerCard({ seconds }: { seconds: number }) {
  const timer = useCountdown(seconds, () => tap(Haptics.ImpactFeedbackStyle.Heavy));
  const running = timer.status === 'running';

  return (
    <View className="flex-1 rounded-2xl border-2 border-gray-200 bg-white p-4">
      <Text className="text-xs font-extrabold uppercase text-ink-400">Cronômetro</Text>
      <Text
        className="my-1 text-3xl font-extrabold"
        style={{ color: timer.status === 'finished' ? COLORS.leaf : COLORS.ink, fontVariant: ['tabular-nums'] }}
      >
        {timer.status === 'finished' ? 'Feito!' : timer.label}
      </Text>
      <ProgressBar progress={timer.progress} height={8} color={COLORS.ice} />
      <View className="mt-3 flex-row gap-2">
        <Pressable
          onPress={running ? timer.pause : timer.start}
          disabled={timer.status === 'finished'}
          accessibilityRole="button"
          accessibilityLabel={running ? 'Pausar cronômetro' : 'Iniciar cronômetro'}
          className="flex-1 items-center rounded-xl py-2"
          style={{ backgroundColor: timer.status === 'finished' ? '#E5E5E5' : COLORS.ice }}
        >
          {running ? <Pause size={18} color="#FFFFFF" fill="#FFFFFF" /> : <Play size={18} color="#FFFFFF" fill="#FFFFFF" />}
        </Pressable>
        <Pressable
          onPress={timer.reset}
          accessibilityRole="button"
          accessibilityLabel="Reiniciar cronômetro"
          className="items-center rounded-xl bg-gray-100 px-3 py-2"
        >
          <RotateCcw size={18} color={COLORS.inkSoft} />
        </Pressable>
      </View>
    </View>
  );
}

function RepCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  const done = count >= target;

  const change = (delta: number) => {
    tap(delta > 0 && count + 1 === target ? Haptics.ImpactFeedbackStyle.Heavy : Haptics.ImpactFeedbackStyle.Light);
    setCount((c) => Math.max(0, c + delta));
  };

  return (
    <View className="flex-1 rounded-2xl border-2 border-gray-200 bg-white p-4">
      <Text className="text-xs font-extrabold uppercase text-ink-400">Repetições</Text>
      <Text className="my-1 text-3xl font-extrabold" style={{ color: done ? COLORS.leaf : COLORS.ink }}>
        {count}
        <Text className="text-lg text-ink-400">/{target}</Text>
      </Text>
      <ProgressBar progress={count / target} height={8} color={COLORS.leaf} />
      <View className="mt-3 flex-row gap-2">
        <Pressable
          onPress={() => change(-1)}
          accessibilityLabel="Diminuir repetição"
          className="items-center rounded-xl bg-gray-100 px-3 py-2"
        >
          <Minus size={18} color={COLORS.inkSoft} />
        </Pressable>
        <Pressable
          onPress={() => change(1)}
          accessibilityLabel="Adicionar repetição"
          className="flex-1 items-center rounded-xl py-2"
          style={{ backgroundColor: COLORS.leaf }}
        >
          <Plus size={18} color="#FFFFFF" strokeWidth={3} />
        </Pressable>
      </View>
    </View>
  );
}
