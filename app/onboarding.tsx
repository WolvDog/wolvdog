import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { ArrowLeft, Camera } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Chip, Field, OptionCard, TextField } from '@/components/form';
import { HeroButton } from '@/components/HeroButton';
import { Logan } from '@/components/Logan';
import { LoganSays } from '@/components/LoganSays';
import { SegmentedProgress } from '@/components/ProgressBar';
import { TERMS } from '@/constants/brand';
import {
  BREED_SUGGESTIONS,
  CHALLENGE_FOCUS_PHASE,
  CHALLENGE_LABELS,
  formatAge,
  formatWeight,
  PET_SIZE_DETAILS,
  PET_SIZE_LABELS,
  sizeFromWeight,
} from '@/constants/labels';
import { WEEKLY_GOAL_OPTIONS } from '@/constants/gamification';
import { COLORS, FONTS } from '@/constants/theme';
import { findPartner } from '@/constants/partners';
import { MODULES } from '@/data/mockData';
import { formatTime, REMINDER_TIMES, remindersSupported, requestReminderPermission } from '@/services/notifications';
import { isSupabaseConfigured } from '@/services/supabase';
import { useAppStore } from '@/store/useAppStore';
import type { BehaviorChallenge, PetSize, User, WeeklyGoalDays } from '@/types';

const STEPS = ['welcome', 'tutor', 'petName', 'breed', 'size', 'age', 'focus', 'goal', 'reminder', 'plan'] as const;
type Step = (typeof STEPS)[number];

const SIZES = Object.keys(PET_SIZE_LABELS) as PetSize[];
const CHALLENGES = Object.keys(CHALLENGE_LABELS) as BehaviorChallenge[];
const GOALS: { minutes: User['dailyGoalMinutes']; emoji: string }[] = [
  { minutes: 5, emoji: '🐾' },
  { minutes: 10, emoji: '⚡' },
  { minutes: 15, emoji: '🔥' },
];

