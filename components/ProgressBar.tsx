import { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

interface ProgressBarProps {
  /** 0..1 */
  progress: number;
  color?: string;
  height?: number;
  trackColor?: string;
}

export function ProgressBar({ progress, color = '#58CC02', height = 16, trackColor = '#E5E5E5' }: ProgressBarProps) {
  const value = useRef(new Animated.Value(progress)).current;

  useEffect(() => {
    Animated.spring(value, { toValue: Math.min(1, Math.max(0, progress)), useNativeDriver: false, friction: 8 }).start();
  }, [progress, value]);

  const width = value.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <View style={{ height, backgroundColor: trackColor, borderRadius: height / 2, overflow: 'hidden' }}>
      <Animated.View style={{ width, height, backgroundColor: color, borderRadius: height / 2 }}>
        {/* Brilho superior, como no Duolingo */}
        <View
          style={{
            position: 'absolute',
            top: height * 0.22,
            left: 8,
            right: 8,
            height: Math.max(3, height * 0.22),
            borderRadius: 4,
            backgroundColor: 'rgba(255,255,255,0.35)',
          }}
        />
      </Animated.View>
    </View>
  );
}
