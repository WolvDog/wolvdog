import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export const HapticStyle = Haptics.ImpactFeedbackStyle;

/** Vibração leve de feedback. Silenciosa onde não houver suporte (web, alguns Androids). */
export function tap(style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light): void {
  if (Platform.OS === 'web') return;
  Haptics.impactAsync(style).catch(() => {});
}
