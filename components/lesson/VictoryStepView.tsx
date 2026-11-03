import { Flame, Shield, TrendingUp, Zap } from 'lucide-react-native';
import { type ReactNode, useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, Text, View } from 'react-native';

import { Logan } from '@/components/Logan';
import { COLORS } from '@/constants/theme';
import { LEVELS } from '@/constants/gamification';
import type { LessonCompletionResult } from '@/store/useAppStore';
import type { VictoryStep } from '@/types';

interface VictoryStepViewProps {
  step: VictoryStep;
  result: LessonCompletionResult | null;
}

export function VictoryStepView({ step, result }: VictoryStepViewProps) {
  const scale = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.spring(scale, { toValue: 1, friction: 4, tension: 80, useNativeDriver: true }).start();
  }, [scale]);

  const levelTitle = result?.leveledUpTo ? LEVELS.find((l) => l.level === result.leveledUpTo)?.title : null;

  return (
    <View className="items-center">
      <Confetti />

      <Animated.View style={{ transform: [{ scale }] }}>
        <Logan size={170} mood="excited" />
      </Animated.View>

      <Text className="mt-4 text-center text-3xl font-extrabold text-akita-600">Lição concluída!</Text>
      <Text className="mt-2 px-4 text-center text-base leading-6 text-ink-600">“{step.loganSpeech}”</Text>

      {result && (
        <View className="mt-6 w-full flex-row gap-3">
          <RewardCard
            icon={<Zap size={22} color={COLORS.gold} fill={COLORS.gold} />}
            label="XP ganho"
            value={`+${result.xpEarned + result.streakBonusXp}`}
            color="#E0A800"
          />
          <RewardCard
            icon={<Flame size={22} color={COLORS.flame} fill={COLORS.flame} />}
            label={result.streakIncreased ? 'Ofensiva' : 'Ofensiva mantida'}
            value={`${result.streak.current} ${result.streak.current === 1 ? 'dia' : 'dias'}`}
            color={COLORS.flame}
          />
        </View>
      )}

      {result && result.streakBonusXp > 0 && (
        <Banner color={COLORS.flame} icon={<Flame size={18} color={COLORS.flame} />}>
          Bônus de semana perfeita: +{result.streakBonusXp} XP!
        </Banner>
      )}
      {result && result.freezesEarned > 0 && (
        <Banner color={COLORS.ice} icon={<Shield size={18} color={COLORS.ice} />}>
          O Logan te deu {result.freezesEarned} Escudo de Ofensiva!
        </Banner>
      )}
      {levelTitle && (
        <Banner color={COLORS.hero} icon={<TrendingUp size={18} color={COLORS.hero} />}>
          Nível {result?.leveledUpTo}: {levelTitle}!
        </Banner>
      )}
      {result && !result.isFirstCompletion && (
        <Text className="mt-3 text-center text-xs text-ink-400">Revisão concluída — XP reduzido pela metade.</Text>
      )}

      {step.nextTip && (
        <View className="mt-6 w-full rounded-2xl border-2 border-akita-100 bg-akita-50 p-4">
          <Text className="mb-1 font-extrabold text-akita-700">💡 Para o próximo treino</Text>
          <Text className="text-sm leading-6 text-ink-600">{step.nextTip}</Text>
        </View>
      )}
    </View>
  );
}

function RewardCard({ icon, label, value, color }: { icon: ReactNode; label: string; value: string; color: string }) {
  return (
    <View className="flex-1 overflow-hidden rounded-2xl border-2" style={{ borderColor: color }}>
      <View className="py-1.5" style={{ backgroundColor: color }}>
        <Text className="text-center text-xs font-extrabold uppercase text-white">{label}</Text>
      </View>
      <View className="flex-row items-center justify-center bg-white py-3">
        {icon}
        <Text className="ml-1.5 text-xl font-extrabold" style={{ color }}>
          {value}
        </Text>
      </View>
    </View>
  );
}

function Banner({ children, icon, color }: { children: ReactNode; icon: ReactNode; color: string }) {
  return (
    <View className="mt-3 w-full flex-row items-center rounded-xl px-4 py-3" style={{ backgroundColor: `${color}1A` }}>
      {icon}
      <Text className="ml-2 flex-1 font-bold" style={{ color }}>
        {children}
      </Text>
    </View>
  );
}

const CONFETTI = ['🦴', '⭐', '🐾', '🎉', '✨', '🦴', '⭐', '🐾', '🎉', '✨', '🦴', '🐾'];

function Confetti() {
  const { width } = Dimensions.get('window');
  const pieces = useRef(CONFETTI.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.stagger(
      80,
      pieces.map((v) =>
        Animated.timing(v, { toValue: 1, duration: 2200, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      ),
    ).start();
  }, [pieces]);

  return (
    <View pointerEvents="none" style={{ position: 'absolute', top: -40, left: -20, width, height: 500, zIndex: 10 }}>
      {pieces.map((v, i) => {
        const startX = ((i * 37) % 100) / 100 * (width - 40);
        const drift = (i % 2 === 0 ? 1 : -1) * (20 + (i % 3) * 15);
        return (
          <Animated.Text
            key={i}
            style={{
              position: 'absolute',
              left: startX,
              fontSize: 22,
              opacity: v.interpolate({ inputRange: [0, 0.8, 1], outputRange: [1, 1, 0] }),
              transform: [
                { translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, 460] }) },
                { translateX: v.interpolate({ inputRange: [0, 1], outputRange: [0, drift] }) },
                { rotate: v.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${(i % 2 ? 1 : -1) * 360}deg`] }) },
              ],
            }}
          >
            {CONFETTI[i]}
          </Animated.Text>
        );
      })}
    </View>
  );
}
