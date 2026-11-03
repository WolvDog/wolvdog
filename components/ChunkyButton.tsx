import * as Haptics from 'expo-haptics';
import { type ReactNode, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, Text, View } from 'react-native';

type Variant = 'primary' | 'hero' | 'gold' | 'secondary' | 'danger';

interface Palette {
  bg: string;
  shadow: string;
  text: string;
  border?: string;
}

const VARIANTS: Record<Variant, Palette> = {
  primary: { bg: '#58CC02', shadow: '#46A302', text: '#FFFFFF' },
  hero: { bg: '#1E5BD8', shadow: '#0F3480', text: '#FFFFFF' },
  gold: { bg: '#FFC800', shadow: '#E0A800', text: '#5C3D00' },
  secondary: { bg: '#FFFFFF', shadow: '#E5E5E5', text: '#1CB0F6', border: '#E5E5E5' },
  danger: { bg: '#FF4B4B', shadow: '#D33131', text: '#FFFFFF' },
};

const DISABLED: Palette = { bg: '#E5E5E5', shadow: '#CFCFCF', text: '#AFAFAF' };
const DEPTH = 5;

interface ChunkyButtonProps {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  className?: string;
}

/** Botão "3D" no estilo Duolingo: afunda ao pressionar e dá feedback háptico. */
export function ChunkyButton({ label, onPress, variant = 'primary', disabled, loading, icon, className }: ChunkyButtonProps) {
  const [pressed, setPressed] = useState(false);
  const colors = disabled ? DISABLED : VARIANTS[variant];
  const offset = pressed && !disabled ? DEPTH : 0;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled, busy: !!loading }}
      disabled={disabled || loading}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={() => {
        if (Platform.OS !== 'web') void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress?.();
      }}
      className={className}
      style={{ paddingTop: offset }}
    >
      <View style={{ backgroundColor: colors.shadow, borderRadius: 16, paddingBottom: DEPTH - offset }}>
        <View
          className="min-h-[52px] flex-row items-center justify-center rounded-2xl px-5"
          style={{
            backgroundColor: colors.bg,
            borderWidth: colors.border ? 2 : 0,
            borderColor: colors.border,
          }}
        >
          {loading ? (
            <ActivityIndicator color={colors.text} />
          ) : (
            <>
              {icon ? <View className="mr-2">{icon}</View> : null}
              <Text className="text-base font-extrabold uppercase tracking-wider" style={{ color: colors.text }}>
                {label}
              </Text>
            </>
          )}
        </View>
      </View>
    </Pressable>
  );
}
