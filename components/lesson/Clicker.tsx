import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';

import { COLORS, FONTS } from '@/constants/theme';
import { HapticStyle, tap } from '@/services/haptics';

const CLICK_SOUND = require('@/assets/sounds/clicker.wav');

interface ClickerProps {
  /** Chamado a cada clique (ex.: somar uma repetição). */
  onClick?: () => void;
  countsReps?: boolean;
}

/**
 * Clicker digital: marca o comportamento certo no instante exato, com som e vibração.
 * Substitui o clicker físico durante o treino — clique e, em seguida, o petisco.
 */
export function Clicker({ onClick, countsReps }: ClickerProps) {
  const player = useAudioPlayer(CLICK_SOUND);
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Toca mesmo com o iPhone no modo silencioso e sem interromper a música do tutor.
    void setAudioModeAsync({ playsInSilentMode: true, interruptionMode: 'mixWithOthers' }).catch(() => {});
  }, []);

  function handlePress() {
    player.seekTo(0);
    player.play();
    tap(HapticStyle.Medium);
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.92, duration: 50, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
    onClick?.();
  }

  return (
    <View className="mt-3 flex-row items-center rounded-xl border-2 border-ink-900 bg-white p-4">
      <Pressable onPress={handlePress} accessibilityRole="button" accessibilityLabel="Clicker: marcar acerto" hitSlop={8}>
        <Animated.View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            borderWidth: 3,
            borderColor: COLORS.ink,
            backgroundColor: COLORS.claw,
            alignItems: 'center',
            justifyContent: 'center',
            transform: [{ scale }],
          }}
        >
          <Text style={{ fontFamily: FONTS.display, fontSize: 18, color: COLORS.ink }}>CLIC</Text>
        </Animated.View>
      </Pressable>
      <View className="ml-4 flex-1">
        <Text style={{ fontFamily: FONTS.displayMedium, fontSize: 12, letterSpacing: 1, color: COLORS.inkSoft }}>CLICKER DIGITAL</Text>
        <Text className="mt-0.5 text-sm leading-5 text-ink-900">
          Toque no <Text className="font-bold">exato segundo</Text> do acerto e logo depois dê o petisco.
          {countsReps ? ' Cada clique conta uma repetição.' : ''}
        </Text>
      </View>
    </View>
  );
}
