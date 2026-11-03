import { Check, Clock, Crown, Lock, Play } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';

import { COLORS, FONTS } from '@/constants/theme';
import type { Lesson, NodeStatus } from '@/types';

import { ClawMarks, Hexagon } from './icons';
import { Logan } from './Logan';

const BADGE = 64;
const SPINE_WIDTH = 6;

interface MissionRowProps {
  lesson: Lesson;
  status: NodeStatus;
  requiresPro: boolean;
  isCurrent: boolean;
  /** Lado em que o cartão da missão aparece; a medalha fica sempre no eixo central. */
  side: 'left' | 'right';
  isFirst: boolean;
  isLast: boolean;
  onPress: () => void;
}

/**
 * Uma missão no "Mapa de Missões": linha do tempo vertical com medalha hexagonal no eixo
 * e cartão alternando de lado. O eixo fica amarelo conforme as missões são cumpridas.
 */
export function MissionRow({ lesson, status, requiresPro, isCurrent, side, isFirst, isLast, onPress }: MissionRowProps) {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isCurrent) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 900, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [isCurrent, pulse]);

  const done = status === 'completed';
  const spineColor = done ? COLORS.claw : COLORS.locked;
  const card = <MissionCard lesson={lesson} status={status} requiresPro={requiresPro} isCurrent={isCurrent} onPress={onPress} />;
  const companion = isCurrent ? (
    <View className="items-center" pointerEvents="none">
      <Logan size={78} mood="hero" />
    </View>
  ) : null;

  const ringScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.18] });
  const ringOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.55, 0] });

  return (
    <View className="flex-row items-center px-3" style={{ minHeight: 112 }}>
      <View className="flex-1 pr-2">{side === 'left' ? card : companion}</View>

      {/* Eixo central + medalha */}
      <View style={{ width: BADGE + 8, alignSelf: 'stretch' }} className="items-center justify-center">
        <View
          style={{
            position: 'absolute',
            top: isFirst ? '50%' : 0,
            bottom: isLast ? '50%' : 0,
            width: SPINE_WIDTH,
            backgroundColor: spineColor,
            borderLeftWidth: 1.5,
            borderRightWidth: 1.5,
            borderColor: done ? COLORS.ink : 'transparent',
          }}
        />
        <Pressable
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={`${lesson.title}. ${STATUS_LABEL[status]}${requiresPro ? ', exclusiva Pro' : ''}`}
        >
          {({ pressed }) => (
            <View style={{ transform: [{ scale: pressed ? 0.92 : 1 }] }} className="items-center justify-center">
              {isCurrent && (
                <Animated.View
                  style={{ position: 'absolute', opacity: ringOpacity, transform: [{ scale: ringScale }] }}
                >
                  <Hexagon size={BADGE + 10} fill={COLORS.hero} stroke={COLORS.hero} />
                </Animated.View>
              )}
              <Hexagon size={BADGE} {...badgePalette(status, requiresPro, isCurrent)} />
              <View style={{ position: 'absolute' }}>
                <BadgeIcon status={status} requiresPro={requiresPro} isCurrent={isCurrent} emoji={lesson.icon} />
              </View>
            </View>
          )}
        </Pressable>
      </View>

      <View className="flex-1 pl-2">{side === 'right' ? card : companion}</View>
    </View>
  );
}

const STATUS_LABEL: Record<NodeStatus, string> = {
  locked: 'Bloqueada',
  unlocked: 'Liberada',
  in_progress: 'Em andamento',
  completed: 'Cumprida',
};

function badgePalette(status: NodeStatus, requiresPro: boolean, isCurrent: boolean) {
  if (status === 'completed') return { fill: COLORS.claw, stroke: COLORS.ink };
  if (status === 'locked') return requiresPro ? { fill: COLORS.ink, stroke: COLORS.ink } : { fill: COLORS.locked, stroke: COLORS.lockedDark };
  if (isCurrent) return { fill: COLORS.hero, stroke: COLORS.ink };
  return { fill: COLORS.white, stroke: COLORS.ink };
}

function BadgeIcon({ status, requiresPro, isCurrent, emoji }: { status: NodeStatus; requiresPro: boolean; isCurrent: boolean; emoji: string }) {
  if (status === 'locked') {
    return requiresPro ? <Crown size={24} color={COLORS.claw} fill={COLORS.claw} /> : <Lock size={22} color={COLORS.lockedDark} strokeWidth={3} />;
  }
  if (status === 'completed') return <Check size={28} color={COLORS.ink} strokeWidth={4} />;
  if (status === 'in_progress') return <Play size={24} color={isCurrent ? COLORS.white : COLORS.ink} fill={isCurrent ? COLORS.white : COLORS.ink} />;
  return <Text style={{ fontSize: 26 }}>{emoji}</Text>;
}

function MissionCard({
  lesson,
  status,
  requiresPro,
  isCurrent,
  onPress,
}: {
  lesson: Lesson;
  status: NodeStatus;
  requiresPro: boolean;
  isCurrent: boolean;
  onPress: () => void;
}) {
  const locked = status === 'locked';

  return (
    <Pressable onPress={onPress} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <View
        className="rounded-xl px-3 py-2.5"
        style={{
          backgroundColor: isCurrent ? COLORS.heroLight : COLORS.white,
          borderWidth: isCurrent ? 2.5 : 2,
          borderColor: isCurrent ? COLORS.ink : locked ? COLORS.locked : '#D5D8DE',
        }}
      >
        {isCurrent && (
          <Text style={{ fontFamily: FONTS.display, fontSize: 11, letterSpacing: 1, color: COLORS.hero }}>
            {status === 'in_progress' ? 'CONTINUAR MISSÃO' : 'MISSÃO ATUAL'}
          </Text>
        )}
        {status === 'completed' && (
          <Text style={{ fontFamily: FONTS.display, fontSize: 11, letterSpacing: 1, color: COLORS.clawDark }}>CUMPRIDA</Text>
        )}
        {requiresPro && <Text style={{ fontFamily: FONTS.display, fontSize: 11, letterSpacing: 1, color: COLORS.ink }}>PRO</Text>}
        <Text
          className="text-[14px] font-bold leading-5"
          style={{ color: locked ? COLORS.lockedDark : COLORS.ink }}
          numberOfLines={2}
        >
          {lesson.title}
        </Text>
        <View className="mt-1 flex-row items-center">
          <Clock size={12} color={COLORS.lockedDark} />
          <Text className="ml-1 mr-2.5 text-xs text-ink-400">{lesson.durationMinutes} min</Text>
          <ClawMarks size={12} color={locked ? COLORS.locked : COLORS.claw} />
          <Text className="ml-1 text-xs text-ink-400">+{lesson.xpReward}</Text>
        </View>
      </View>
    </Pressable>
  );
}
