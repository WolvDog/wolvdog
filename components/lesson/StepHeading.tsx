import { Text, View } from 'react-native';

import { COLORS, FONTS } from '@/constants/theme';

/** Rótulo + título de cada etapa da missão. */
export function StepHeading({ kicker, title, color }: { kicker: string; title: string; color: string }) {
  return (
    <View className="mb-5">
      <View className="mb-1.5 flex-row items-center">
        <View className="mr-2 h-3 w-3 rotate-45" style={{ backgroundColor: color }} />
        <Text style={{ fontFamily: FONTS.displayMedium, fontSize: 13, letterSpacing: 1.5, color }}>{kicker.toUpperCase()}</Text>
      </View>
      <Text style={{ fontFamily: FONTS.display, fontSize: 28, lineHeight: 34, color: COLORS.ink }}>{title}</Text>
    </View>
  );
}
