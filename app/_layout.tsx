import '../global.css';

import { Oswald_500Medium, Oswald_700Bold, useFonts } from '@expo-google-fonts/oswald';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { AppState, Text, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

import { Logan } from '@/components/Logan';
import { PaywallModal } from '@/components/PaywallModal';
import { COLORS } from '@/constants/theme';
import { useReminderSync } from '@/hooks/useReminderSync';
import { fetchActiveExpert } from '@/services/experts';
import { isSupabaseConfigured } from '@/services/supabase';
import { startAuthListener, startAutoSync } from '@/services/sync';
import { useAppStore } from '@/store/useAppStore';

// Erro ao desenhar uma tela: mostra a tela de erro do router (com "tentar de novo") em vez de fechar o app.
export { ErrorBoundary } from 'expo-router';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({ Oswald_500Medium, Oswald_700Bold });
  const { hasHydrated, hasOnboarded, authReady, authUserId, authSkipped, loginRequested, syncStatus, reconcileStreakOnOpen } = useAppStore(
    useShallow((s) => ({
      hasHydrated: s.hasHydrated,
      hasOnboarded: s.hasOnboarded,
      authReady: s.authReady,
      authUserId: s.authUserId,
      authSkipped: s.authSkipped,
      loginRequested: s.loginRequested,
      syncStatus: s.syncStatus,
      reconcileStreakOnOpen: s.reconcileStreakOnOpen,
    })),
  );

  useEffect(() => {
    if (!hasHydrated) return;
    reconcileStreakOnOpen();
    // Quem assina o Guia do Tutor (sem internet, fica o que já estava salvo).
    void fetchActiveExpert().then((expert) => expert !== undefined && useAppStore.getState().setExpert(expert));
    const stopAuth = startAuthListener();
    const stopSync = startAutoSync();
    // App aberto de um dia para o outro (ou virando a semana): fecha as semanas ao voltar.
    const appState = AppState.addEventListener('change', (next) => next === 'active' && reconcileStreakOnOpen());
    return () => {
      stopAuth();
      stopSync();
      appState.remove();
    };
  }, [hasHydrated, reconcileStreakOnOpen]);

  useReminderSync();

  const needsAccount = isSupabaseConfigured && !authUserId && !authSkipped;
  // Depois de entrar numa conta existente, espera os dados da nuvem antes de decidir a tela.
  const restoringAccount = !!authUserId && !hasOnboarded && syncStatus === 'syncing';

  if (!hasHydrated || !fontsLoaded || !authReady || restoringAccount) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: COLORS.splash }}>
        <Logan size={140} mood="sleepy" />
        <Text className="mt-4 text-lg font-bold" style={{ color: COLORS.claw }}>
          {restoringAccount ? 'Buscando sua jornada…' : 'WOLVERBARK'}
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
        <Stack.Protected guard={hasOnboarded && !needsAccount}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="lesson/[id]" options={{ presentation: 'fullScreenModal', gestureEnabled: false }} />
          <Stack.Screen name="pet-edit" options={{ presentation: 'modal' }} />
          <Stack.Screen name="diary" options={{ presentation: 'modal' }} />
          <Stack.Screen name="guide/[slug]" options={{ presentation: 'modal' }} />
        </Stack.Protected>
        {/* Antes do onboarding, o login só fica disponível sob pedido (o router escolhe a 1ª rota em ordem alfabética). */}
        <Stack.Protected guard={isSupabaseConfigured && !authUserId && (hasOnboarded || loginRequested)}>
          <Stack.Screen name="auth" />
        </Stack.Protected>
      </Stack>
      <PaywallModal />
    </>
  );
}
