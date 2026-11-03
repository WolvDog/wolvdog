import { Bone, PawPrint, TrendingUp } from 'lucide-react-native';
import { type ReactNode, useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, Text, View } from 'react-native';

import { ClawMarks } from '@/components/icons';
import { Logan } from '@/components/Logan';
import { days, points, TERMS } from '@/constants/brand';
import { LEVELS } from '@/constants/gamification';
import { COLORS, FONTS } from '@/constants/theme';
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

      <View className="mt-4 rotate-[-2deg] rounded-lg border-2 border-ink-900 bg-claw-500 px-5 py-1.5">
        <Text style={{ fontFamily: FONTS.display, fontSize: 30, color: COLORS.ink }}>MISSÃO CUMPRIDA!</Text>
      </View>
      <Text className="mt-3 px-4 text-center text-base leading-6 text-ink-600">“{step.loganSpeech}”</Text>

      {result && (
        <View className="mt-6 w-full flex-row gap-3">
          <RewardCard
            icon={<ClawMarks size={22} />}
            label={`${TERMS.points} ganhas`}
            value={`+${result.xpEarned + result.streakBonusXp}`}
            color={COLORS.ink}
            accent={COLORS.claw}
          />
          <RewardCard
            icon={<PawPrint size={22} color={COLORS.akita} fill={COLORS.akita} />}
            label={result.streakIncreased ? TERMS.streak : `${TERMS.streak} mantida`}
            value={days(result.streak.current)}
            color={COLORS.white}
            accent={COLORS.hero}
          />
        </View>
      )}

      {result && result.streakBonusXp > 0 && (
        <Banner color={COLORS.akitaDark} icon={<PawPrint size={18} color={COLORS.akitaDark} />}>
          Bônus de semana perfeita: +{points(result.streakBonusXp)}!
        </Banner>
      )}
      {result && result.freezesEarned > 0 && (
        <Banner color={COLORS.hero} icon={<Bone size={18} color={COLORS.hero} />}>
          O Logan guardou {result.freezesEarned} {result.freezesEarned > 1 ? TERMS.freezes : TERMS.freeze} pra você!
        </Banner>
      )}
      {levelTitle && (
        <Banner color={COLORS.hero} icon={<TrendingUp size={18} color={COLORS.hero} />}>
          Nova {TERMS.level.toLowerCase()}: {levelTitle}!
        </Banner>
      )}
      {result && !result.isFirstCompletion && (
        <Text className="mt-3 text-center text-xs text-ink-400">Missão revisada — metade das garras.</Text>
      )}

      {step.nextTip && (
        <View className="mt-6 w-full rounded-xl border-2 border-ink-900 bg-white p-4">
          <Text className="mb-1 font-bold text-hero-500">💡 Para o próximo treino</Text>
          <Text className="text-sm leading-6 text-ink-600">{step.nextTip}</Text>
        </View>
      )}
    </View>
  );
}

function RewardCard({
  icon,
  label,
  value,
  color,
  accent,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  color: string;
  accent: string;
}) {
  return (
    <View className="flex-1 overflow-hidden rounded-xl border-2 border-ink-900">
      <View className="py-1.5" style={{ backgroundColor: accent }}>
        <Text className="text-center" style={{ fontFamily: FONTS.display, fontSize: 12, letterSpacing: 1, color }}>
          {label.toUpperCase()}
        </Text>
      </View>
      <View className="flex-row items-center justify-center bg-white py-3">
        {icon}
        <Text className="ml-1.5" style={{ fontFamily: FONTS.display, fontSize: 22, color: COLORS.ink }}>
          {value}
        </Text>
      </View>
    </View>
  );
}

function Banner({ children, icon, color }: { children: ReactNode; icon: ReactNode; color: string }) {
  return (
    <View className="mt-3 w-full flex-row items-center rounded-lg border-2 px-4 py-3" style={{ borderColor: color, backgroundColor: `${color}14` }}>
      {icon}
      <Text className="ml-2 flex-1 font-bold" style={{ color }}>
        {children}
      </Text>
    </View>
  );
}

const CONFETTI = ['🦴', '⚡', '🐾', '🦴', '💛', '💙', '🦴', '⚡', '🐾', '💛', '💙', '🐾'];

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
