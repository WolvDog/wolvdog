import { type ReactNode, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { COLORS, FONTS } from '@/constants/theme';
import { tap } from '@/services/haptics';

type Variant = 'primary' | 'hero' | 'secondary' | 'danger';

interface Palette {
  bg: string;
  text: string;
  border: string;
  shadow: string;
}

const VARIANTS: Record<Variant, Palette> = {
  primary: { bg: COLORS.claw, text: COLORS.ink, border: COLORS.ink, shadow: COLORS.ink },
  hero: { bg: COLORS.hero, text: COLORS.white, border: COLORS.ink, shadow: COLORS.ink },
  secondary: { bg: COLORS.white, text: COLORS.ink, border: COLORS.ink, shadow: COLORS.ink },
  danger: { bg: COLORS.danger, text: COLORS.white, border: COLORS.ink, shadow: COLORS.ink },
};

const DISABLED: Palette = { bg: COLORS.locked, text: COLORS.lockedDark, border: COLORS.lockedDark, shadow: 'transparent' };
const OFFSET = 4;

interface HeroButtonProps {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  className?: string;
}

/**
 * Botão no estilo "quadrinho de herói": contorno preto e sombra sólida deslocada.
 * Ao pressionar, o botão "encosta" na sombra.
 */
export function HeroButton({ label, onPress, variant = 'primary', disabled, loading, icon, className }: HeroButtonProps) {
  const [pressed, setPressed] = useState(false);
  const colors = disabled ? DISABLED : VARIANTS[variant];
  const shift = pressed && !disabled ? OFFSET : 0;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled, busy: !!loading }}
      disabled={disabled || loading}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={() => {
        tap();
        onPress?.();
      }}
      className={className}
      style={{ paddingRight: OFFSET, paddingBottom: OFFSET }}
    >
      <View
        style={{
          position: 'absolute',
          top: OFFSET,
          left: OFFSET,
          right: 0,
          bottom: 0,
          borderRadius: 12,
          backgroundColor: colors.shadow,
        }}
      />
      <View
        className="min-h-[52px] flex-row items-center justify-center rounded-xl px-5"
        style={{
          backgroundColor: colors.bg,
          borderWidth: 2.5,
          borderColor: colors.border,
          transform: [{ translateX: shift }, { translateY: shift }],
        }}
      >
        {loading ? (
          <ActivityIndicator color={colors.text} />
        ) : (
          <>
            {icon ? <View className="mr-2">{icon}</View> : null}
            <Text style={{ color: colors.text, fontFamily: FONTS.display, fontSize: 17, letterSpacing: 1.2 }}>
              {label.toUpperCase()}
            </Text>
          </>
        )}
      </View>
    </Pressable>
  );
}
