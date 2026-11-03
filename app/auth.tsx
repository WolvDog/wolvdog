import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Cloud } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Field, TextField } from '@/components/form';
import { HeroButton } from '@/components/HeroButton';
import { LoganSays } from '@/components/LoganSays';
import { COLORS, FONTS } from '@/constants/theme';
import { authErrorMessage, supabase } from '@/services/supabase';
import { useAppStore } from '@/store/useAppStore';

type Mode = 'signup' | 'login';

export default function AuthScreen() {
  const params = useLocalSearchParams<{ mode?: Mode }>();
  const hasOnboarded = useAppStore((s) => s.hasOnboarded);
  const petName = useAppStore((s) => s.pet?.name);
  const skipAuth = useAppStore((s) => s.skipAuth);
  const requestLogin = useAppStore((s) => s.requestLogin);

  useEffect(() => () => requestLogin(false), [requestLogin]);

  const [mode, setMode] = useState<Mode>(params.mode ?? (hasOnboarded ? 'signup' : 'login'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const validEmail = /^\S+@\S+\.\S+$/.test(email.trim());
  const canSubmit = validEmail && password.length >= 6;

  async function submit() {
    if (!supabase) return;
    setLoading(true);
    setError(null);
    setInfo(null);
    const credentials = { email: email.trim().toLowerCase(), password };
    const { data, error: authError } =
      mode === 'signup' ? await supabase.auth.signUp(credentials) : await supabase.auth.signInWithPassword(credentials);
    setLoading(false);

    if (authError) return setError(authErrorMessage(authError.message));
    // Projetos com confirmação de e-mail ativa não devolvem sessão no cadastro.
    if (mode === 'signup' && !data.session) {
      setMode('login');
      setInfo(`Enviamos um link de confirmação para ${credentials.email}. Confirme e depois entre aqui.`);
    }
    // Com sessão, o listener de auth sincroniza os dados e as rotas protegidas trocam de tela sozinhas.
  }

  const loganText =
    mode === 'signup'
      ? `Crie sua conta para guardar a jornada${petName ? ` de ${petName}` : ''} na nuvem. Troca de celular? Nada se perde!`
      : 'Que bom te ver de novo! Entre para recuperar sua jornada.';

  return (
    <SafeAreaView className="flex-1 bg-cloud">
      <View className="flex-row items-center px-4 pb-2 pt-2" style={{ minHeight: 40 }}>
        {(router.canGoBack() || !hasOnboarded) && (
          <Pressable
            // Antes do onboarding, desligar o pedido de login já devolve o tutor para as boas-vindas.
            onPress={() => (router.canGoBack() ? router.back() : requestLogin(false))}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            hitSlop={12}
          >
            <ArrowLeft size={26} color={COLORS.ink} strokeWidth={2.5} />
          </Pressable>
        )}
      </View>

      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 32 }} keyboardShouldPersistTaps="handled">
          <Text style={{ fontFamily: FONTS.display, fontSize: 30, color: COLORS.ink, marginBottom: 16 }}>
            {mode === 'signup' ? 'SALVE SUA JORNADA' : 'ENTRAR'}
          </Text>
          <LoganSays mood={mode === 'signup' ? 'hero' : 'happy'} text={loganText} />

          <Field label="E-mail">
            <TextField
              value={email}
              onChangeText={setEmail}
              placeholder="voce@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
            />
          </Field>
          <Field label="Senha" hint={mode === 'signup' ? 'Mínimo de 6 caracteres.' : undefined}>
            <TextField
              value={password}
              onChangeText={setPassword}
              placeholder="••••••"
              secureTextEntry
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              textContentType={mode === 'signup' ? 'newPassword' : 'password'}
              onSubmitEditing={() => canSubmit && void submit()}
            />
          </Field>

          {error && (
            <View className="mt-4 rounded-lg border-2 p-3" style={{ borderColor: COLORS.danger, backgroundColor: '#FDECEC' }}>
              <Text className="text-sm font-bold" style={{ color: COLORS.danger }}>
                {error}
              </Text>
            </View>
          )}
          {info && (
            <View className="mt-4 rounded-lg border-2 border-hero-500 bg-hero-50 p-3">
              <Text className="text-sm text-hero-500">{info}</Text>
            </View>
          )}

          <HeroButton
            className="mt-6"
            label={mode === 'signup' ? 'Criar conta' : 'Entrar'}
            variant={mode === 'signup' ? 'primary' : 'hero'}
            disabled={!canSubmit}
            loading={loading}
            icon={mode === 'signup' ? <Cloud size={18} color={canSubmit ? COLORS.ink : COLORS.lockedDark} /> : undefined}
            onPress={submit}
          />

          <Pressable
            onPress={() => {
              setMode(mode === 'signup' ? 'login' : 'signup');
              setError(null);
              setInfo(null);
            }}
            className="mt-5 py-1"
          >
            <Text className="text-center text-sm font-bold text-hero-500">
              {mode === 'signup' ? 'Já tenho conta — entrar' : 'Ainda não tenho conta — criar'}
            </Text>
          </Pressable>

          {hasOnboarded && (
            <Pressable
              onPress={() => {
                skipAuth();
                router.replace('/');
              }}
              className="mt-2 py-1"
            >
              <Text className="text-center text-sm text-ink-400">Continuar sem conta (progresso só neste aparelho)</Text>
            </Pressable>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
