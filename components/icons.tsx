import Svg, { Path, Polygon } from 'react-native-svg';

import { COLORS } from '@/constants/theme';

interface IconProps {
  size?: number;
  color?: string;
}

/** Três marcas de garra — ícone das "Garras" (pontos de experiência). */
export function ClawMarks({ size = 20, color = COLORS.claw }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M5 3 Q8 11 5.5 21 L4 20.5 Q5.8 11 3.5 3.6 Z" fill={color} stroke={COLORS.ink} strokeWidth={0.9} strokeLinejoin="round" />
      <Path d="M11.2 2 Q14.4 11 11.6 22 L9.9 21.6 Q12 11 9.6 2.4 Z" fill={color} stroke={COLORS.ink} strokeWidth={0.9} strokeLinejoin="round" />
      <Path d="M17.4 3 Q20.6 11 18 21 L16.4 20.5 Q18.4 11 15.9 3.6 Z" fill={color} stroke={COLORS.ink} strokeWidth={0.9} strokeLinejoin="round" />
    </Svg>
  );
}

/** Hexágono "de pé" usado como medalha das missões. */
export function Hexagon({ size, fill, stroke, strokeWidth = 3 }: { size: number; fill: string; stroke: string; strokeWidth?: number }) {
  const h = size;
  const w = size * 0.9;
  const s = strokeWidth / 2;
  const points = [
    [w / 2, s],
    [w - s, h * 0.25],
    [w - s, h * 0.75],
    [w / 2, h - s],
    [s, h * 0.75],
    [s, h * 0.25],
  ]
    .map((p) => p.join(','))
    .join(' ');
  return (
    <Svg width={w} height={h}>
      <Polygon points={points} fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
    </Svg>
  );
}