export default function OnboardingScreen() {
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const requestLogin = useAppStore((s) => s.requestLogin);

  const [stepIndex, setStepIndex] = useState(0);
  const [tutorName, setTutorName] = useState('');
  const [petName, setPetName] = useState('');
  const [photoUri, setPhotoUri] = useState<string>();
  const [breed, setBreed] = useState('');
  const [weight, setWeight] = useState('');
  const [size, setSize] = useState<PetSize | null>(null);
  const [sizeTouched, setSizeTouched] = useState(false);
  const [years, setYears] = useState('');
  const [months, setMonths] = useState('');
  const [challenges, setChallenges] = useState<BehaviorChallenge[]>([]);
  const [goal, setGoal] = useState<User['dailyGoalMinutes']>(10);
  const [weeklyDays, setWeeklyDays] = useState<WeeklyGoalDays>(4);
  const [partnerInput, setPartnerInput] = useState('');
  const partner = findPartner(partnerInput);
  const [reminderTime, setReminderTime] = useState<{ hour: number; minute: number } | null>(REMINDER_TIMES[3]);
  const [askingPermission, setAskingPermission] = useState(false);

  const step: Step = STEPS[stepIndex]!;
  const dog = petName.trim() || 'seu cão';
  const tutor = tutorName.trim();
  const weightKg = parseFloat(weight.replace(',', '.'));
  const ageMonths = (parseInt(years, 10) || 0) * 12 + (parseInt(months, 10) || 0);

  const canContinue: Record<Step, boolean> = {
    welcome: true,
    tutor: tutor.length > 0,
    petName: petName.trim().length > 0,
    breed: breed.trim().length > 0,
    size: size !== null,
    age: ageMonths > 0,
    focus: true,
    goal: true,
    reminder: true,
    plan: true,
  };

  const focusPhases = useMemo(() => {
    const phases = new Set(challenges.map((c) => CHALLENGE_FOCUS_PHASE[c]));
    return MODULES.filter((m) => phases.has(m.phase));
  }, [challenges]);

  function handleWeight(text: string) {
    setWeight(text);
    const kg = parseFloat(text.replace(',', '.'));
    // Sugere o porte pelo peso até o tutor escolher manualmente.
    if (!sizeTouched && kg > 0) setSize(sizeFromWeight(kg));
  }

  async function pickPhoto() {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.7 });
    if (!res.canceled && res.assets[0]) setPhotoUri(res.assets[0].uri);
  }

  function next() {
    if (step === 'plan') {
      completeOnboarding({
        tutorName: tutor,
        dailyGoalMinutes: goal,
        weeklyGoalDays: weeklyDays,
        partnerCode: partner?.code ?? null,
        reminder: reminderTime
          ? { enabled: true, hour: reminderTime.hour, minute: reminderTime.minute }
          : { enabled: false, hour: 19, minute: 0 },
        pet: {
          name: petName.trim(),
          breed: breed.trim(),
          ageMonths,
          size: size ?? 'medio',
          weightKg: weightKg > 0 ? weightKg : undefined,
          challenges,
          photoUri,
        },
      });
      return;
    }
    if (step === 'reminder' && reminderTime && remindersSupported) {
      // Pede a permissão no momento em que o tutor escolhe o horário (contexto claro = mais aceite).
      setAskingPermission(true);
      void requestReminderPermission().then((granted) => {
        setAskingPermission(false);
        if (!granted) setReminderTime(null);
        setStepIndex((i) => i + 1);
      });
      return;
    }
    setStepIndex((i) => i + 1);
  }

  if (step === 'welcome') {
    return (
      <SafeAreaView className="flex-1 bg-hero-500">
        <View className="flex-1 items-center justify-center px-8">
          <Logan size={190} mood="hero" />
          <Text style={{ fontFamily: FONTS.display, fontSize: 40, color: COLORS.claw, marginTop: 16 }}>WOLVERBARK</Text>
          <Text className="mt-2 text-center text-base leading-6 text-white/90">
            Au! Eu sou o Logan. Em poucos minutos por dia, vou te ajudar a transformar seu cão em um parceiro de respeito.
          </Text>
        </View>
        <View className="px-6 pb-6">
          <HeroButton label="Vamos começar" onPress={next} />
          <Text className="mt-3 text-center text-xs text-white/70">Leva menos de 1 minuto para montar o plano.</Text>
          {isSupabaseConfigured && (
            <Pressable
              onPress={() => {
                requestLogin(true);
                // Espera o layout liberar a rota protegida antes de navegar.
                setTimeout(() => router.push({ pathname: '/auth', params: { mode: 'login' } }), 0);
              }}
              className="mt-3 py-1"
            >
              <Text className="text-center text-sm font-bold" style={{ color: COLORS.claw }}>
                Já tenho conta — entrar
              </Text>
            </Pressable>
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-cloud">
      <View className="flex-row items-center px-4 pb-2 pt-2">
        <Pressable
          onPress={() => setStepIndex((i) => Math.max(0, i - 1))}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          hitSlop={12}
          className="mr-3"
        >
          <ArrowLeft size={26} color={COLORS.ink} strokeWidth={2.5} />
        </Pressable>
        <View className="flex-1">
          <SegmentedProgress total={STEPS.length - 1} current={stepIndex - 1} />
        </View>
      </View>

      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 32 }} keyboardShouldPersistTaps="handled">
          {step === 'tutor' && (
            <>
              <LoganSays mood="happy" text="Antes de tudo: como posso te chamar, parceiro?" />
              <Field label="Seu nome">
                <TextField value={tutorName} onChangeText={setTutorName} placeholder="Ex.: Marcos" autoFocus autoCapitalize="words" />
              </Field>
            </>
          )}

          {step === 'petName' && (
            <>
              <LoganSays mood="excited" text={`Prazer, ${tutor}! E qual o nome do seu cão?`} />
              <Field label="Nome do cão">
                <TextField value={petName} onChangeText={setPetName} placeholder="Ex.: Thor" autoFocus autoCapitalize="words" />
              </Field>
              <Pressable onPress={pickPhoto} className="mt-6 items-center" accessibilityRole="button" accessibilityLabel="Adicionar foto do cão">
                <View className="h-28 w-28 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-ink-900 bg-white">
                  {photoUri ? <Image source={{ uri: photoUri }} className="h-full w-full" /> : <Camera size={30} color={COLORS.ink} />}
                </View>
                <Text className="mt-2 text-sm font-bold text-hero-500">{photoUri ? 'Trocar foto' : 'Adicionar foto (opcional)'}</Text>
              </Pressable>
            </>
          )}

          {step === 'breed' && (
            <>
              <LoganSays mood="thinking" text={`Qual a raça de ${dog}? Cada raça tem seu jeitinho de aprender.`} />
              <Field label="Raça">
                <TextField value={breed} onChangeText={setBreed} placeholder="Digite ou escolha abaixo" />
              </Field>
              <View className="mt-3 flex-row flex-wrap gap-2">
                {BREED_SUGGESTIONS.map((b) => (
                  <Chip key={b} label={b} active={breed === b} onPress={() => setBreed(b)} />
                ))}
              </View>
            </>
          )}

          {step === 'size' && (
            <>
              <LoganSays mood="happy" text={`Quanto ${dog} pesa? Se não souber exato, escolha o porte mesmo.`} />
              <Field label="Peso (opcional)">
                <TextField value={weight} onChangeText={handleWeight} placeholder="Ex.: 12,5" keyboardType="decimal-pad" suffix="kg" />
              </Field>
              <Field label="Porte">
                {SIZES.map((s) => (
                  <OptionCard
                    key={s}
                    title={PET_SIZE_LABELS[s]}
                    subtitle={PET_SIZE_DETAILS[s].range}
                    emoji={PET_SIZE_DETAILS[s].emoji}
                    active={size === s}
                    onPress={() => {
                      setSize(s);
                      setSizeTouched(true);
                    }}
                  />
                ))}
              </Field>
            </>
          )}

          {step === 'age' && (
            <>
              <LoganSays mood="thinking" text={`E quantos anos ${dog} tem? Filhotes e adultos treinam um pouco diferente.`} />
              <Field label="Idade">
                <View className="flex-row gap-3">
                  <View className="flex-1">
                    <TextField value={years} onChangeText={setYears} placeholder="0" keyboardType="number-pad" suffix="anos" />
                  </View>
                  <View className="flex-1">
                    <TextField value={months} onChangeText={setMonths} placeholder="0" keyboardType="number-pad" suffix="meses" />
                  </View>
                </View>
              </Field>
              {ageMonths > 0 && ageMonths < 4 && (
                <View className="mt-4 rounded-xl border-2 border-ink-900 bg-claw-100 p-3">
                  <Text className="text-sm text-ink-900">
                    🍼 Filhote com menos de 4 meses: sessões de no máximo 3 minutos e muita paciência!
                  </Text>
                </View>
              )}
            </>
          )}

          {step === 'focus' && (
            <>
              <LoganSays mood="hero" text={`Agora o mais importante: o que ${dog} precisa melhorar? Pode marcar vários.`} />
              <Field label="Foco do treinamento" hint="Isso define por onde começa o plano.">
                {CHALLENGES.map((c) => (
                  <OptionCard
                    key={c}
                    role="checkbox"
                    title={CHALLENGE_LABELS[c].label}
                    emoji={CHALLENGE_LABELS[c].emoji}
                    active={challenges.includes(c)}
                    onPress={() => setChallenges((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]))}
                  />
                ))}
              </Field>
            </>
          )}

          {step === 'goal' && (
            <>
              <LoganSays
                mood="excited"
                text="Quantos dias por semana vocês vão treinar? Não precisa ser todo dia: constância vale mais que intensidade!"
              />
              <Field label="Treinos por semana" hint="Sua sequência conta as semanas em que você bate essa meta.">
                {WEEKLY_GOAL_OPTIONS.map((o) => (
                  <OptionCard
                    key={o.days}
                    title={o.title}
                    subtitle={o.subtitle}
                    active={weeklyDays === o.days}
                    onPress={() => setWeeklyDays(o.days)}
                  />
                ))}
              </Field>
              <Field label="Duração de cada treino">
                <View className="flex-row gap-2">
                  {GOALS.map((g) => (
                    <Chip key={g.minutes} label={`${g.emoji} ${g.minutes} min`} active={goal === g.minutes} onPress={() => setGoal(g.minutes)} />
                  ))}
                </View>
              </Field>
            </>
          )}

          {step === 'reminder' && (
            <>
              <LoganSays
                mood="happy"
                text={`Posso te lembrar todo dia da missão de ${dog}? Prometo não encher o saco: se você já treinou, eu fico quietinho.`}
              />
              <Field label="Horário do lembrete">
                {REMINDER_TIMES.map((t) => (
                  <OptionCard
                    key={t.label}
                    title={`${t.label} · ${formatTime(t.hour, t.minute)}`}
                    emoji={t.emoji}
                    active={reminderTime?.hour === t.hour && reminderTime.minute === t.minute}
                    onPress={() => setReminderTime({ hour: t.hour, minute: t.minute })}
                  />
                ))}
                <OptionCard title="Sem lembretes" emoji="🔕" active={reminderTime === null} onPress={() => setReminderTime(null)} />
              </Field>
              {!remindersSupported && (
                <Text className="mt-2 text-xs text-ink-400">Os lembretes funcionam no app do celular.</Text>
              )}
            </>
          )}

          {step === 'plan' && (
            <>
              <LoganSays layout="top" size={110} mood="proud" text={`Plano pronto, ${tutor}! Eu e ${dog} vamos formar uma dupla imbatível.`} />

              <View className="mt-6 overflow-hidden rounded-xl border-2 border-ink-900 bg-white">
                <View className="flex-row items-center bg-ink-900 px-4 py-3">
                  {photoUri ? (
                    <Image source={{ uri: photoUri }} className="h-12 w-12 rounded-lg" />
                  ) : (
                    <View className="h-12 w-12 items-center justify-center rounded-lg bg-claw-500">
                      <Text className="text-2xl">🐶</Text>
                    </View>
                  )}
                  <View className="ml-3 flex-1">
                    <Text style={{ fontFamily: FONTS.display, fontSize: 22, color: COLORS.white }}>{petName.trim()}</Text>
                    <Text className="text-xs text-white/70">
                      {breed.trim()} · {formatAge(ageMonths)} · {PET_SIZE_LABELS[size ?? 'medio']}
                      {weightKg > 0 ? ` · ${formatWeight(weightKg)}` : ''}
                    </Text>
                  </View>
                </View>
                <View className="p-4">
                  <SummaryRow label="Meta" value={`${weeklyDays === 7 ? 'Todo dia' : `${weeklyDays}x por semana`} · ${goal} min`} />
                  <SummaryRow
                    label="Lembrete do Logan"
                    value={reminderTime ? formatTime(reminderTime.hour, reminderTime.minute) : 'Desligado'}
                  />
                  <SummaryRow label="Primeira missão" value="O marcador mágico" />
                  <Text className="mb-2 mt-3 text-xs font-bold uppercase text-ink-400">Fases prioritárias</Text>
                  {focusPhases.length === 0 ? (
                    <Text className="text-sm text-ink-600">Começaremos pela base: Fase 1 — Boas Maneiras.</Text>
                  ) : (
                    focusPhases.map((m) => (
                      <View key={m.id} className="mb-1.5 flex-row items-center">
                        <View className="mr-2 h-3 w-3 rounded-sm border border-ink-900" style={{ backgroundColor: m.color }} />
                        <Text className="flex-1 text-sm text-ink-900">
                          Fase {m.phase} — {m.title}
                        </Text>
                      </View>
                    ))
                  )}
                </View>
              </View>
              <Field label="Código de parceiro (opcional)" hint="Veio por indicação de uma creche, hotel ou adestrador?">
                <TextField
                  value={partnerInput}
                  onChangeText={setPartnerInput}
                  placeholder="Ex.: GARRIDOSP"
                  autoCapitalize="characters"
                  autoCorrect={false}
                />
              </Field>
              {partner ? (
                <View className="mt-2 rounded-lg border-2 border-ink-900 bg-claw-100 p-3">
                  <Text className="text-sm font-bold text-ink-900">🎁 {partner.name}</Text>
                  <Text className="text-xs text-ink-600">Benefício no Pro: {partner.perk}</Text>
                </View>
              ) : partnerInput.trim().length >= 4 ? (
                <Text className="mt-2 text-xs" style={{ color: COLORS.danger }}>
                  Código não encontrado. Confira com quem te indicou.
                </Text>
              ) : null}

              <Text className="mt-3 text-center text-xs text-ink-400">
                Cada {TERMS.lesson.toLowerCase()} cumprida rende {TERMS.points.toLowerCase()} e mantém sua {TERMS.streak.toLowerCase()}.
              </Text>
            </>
          )}
        </ScrollView>

        <View className="border-t-2 border-ink-900 bg-white px-5 pb-4 pt-4">
          <HeroButton
            label={step === 'plan' ? 'Começar a jornada' : step === 'focus' && challenges.length === 0 ? 'Pular por enquanto' : 'Continuar'}
            variant={step === 'plan' ? 'hero' : 'primary'}
            disabled={!canContinue[step]}
            loading={askingPermission}
            onPress={next}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between border-b border-gray-100 py-2">
      <Text className="text-sm text-ink-600">{label}</Text>
      <Text className="text-sm font-bold text-ink-900">{value}</Text>
    </View>
  );
}
