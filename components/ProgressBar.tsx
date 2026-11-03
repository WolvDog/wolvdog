import { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

import { COLORS } from '@/constants/theme';

interface ProgressBarProps {
  /** 0..1 */
  progress: number;
  color?: string;
  height?: number;
  trackColor?: string;
}

export function ProgressBar({ progress, color = COLORS.claw, height = 12, trackColor = COLORS.locked }: ProgressBarProps) {
  const value = useRef(new Animated.Value(progress)).current;

  useEffect(() => {
    Animated.timing(value, { toValue: Math.min(1, Math.max(0, progress)), duration: 450, useNativeDriver: false }).start();
  }, [progress, value]);

  const width = value.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <View style={{ height, backgroundColor: trackColor, borderRadius: 4, overflow: 'hidden' }}>
      <Animated.View style={{ width, height, backgroundColor: color, borderRadius: 4 }} />
    </View>
  );
}

/** Barra dividida em etapas — usada no topo das missões. */
export function SegmentedProgress({ total, current, color = COLORS.claw }: { total: number; current: number; color?: string }) {
  return (
    <View className="flex-row gap-1.5">
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          className="h-3 flex-1 rounded-sm"
          style={{
            backgroundColor: i <= current ? color : COLORS.locked,
            borderWidth: i === current ? 2 : 0,
            borderColor: COLORS.ink,
          }}
        />
      ))}
    </View>
  );
}
