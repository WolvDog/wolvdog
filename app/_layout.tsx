import '../global.css';

import { Oswald_500Medium, Oswald_700Bold, useFonts } from '@expo-google-fonts/oswald';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Text, View } from 'react-native';

import { Logan } from '@/components/Logan';
import { PaywallModal } from '@/components/PaywallModal';
import { COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({ Oswald_500Medium, Oswald_700Bold });
  const hasHydrated = useAppStore((s) => s.hasHydrated);
  const hasOnboarded = useAppStore((s) => s.hasOnboarded);
  const reconcileStreakOnOpen = useAppStore((s) => s.reconcileStreakOnOpen);

  useEffect(() => {
    if (hasHydrated) reconcileStreakOnOpen();
  }, [hasHydrated, reconcileStreakOnOpen]);

  if (!hasHydrated || !fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-hero-500">
        <Logan size={140} mood="sleepy" />
        <Text className="mt-4 text-lg font-bold" style={{ color: COLORS.claw }}>
          WOLVERBARK
        </Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#FFFFFF' } }}>
        <Stack.Protected guard={!hasOnboarded}>
          <Stack.Screen name="onboarding" />
        </Stack.Protected>
        <Stack.Protected guard={hasOnboarded}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="lesson/[id]" options={{ presentation: 'fullScreenModal', gestureEnabled: false }} />
          <Stack.Screen name="pet-edit" options={{ presentation: 'modal' }} />
        </Stack.Protected>
      </Stack>
      <PaywallModal />
    </>
  );
}
