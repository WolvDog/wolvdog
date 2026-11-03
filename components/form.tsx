import { type ComponentProps, type ReactNode, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { COLORS, FONTS } from '@/constants/theme';

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <View className="mt-5">
      <Text style={{ fontFamily: FONTS.displayMedium, fontSize: 13, letterSpacing: 1.2, color: COLORS.inkSoft }}>
        {label.toUpperCase()}
      </Text>
      {hint ? <Text className="mb-2 mt-0.5 text-xs text-ink-400">{hint}</Text> : <View className="h-2" />}
      {children}
    </View>
  );
}

export function TextField({ suffix, onFocus, onBlur, ...props }: ComponentProps<typeof TextInput> & { suffix?: string }) {
  const [focused, setFocused] = useState(false);
  return (
    <View
      className="flex-row items-center rounded-xl border-2 bg-white px-4"
      style={{ borderColor: focused ? COLORS.hero : '#D5D8DE' }}
    >
      <TextInput
        className="flex-1 py-3.5 text-base text-ink-900"
        // Remove o contorno de foco do navegador; a borda do campo já indica o foco.
        style={{ outlineWidth: 0 }}
        placeholderTextColor={COLORS.lockedDark}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...props}
      />
      {suffix && <Text className="ml-2 font-bold text-ink-400">{suffix}</Text>}
    </View>
  );
}

export function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: active }}
      className="rounded-lg border-2 px-3 py-2"
      style={{ borderColor: active ? COLORS.ink : '#D5D8DE', backgroundColor: active ? COLORS.claw : COLORS.white }}
    >
      <Text className="text-sm font-bold" style={{ color: active ? COLORS.ink : COLORS.inkSoft }}>
        {label}
      </Text>
    </Pressable>
  );
}

/** Cartão de opção grande, para escolhas únicas com destaque. */
export function OptionCard({
  title,
  subtitle,
  emoji,
  active,
  onPress,
  role = 'radio',
}: {
  title: string;
  subtitle?: string;
  emoji?: string;
  active: boolean;
  onPress: () => void;
  role?: 'radio' | 'checkbox';
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={role}
      accessibilityState={role === 'radio' ? { selected: active } : { checked: active }}
      className="mb-2.5 flex-row items-center rounded-xl border-2 px-4 py-3.5"
      style={{
        borderColor: active ? COLORS.ink : '#D5D8DE',
        backgroundColor: active ? COLORS.heroLight : COLORS.white,
        borderWidth: active ? 2.5 : 2,
      }}
    >
      {emoji ? <Text className="mr-3 text-2xl">{emoji}</Text> : null}
      <View className="flex-1">
        <Text className="text-base font-bold" style={{ color: active ? COLORS.hero : COLORS.ink }}>
          {title}
        </Text>
        {subtitle ? <Text className="text-xs text-ink-400">{subtitle}</Text> : null}
      </View>
      <View
        className="h-6 w-6 items-center justify-center rounded-md border-2"
        style={{ borderColor: COLORS.ink, backgroundColor: active ? COLORS.claw : COLORS.white }}
      >
        {active && <Text className="text-xs font-bold text-ink-900">✓</Text>}
      </View>
    </Pressable>
  );
}
