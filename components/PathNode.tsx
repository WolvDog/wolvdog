import { Check, Crown, Lock, Play } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';

import { COLORS } from '@/constants/theme';
import type { Lesson, NodeStatus } from '@/types';

const NODE_SIZE = 76;
const DEPTH = 7;

interface PathNodeProps {
  lesson: Lesson;
  status: NodeStatus;
  requiresPro: boolean;
  isCurrent: boolean;
  color: string;
  colorDark: string;
  /** Deslocamento horizontal para o zigue-zague da trilha. */
  offsetX: number;
  onPress: () => void;
}

/** Nó circular da trilha (lição), com status visual: bloqueado, liberado, em progresso, concluído. */
export function PathNode({ lesson, status, requiresPro, isCurrent, color, colorDark, offsetX, onPress }: PathNodeProps) {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isCurrent) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [isCurrent, pulse]);

  const palette =
    status === 'locked'
      ? { bg: COLORS.locked, shadow: COLORS.lockedDark }
      : status === 'completed'
        ? { bg: COLORS.gold, shadow: '#E0A800' }
        : { bg: color, shadow: colorDark };

  const tooltipY = pulse.interpolate({ inputRange: [0, 1], outputRange: [0, -5] });

  return (
    <View className="items-center" style={{ transform: [{ translateX: offsetX }], marginVertical: 10 }}>
      {isCurrent && (
        <Animated.View
          className="mb-2 rounded-xl border-2 border-gray-200 bg-white px-3 py-1.5"
          style={{ transform: [{ translateY: tooltipY }] }}
        >
          <Text className="font-extrabold uppercase" style={{ color }}>
            {status === 'in_progress' ? 'Continuar' : 'Começar'}
          </Text>
          <View className="absolute -bottom-2 left-1/2 h-3 w-3 -translate-x-1.5 rotate-45 border-b-2 border-r-2 border-gray-200 bg-white" />
        </Animated.View>
      )}

      {/* Anel de destaque para o nó atual */}
      <View
        className="items-center justify-center rounded-full"
        style={{
          width: NODE_SIZE + 18,
          height: NODE_SIZE + 18 + DEPTH,
          borderWidth: isCurrent ? 5 : 0,
          borderColor: isCurrent ? `${color}55` : 'transparent',
        }}
      >
        <Pressable
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={`${lesson.title}. ${STATUS_LABEL[status]}${requiresPro ? ', exclusivo Pro' : ''}`}
        >
          {({ pressed }) => (
            <View style={{ paddingTop: pressed ? DEPTH : 0 }}>
              <View
                style={{
                  width: NODE_SIZE,
                  height: NODE_SIZE,
                  borderRadius: NODE_SIZE / 2,
                  backgroundColor: palette.shadow,
                  paddingBottom: pressed ? 0 : DEPTH,
                }}
              >
                <View
                  className="flex-1 items-center justify-center rounded-full"
                  style={{ backgroundColor: palette.bg }}
                >
                  <NodeIcon status={status} requiresPro={requiresPro} emoji={lesson.icon} />
                </View>
              </View>
            </View>
          )}
        </Pressable>
      </View>

      <Text
        className="mt-1 max-w-[150px] text-center text-xs font-bold"
        style={{ color: status === 'locked' ? COLORS.lockedDark : COLORS.inkSoft }}
        numberOfLines={2}
      >
        {lesson.title}
      </Text>
    </View>
  );
}

const STATUS_LABEL: Record<NodeStatus, string> = {
  locked: 'Bloqueada',
  unlocked: 'Liberada',
  in_progress: 'Em progresso',
  completed: 'Concluída',
};

function NodeIcon({ status, requiresPro, emoji }: { status: NodeStatus; requiresPro: boolean; emoji: string }) {
  if (status === 'locked') {
    return requiresPro ? (
      <Crown size={30} color={COLORS.lockedDark} fill={COLORS.lockedDark} />
    ) : (
      <Lock size={28} color={COLORS.lockedDark} strokeWidth={3} />
    );
  }
  if (status === 'completed') return <Check size={36} color="#FFFFFF" strokeWidth={4} />;
  if (status === 'in_progress') return <Play size={30} color="#FFFFFF" fill="#FFFFFF" />;
  return <Text style={{ fontSize: 32 }}>{emoji}</Text>;
}
