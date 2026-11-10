import { useEffect, useRef } from 'react';
import { Animated, Easing, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Ellipse, G, Path, Text as SvgText } from 'react-native-svg';

import { COLORS } from '@/constants/theme';
import type { LoganMood } from '@/types';

interface LoganProps {
  size?: number;
  mood?: LoganMood;
  /** Balanço suave de "respiração" — desligue em listas longas. */
  animated?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * Logan — Akita Inu mascote do WolvDog, desenhado em SVG para escalar sem assets.
 * Pelagem avermelhada/dourada, urajiro (máscara branca) no focinho e bochechas,
 * orelhas eretas, máscara de herói azul e bandana vermelha com o emblema "W".
 */
export function Logan({ size = 96, mood = 'happy', animated = true, style }: LoganProps) {
  const bob = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animated) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(bob, { toValue: 0, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [animated, bob]);

  const amplitude = mood === 'excited' ? -6 : -3;
  const translateY = bob.interpolate({ inputRange: [0, 1], outputRange: [0, amplitude] });

  return (
    <Animated.View style={[{ width: size, height: size, transform: [{ translateY }] }, style]}>
      <Svg width={size} height={size} viewBox="0 0 120 120">
        {/* Bandana azul com emblema amarelo */}
        <Path d="M30 92 Q60 122 90 92 L84 104 Q60 126 36 104 Z" fill={COLORS.hero} stroke={COLORS.ink} strokeWidth={1.5} />
        <Circle cx={60} cy={108} r={8} fill={COLORS.claw} stroke={COLORS.ink} strokeWidth={1.5} />
        <SvgText x={60} y={112} fontSize={10} fontWeight="bold" fill={COLORS.ink} textAnchor="middle">
          W
        </SvgText>

        {/* Orelhas eretas */}
        <Path d="M20 54 L30 8 L56 34 Z" fill={COLORS.akitaDark} stroke={COLORS.ink} strokeWidth={2} strokeLinejoin="round" />
        <Path d="M100 54 L90 8 L64 34 Z" fill={COLORS.akitaDark} stroke={COLORS.ink} strokeWidth={2} strokeLinejoin="round" />
        <Path d="M28 44 L32 18 L48 34 Z" fill="#F7B9A0" />
        <Path d="M92 44 L88 18 L72 34 Z" fill="#F7B9A0" />

        {/* Cabeça */}
        <Ellipse cx={60} cy={62} rx={42} ry={36} fill={COLORS.akita} stroke={COLORS.ink} strokeWidth={2} />

        {/* Urajiro: marcações brancas bem definidas no focinho e nas bochechas */}
        <Path
          d="M24 70 Q30 98 60 100 Q90 98 96 70 Q84 80 60 78 Q36 80 24 70 Z"
          fill={COLORS.urajiro}
          stroke={COLORS.ink}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        <Ellipse cx={60} cy={82} rx={20} ry={15} fill={COLORS.urajiro} />
        <Ellipse cx={44} cy={44} rx={5} ry={3.5} fill={COLORS.urajiro} />
        <Ellipse cx={76} cy={44} rx={5} ry={3.5} fill={COLORS.urajiro} />

        {/* Máscara amarela com detalhes pretos, no estilo do uniforme do Wolverine */}
        <Path d="M16 50 L30 56 L22 58 Z" fill={COLORS.ink} />
        <Path d="M104 50 L90 56 L98 58 Z" fill={COLORS.ink} />
        <Path
          d="M22 58 Q60 42 98 58 Q94 72 78 70 Q60 62 42 70 Q26 72 22 58 Z"
          fill={COLORS.claw}
          stroke={COLORS.ink}
          strokeWidth={2}
        />

        <Eyes mood={mood} />

        {/* Focinho */}
        <Path d="M53 74 Q60 70 67 74 Q66 80 60 82 Q54 80 53 74 Z" fill={COLORS.ink} />
        <Ellipse cx={57.5} cy={74.5} rx={2} ry={1.2} fill="#FFFFFF" opacity={0.6} />

        <Mouth mood={mood} />
      </Svg>
    </Animated.View>
  );
}

function Eyes({ mood }: { mood: LoganMood }) {
  if (mood === 'excited' || mood === 'proud') {
    // Olhos fechados de felicidade: ^ ^
    return (
      <G stroke={COLORS.ink} strokeWidth={3.5} strokeLinecap="round" fill="none">
        <Path d="M38 62 Q44 54 50 62" />
        <Path d="M70 62 Q76 54 82 62" />
      </G>
    );
  }
  if (mood === 'sleepy') {
    return (
      <G stroke={COLORS.ink} strokeWidth={3} strokeLinecap="round">
        <Path d="M38 61 L50 61" />
        <Path d="M70 61 L82 61" />
      </G>
    );
  }

  const pupilOffset = mood === 'thinking' ? { x: 2, y: -2 } : { x: 0, y: 0 };
  return (
    <G>
      <Ellipse cx={44} cy={60} rx={7} ry={7.5} fill="#FFFFFF" stroke={COLORS.ink} strokeWidth={1.2} />
      <Ellipse cx={76} cy={60} rx={7} ry={7.5} fill="#FFFFFF" stroke={COLORS.ink} strokeWidth={1.2} />
      <Circle cx={45 + pupilOffset.x} cy={61 + pupilOffset.y} r={4.2} fill={COLORS.ink} />
      <Circle cx={77 + pupilOffset.x} cy={61 + pupilOffset.y} r={4.2} fill={COLORS.ink} />
      <Circle cx={46.5 + pupilOffset.x} cy={59 + pupilOffset.y} r={1.4} fill="#FFFFFF" />
      <Circle cx={78.5 + pupilOffset.x} cy={59 + pupilOffset.y} r={1.4} fill="#FFFFFF" />
      {mood === 'hero' && (
        <G stroke={COLORS.ink} strokeWidth={2.5} strokeLinecap="round">
          <Path d="M36 50 L50 53" />
          <Path d="M84 50 L70 53" />
        </G>
      )}
    </G>
  );
}

function Mouth({ mood }: { mood: LoganMood }) {
  if (mood === 'excited' || mood === 'happy') {
    return (
      <G>
        <Path d="M50 85 Q60 98 70 85 Z" fill="#7A2E1F" />
        <Path d="M54 90 Q60 99 66 90 Q60 92 54 90 Z" fill="#FF7A8A" />
      </G>
    );
  }
  if (mood === 'thinking') {
    return <Path d="M54 88 Q60 86 66 89" stroke={COLORS.ink} strokeWidth={2} fill="none" strokeLinecap="round" />;
  }
  return (
    <Path d="M51 85 Q55 90 60 86 Q65 90 69 85" stroke={COLORS.ink} strokeWidth={2} fill="none" strokeLinecap="round" />
  );
}
