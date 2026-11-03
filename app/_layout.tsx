import '../global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Text, View } from 'react-native';

import { Logan } from '@/components/Logan';
import { PaywallModal } from '@/components/PaywallModal';
import { useAppStore } from '@/store/useAppStore';

export default function RootLayout() {
  const hasHydrated = useAppStore((s) => s.hasHydrated);
  const reconcileStreakOnOpen = useAppStore((s) => s.reconcileStreakOnOpen);

  useEffect(() => {
    if (hasHydrated) reconcileStreakOnOpen();
  }, [hasHydrated, reconcileStreakOnOpen]);

  if (!hasHydrated) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Logan size={140} mood="sleepy" />
        <Text className="mt-4 text-lg font-extrabold text-akita-600">WolverBark</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#FFFFFF' } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="lesson/[id]" options={{ presentation: 'fullScreenModal', gestureEnabled: false }} />
        <Stack.Screen name="pet-edit" options={{ presentation: 'modal' }} />
      </Stack>
      <PaywallModal />
    </>
  );
}
