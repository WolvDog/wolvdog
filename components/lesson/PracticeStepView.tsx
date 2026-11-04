import { useAudioPlayer } from 'expo-audio';
import { Minus, Pause, Play, Plus, RotateCcw } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { LoganSays } from '@/components/LoganSays';
import { ProgressBar } from '@/components/ProgressBar';
import { COLORS, FONTS } from '@/constants/theme';
import { useCountdown } from '@/hooks/useCountdown';
import { HapticStyle, tap } from '@/services/haptics';
import type { PracticeStep } from '@/types';

import { Clicker } from './Clicker';
import { DemoMedia } from './DemoMedia';
import { StepHeading } from './StepHeading';

const FANFARE = require('@/assets/sounds/fanfare.wav');

interface PracticeStepViewProps {
  step: PracticeStep;
  /** Chamado quando as repetições da missão são concluídas (segue para o relatório). */
  onTargetReached?: () => void;
}

export function PracticeStepView({ step, onTargetReached }: PracticeStepViewProps) {
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [reps, setReps] = useState(0);
  const targetReached = !!step.targetReps && reps >= step.targetReps;
  const fanfare = useAudioPlayer(FANFARE);
  // Ref: o pai recria o callback a cada render, e isso não pode cancelar o avanço automático.
  const onTargetReachedRef = useRef(onTargetReached);
  onTargetReachedRef.current = onTargetReached;

  // Bateu a meta de repetições: trava o clicker e segue para o Relatório do Treino.
  useEffect(() => {
    if (!targetReached) return;
    tap(HapticStyle.Heavy);
    // Mãos ocupadas com o cão: som + vibração avisam que acabou, sem precisar olhar a tela.
    fanfare.seekTo(0);
    fanfare.play();
    const id = setTimeout(() => onTargetReachedRef.current?.(), 1200);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetReached]);

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
      <StepHeading kicker="Hora do treino" color={COLORS.hero} title={step.title} />

      <LoganSays text={step.loganSpeech} mood={step.loganMood} size={80} />

      {step.media && <DemoMedia media={step.media} />}

      <View className="mt-6">
        {step.instructions.map((instruction, i) => {
          const done = checked.has(i);
          return (
            <Pressable
              key={i}
              onPress={() => toggle(i)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: done }}
              className="mb-2.5 flex-row items-start rounded-xl border-2 p-3.5"
              style={{ borderColor: done ? COLORS.ink : '#D5D8DE', backgroundColor: done ? COLORS.clawLight : COLORS.white }}
            >
              <View
                className="h-7 w-7 items-center justify-center rounded-md border-2"
                style={{ backgroundColor: done ? COLORS.claw : COLORS.white, borderColor: done ? COLORS.ink : '#D5D8DE' }}
              >
                <Text style={{ fontFamily: FONTS.display, fontSize: 14, color: done ? COLORS.ink : COLORS.inkSoft }}>
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

      <Clicker
        countsReps={!!step.targetReps}
        disabled={targetReached}
        onClick={() => step.targetReps && setReps((r) => Math.min(step.targetReps!, r + 1))}
      />
      {targetReached && (
        <View className="mt-3 rounded-xl border-2 border-ink-900 bg-claw-500 p-3">
          <Text className="text-center font-bold text-ink-900">🎯 Meta de repetições batida! Indo para o relatório…</Text>
        </View>
      )}

      {(step.timerSeconds || step.targetReps) && (
        <View className="mt-3 flex-row gap-3">
          {step.timerSeconds ? (
            <TimerCard
              seconds={step.timerSeconds}
              onFinish={() => {
                fanfare.seekTo(0);
                fanfare.play();
              }}
            />
          ) : null}
          {step.targetReps ? <RepCounter target={step.targetReps} count={reps} onChange={setReps} /> : null}
        </View>
      )}

      {step.avoid && step.avoid.length > 0 && (
        <View className="mt-5 rounded-xl border-2 border-ink-900 bg-white p-4">
          <Text className="mb-2 font-bold" style={{ color: COLORS.danger }}>
            🚫 Evite
          </Text>
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

function CardLabel({ children }: { children: string }) {
  return (
    <Text style={{ fontFamily: FONTS.displayMedium, fontSize: 12, letterSpacing: 1, color: COLORS.inkSoft }}>
      {children.toUpperCase()}
    </Text>
  );
}

function TimerCard({ seconds, onFinish }: { seconds: number; onFinish?: () => void }) {
  const timer = useCountdown(seconds, () => {
    tap(HapticStyle.Heavy);
    onFinish?.();
  });
  const running = timer.status === 'running';
  const finished = timer.status === 'finished';

  return (
    <View className="flex-1 rounded-xl border-2 border-ink-900 bg-white p-4">
      <CardLabel>Cronômetro</CardLabel>
      <Text
        style={{
          fontFamily: FONTS.display,
          fontSize: 32,
          marginVertical: 2,
          color: finished ? COLORS.hero : COLORS.ink,
          fontVariant: ['tabular-nums'],
        }}
      >
        {finished ? 'Feito!' : timer.label}
      </Text>
      <ProgressBar progress={timer.progress} height={8} color={COLORS.hero} />
      <View className="mt-3 flex-row gap-2">
        <Pressable
          onPress={running ? timer.pause : timer.start}
          disabled={finished}
          accessibilityRole="button"
          accessibilityLabel={running ? 'Pausar cronômetro' : 'Iniciar cronômetro'}
          className="flex-1 items-center rounded-lg py-2"
          style={{ backgroundColor: finished ? COLORS.locked : COLORS.hero }}
        >
          {running ? <Pause size={18} color={COLORS.white} fill={COLORS.white} /> : <Play size={18} color={COLORS.white} fill={COLORS.white} />}
        </Pressable>
        <Pressable
          onPress={timer.reset}
          accessibilityRole="button"
          accessibilityLabel="Reiniciar cronômetro"
          className="items-center rounded-lg bg-cloud px-3 py-2"
        >
          <RotateCcw size={18} color={COLORS.inkSoft} />
        </Pressable>
      </View>
    </View>
  );
}

function RepCounter({ target, count, onChange }: { target: number; count: number; onChange: (n: number) => void }) {
  const done = count >= target;

  const change = (delta: number) => {
    tap(delta > 0 && count + 1 === target ? HapticStyle.Heavy : HapticStyle.Light);
    onChange(Math.min(target, Math.max(0, count + delta)));
  };

  return (
    <View className="flex-1 rounded-xl border-2 border-ink-900 bg-white p-4">
      <CardLabel>Repetições</CardLabel>
      <Text style={{ fontFamily: FONTS.display, fontSize: 32, marginVertical: 2, color: done ? COLORS.hero : COLORS.ink }}>
        {count}
        <Text style={{ fontSize: 18, color: COLORS.lockedDark }}>/{target}</Text>
      </Text>
      <ProgressBar progress={count / target} height={8} color={COLORS.claw} />
      <View className="mt-3 flex-row gap-2">
        <Pressable onPress={() => change(-1)} accessibilityLabel="Diminuir repetição" className="items-center rounded-lg bg-cloud px-3 py-2">
          <Minus size={18} color={COLORS.inkSoft} />
        </Pressable>
        <Pressable
          onPress={() => change(1)}
          disabled={done}
          accessibilityLabel="Adicionar repetição"
          className="flex-1 items-center rounded-lg border-2 border-ink-900 py-1.5"
          style={{ backgroundColor: COLORS.claw }}
        >
          <Plus size={18} color={COLORS.ink} strokeWidth={3} />
        </Pressable>
      </View>
    </View>
  );
}
