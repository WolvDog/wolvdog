import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Mail } from 'lucide-react-native';
import { type ComponentRef, useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Field, TextField } from '@/components/form';
import { HeroButton } from '@/components/HeroButton';
import { LoganSays } from '@/components/LoganSays';
import { COLORS, FONTS } from '@/constants/theme';
import { authErrorMessage, supabase } from '@/services/supabase';
import { getPetGrammar } from '@/services/personalize';
import { useAppStore } from '@/store/useAppStore';

/** Deve bater com "Email OTP Length" em Authentication → Providers → Email no Supabase. */
const CODE_LENGTH = 6;
const RESEND_SECONDS = 60;

type Step = 'email' | 'code';

/**
 * Login sem senha: o tutor informa o e-mail, recebe um código de 6 dígitos e entra.
 * O mesmo fluxo cria a conta na primeira vez.
 */
export default function AuthScreen() {
  const params = useLocalSearchParams<{ mode?: 'signup' | 'login' }>();
  const hasOnboarded = useAppStore((s) => s.hasOnboarded);
  const pet = useAppStore((s) => s.pet);
  const petName = pet?.name;
  const skipAuth = useAppStore((s) => s.skipAuth);
  const requestLogin = useAppStore((s) => s.requestLogin);

  useEffect(() => () => requestLogin(false), [requestLogin]);

  const isSignup = (params.mode ?? (hasOnboarded ? 'signup' : 'login')) === 'signup';

  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendIn, setResendIn] = useState(0);

  const normalizedEmail = email.trim().toLowerCase();
  const validEmail = /^\S+@\S+\.\S+$/.test(normalizedEmail);

  useEffect(() => {
    if (resendIn <= 0) return;
    const id = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [resendIn]);

  async function sendCode() {
    if (!supabase) return;
    setLoading(true);
    setError(null);
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
      options: { shouldCreateUser: true },
    });
    setLoading(false);
    if (otpError) return setError(authErrorMessage(otpError.message));
    setCode('');
    setStep('code');
    setResendIn(RESEND_SECONDS);
  }

  async function verifyCode(token: string) {
    if (!supabase) return;
    setLoading(true);
    setError(null);
    const { error: verifyError } = await supabase.auth.verifyOtp({ email: normalizedEmail, token, type: 'email' });
    setLoading(false);
    if (verifyError) {
      setCode('');
      return setError(authErrorMessage(verifyError.message));
    }
    // Com a sessão criada, o listener de auth sincroniza os dados e as rotas protegidas trocam de tela sozinhas.
  }

  function handleCodeChange(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, CODE_LENGTH);
    setCode(digits);
    if (digits.length === CODE_LENGTH && !loading) void verifyCode(digits);
  }

  const showBack = step === 'code' || router.canGoBack() || !hasOnboarded;
  function goBack() {
    if (step === 'code') {
      setStep('email');
      setError(null);
      return;
    }
    // Antes do onboarding, desligar o pedido de login já devolve o tutor para as boas-vindas.
    if (router.canGoBack()) router.back();
    else requestLogin(false);
  }

  const loganText =
    step === 'code'
      ? `Mandei um código de ${CODE_LENGTH} dígitos para ${normalizedEmail}. Dá uma farejada na caixa de entrada (e no spam)!`
      : isSignup
        ? `Salve a jornada${petName ? ` ${getPetGrammar(pet).do}` : ''} na nuvem. Sem senha pra decorar: é só confirmar um código no seu e-mail.`
        : 'Que bom te ver de novo! Informe seu e-mail e eu te mando um código para entrar.';

  return (
    <SafeAreaView className="flex-1 bg-cloud">
      <View className="flex-row items-center px-4 pb-2 pt-2" style={{ minHeight: 40 }}>
        {showBack && (
          <Pressable onPress={goBack} accessibilityRole="button" accessibilityLabel="Voltar" hitSlop={12}>
            <ArrowLeft size={26} color={COLORS.ink} strokeWidth={2.5} />
          </Pressable>
        )}
      </View>

      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 32 }} keyboardShouldPersistTaps="handled">
          <Text style={{ fontFamily: FONTS.display, fontSize: 30, color: COLORS.ink, marginBottom: 16 }}>
            {step === 'code' ? 'CONFIRA SEU E-MAIL' : isSignup ? 'SALVE SUA JORNADA' : 'ENTRAR'}
          </Text>
          <LoganSays mood={step === 'code' ? 'thinking' : isSignup ? 'hero' : 'happy'} text={loganText} />

          {step === 'email' ? (
            <>
              <Field label="E-mail">
                <TextField
                  value={email}
                  onChangeText={setEmail}
                  placeholder="voce@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  textContentType="emailAddress"
                  returnKeyType="send"
                  onSubmitEditing={() => validEmail && void sendCode()}
                />
              </Field>
              <HeroButton
                className="mt-6"
                label="Receber código"
                disabled={!validEmail}
                loading={loading}
                icon={<Mail size={18} color={validEmail ? COLORS.ink : COLORS.lockedDark} />}
                onPress={sendCode}
              />
            </>
          ) : (
            <>
              <Field label="Código">
                <CodeInput value={code} onChange={handleCodeChange} disabled={loading} />
              </Field>
              <HeroButton
                className="mt-6"
                label="Entrar"
                variant="hero"
                disabled={code.length !== CODE_LENGTH}
                loading={loading}
                onPress={() => verifyCode(code)}
              />
              <Pressable onPress={() => resendIn === 0 && void sendCode()} disabled={resendIn > 0 || loading} className="mt-5 py-1">
                <Text className="text-center text-sm font-bold" style={{ color: resendIn > 0 ? COLORS.lockedDark : COLORS.hero }}>
                  {resendIn > 0 ? `Reenviar código em ${resendIn}s` : 'Reenviar código'}
                </Text>
              </Pressable>
              <Pressable onPress={goBack} className="mt-1 py-1">
                <Text className="text-center text-sm text-ink-400">Usar outro e-mail</Text>
              </Pressable>
            </>
          )}

          {error && (
            <View className="mt-4 rounded-lg border-2 p-3" style={{ borderColor: COLORS.danger, backgroundColor: '#FDECEC' }}>
              <Text className="text-sm font-bold" style={{ color: COLORS.danger }}>
                {error}
              </Text>
            </View>
          )}

          {hasOnboarded && step === 'email' && (
            <Pressable
              onPress={() => {
                skipAuth();
                router.replace('/');
              }}
              className="mt-4 py-1"
            >
              <Text className="text-center text-sm text-ink-400">Continuar sem conta (progresso só neste aparelho)</Text>
            </Pressable>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/** Caixas de dígitos sobre um TextInput invisível (mantém colar e o autopreenchimento do teclado). */
function CodeInput({ value, onChange, disabled }: { value: string; onChange: (v: string) => void; disabled?: boolean }) {
  const inputRef = useRef<ComponentRef<typeof TextInput>>(null);
  const [focused, setFocused] = useState(true);

  return (
    <Pressable onPress={() => inputRef.current?.focus()} accessibilityLabel="Código de verificação">
      <View className="flex-row justify-between">
        {Array.from({ length: CODE_LENGTH }, (_, i) => {
          const char = value[i];
          const active = focused && i === Math.min(value.length, CODE_LENGTH - 1);
          return (
            <View
              key={i}
              className="h-14 items-center justify-center rounded-xl border-2 bg-white"
              style={{
                width: `${100 / CODE_LENGTH - 2}%`,
                borderColor: active ? COLORS.hero : char ? COLORS.ink : '#D5D8DE',
                borderWidth: active ? 2.5 : 2,
              }}
            >
              <Text style={{ fontFamily: FONTS.display, fontSize: 26, color: COLORS.ink }}>{char ?? ''}</Text>
            </View>
          );
        })}
      </View>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChange}
        editable={!disabled}
        autoFocus
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="one-time-code"
        maxLength={CODE_LENGTH}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.01 }}
        caretHidden
      />
    </Pressable>
  );
}
