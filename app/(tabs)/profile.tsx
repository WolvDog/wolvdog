import { router } from 'expo-router';
import { Bone, Crown, PawPrint, Pencil, Plus, Trophy } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/react/shallow';

import { AccountSettings } from '@/components/AccountSettings';
import { BehaviorChart } from '@/components/BehaviorChart';
import { HeroButton } from '@/components/HeroButton';
import { ClawMarks } from '@/components/icons';
import { Logan } from '@/components/Logan';
import { ProgressBar } from '@/components/ProgressBar';
import { CHALLENGE_LABELS, DIFFICULTY_LABELS, formatAge, formatWeight, PET_SIZE_LABELS } from '@/constants/labels';
import { points, TERMS } from '@/constants/brand';
import { COLORS, FONTS } from '@/constants/theme';
import { getLessonById } from '@/data/mockData';
import { useProgression } from '@/hooks/useProgression';
import { useWeekStatus } from '@/hooks/useWeekStatus';
import { showAlert, showConfirm } from '@/services/dialog';
import { addDays, toDateKey } from '@/services/gamification';
import { useAppStore } from '@/store/useAppStore';
import type { XpEvent } from '@/types';

const SECTION_TITLE = { fontFamily: FONTS.display, fontSize: 20, color: COLORS.ink } as const;

const WEEKDAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

export default function ProfileScreen() {
  const { modules, snapshot, level, totalXp, completedCount, totalLessons } = useProgression();
  const { behaviorLog, tutorName, pet, streak, isPro, xpHistory, completedLessons, openPaywall, setPro, resetProgress, restartOnboarding } =
    useAppStore(
    useShallow((s) => ({
      behaviorLog: s.behaviorLog,
      tutorName: s.user.name,
      pet: s.pet,
      streak: s.streak,
      isPro: s.isPro,
      xpHistory: s.progress.xpHistory,
      completedLessons: s.progress.completedLessons,
      openPaywall: s.openPaywall,
      setPro: s.setPro,
      resetProgress: s.resetProgress,
      restartOnboarding: s.restartOnboarding,
    })),
  );

  const week = useWeekStatus();
  const history = Object.values(completedLessons).sort((a, b) => b.completedAt.localeCompare(a.completedAt));

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-cloud">
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 48 }}>
        {/* Cabeçalho do pet */}
        <View className="items-center rounded-xl border-2 border-ink-900 bg-white p-5">
          <Pressable
            onPress={() => router.push('/pet-edit')}
            className="absolute right-4 top-4 rounded-lg border-2 border-ink-900 bg-claw-500 p-1.5"
            accessibilityRole="button"
            accessibilityLabel="Editar perfil do pet"
          >
            <Pencil size={18} color={COLORS.ink} />
          </Pressable>

          <View className="h-28 w-28 items-center justify-center overflow-hidden rounded-2xl border-[3px] border-ink-900 bg-claw-100">
            {pet?.photoUri ? (
              <Image source={{ uri: pet.photoUri }} className="h-full w-full" />
            ) : (
              <Text style={{ fontSize: 56 }}>🐕</Text>
            )}
          </View>

          {pet ? (
            <>
              <Text className="mt-3" style={{ fontFamily: FONTS.display, fontSize: 28, color: COLORS.ink }}>
                {pet.name}
              </Text>
              <Text className="mt-0.5 text-sm text-ink-600">
                {pet.breed} · {formatAge(pet.ageMonths)} · Porte {PET_SIZE_LABELS[pet.size].toLowerCase()}
                {pet.weightKg ? ` · ${formatWeight(pet.weightKg)}` : ''}
              </Text>
              {tutorName ? <Text className="mt-0.5 text-xs text-ink-400">Tutor: {tutorName}</Text> : null}
              {pet.challenges.length > 0 && (
                <View className="mt-3 flex-row flex-wrap justify-center gap-2">
                  {pet.challenges.map((c) => (
                    <View key={c} className="rounded-md border border-hero-500 bg-hero-50 px-2.5 py-1">
                      <Text className="text-xs font-bold text-hero-500">
                        {CHALLENGE_LABELS[c].emoji} {CHALLENGE_LABELS[c].label}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </>
          ) : (
            <HeroButton className="mt-4 w-full" label="Cadastrar meu pet" onPress={() => router.push('/pet-edit')} />
          )}
        </View>

        {/* Nível de aprendizado */}
        <View className="mt-4 rounded-xl border-2 border-ink-900 bg-white p-5">
          <View className="flex-row items-center">
            <View className="h-14 w-14 items-center justify-center rounded-xl border-2 border-ink-900 bg-hero-500">
              <Text style={{ fontFamily: FONTS.display, fontSize: 26, color: COLORS.claw }}>{level.level}</Text>
            </View>
            <View className="ml-3 flex-1">
              <Text className="text-xs font-bold uppercase text-ink-400">
                {TERMS.level} de {pet?.name ?? 'seu cão'}
              </Text>
              <Text style={SECTION_TITLE}>{level.title}</Text>
            </View>
          </View>
          <View className="mt-4">
            <ProgressBar progress={level.progress} color={COLORS.hero} height={14} />
            <Text className="mt-1.5 text-right text-xs font-bold text-ink-400">
              {level.xpForNextLevel ? `${level.xpIntoLevel}/${points(level.xpForNextLevel)} para a próxima patente` : 'Patente máxima!'}
            </Text>
          </View>
        </View>

        {/* Estatísticas */}
        <View className="mt-4 flex-row flex-wrap gap-3">
          <StatCard icon={<PawPrint size={22} color={COLORS.akita} fill={COLORS.akita} />} value={week.displayStreak} label={`${TERMS.streak} (semanas)`} />
          <StatCard
            icon={<Trophy size={22} color={COLORS.clawDark} fill={COLORS.claw} />}
            value={Math.max(streak.longest, week.displayStreak)}
            label={`Maior ${TERMS.streak.toLowerCase()} (semanas)`}
          />
          <StatCard icon={<ClawMarks size={22} />} value={totalXp} label={`${TERMS.points} no total`} />
          <StatCard
            icon={<Bone size={22} color={COLORS.hero} fill={COLORS.heroLight} />}
            value={streak.freezesAvailable}
            label={TERMS.freezes}
          />
          <StatCard
            icon={<Text className="text-xl">🎯</Text>}
            value={`${completedCount}/${totalLessons}`}
            label="Missões cumpridas"
          />
        </View>

        <WeeklyChart xpHistory={xpHistory} />

        {/* Evolução por fase */}
        <View className="mt-4 rounded-xl border-2 border-ink-900 bg-white p-5">
          <Text className="mb-3" style={SECTION_TITLE}>
            EVOLUÇÃO POR FASE
          </Text>
          {modules.map((m) => {
            const done = m.lessons.filter((l) => snapshot.completedLessons[l.id]).length;
            return (
              <View key={m.id} className="mb-3">
                <View className="mb-1 flex-row justify-between">
                  <Text className="flex-1 text-sm font-bold text-ink-600" numberOfLines={1}>
                    {m.phase}. {m.title}
                  </Text>
                  <Text className="text-sm font-bold text-ink-400">
                    {done}/{m.lessons.length}
                  </Text>
                </View>
                <ProgressBar progress={done / m.lessons.length} color={m.color} height={10} />
              </View>
            );
          })}
        </View>

        {/* Diário de comportamento */}
        {pet && (
          <View className="mt-4 rounded-xl border-2 border-ink-900 bg-white p-5">
            <Text className="mb-1" style={SECTION_TITLE}>
              EVOLUÇÃO DO COMPORTAMENTO
            </Text>
            <Text className="mb-3 text-sm text-ink-600">
              De 1 (fora de controle) a 5 (sob controle), pelo check-in semanal.
            </Text>
            {pet.challenges.map((c) => (
              <View key={c} className="mb-4">
                <BehaviorChart challenge={c} log={behaviorLog} />
              </View>
            ))}
            <HeroButton
              label={pet.challenges.length ? 'Fazer check-in da semana' : 'Escolher desafios'}
              variant="secondary"
              onPress={() => router.push(pet.challenges.length ? '/diary' : '/pet-edit')}
            />
          </View>
        )}

        {/* Histórico */}
        <View className="mt-4 rounded-xl border-2 border-ink-900 bg-white p-5">
          <Text className="mb-3" style={SECTION_TITLE}>
            HISTÓRICO DE MISSÕES
          </Text>
          {history.length === 0 ? (
            <View className="flex-row items-center">
              <Logan size={56} mood="sleepy" animated={false} />
              <Text className="ml-3 flex-1 text-sm leading-5 text-ink-600">
                Nenhuma missão ainda. A primeira leva só 4 minutinhos!
              </Text>
            </View>
          ) : (
            history.map((h) => {
              const lesson = getLessonById(h.lessonId);
              return (
                <View key={h.lessonId} className="flex-row items-center border-b border-gray-100 py-2.5">
                  <Text className="text-2xl">{lesson?.icon ?? '🐾'}</Text>
                  <View className="ml-3 flex-1">
                    <Text className="font-bold text-ink-900" numberOfLines={1}>
                      {lesson?.title ?? h.lessonId}
                    </Text>
                    <Text className="text-xs text-ink-400">
                      {new Date(h.completedAt).toLocaleDateString('pt-BR')} · {DIFFICULTY_LABELS[h.difficulty].emoji}{' '}
                      {DIFFICULTY_LABELS[h.difficulty].label}
                      {h.timesCompleted > 1 ? ` · ${h.timesCompleted}x` : ''}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <ClawMarks size={14} />
                    <Text className="ml-1 font-bold text-ink-900">+{h.xpEarned}</Text>
                  </View>
                </View>
              );
            })
          )}
        </View>

        <AccountSettings />

        {/* Assinatura */}
        <View className="mt-4 rounded-xl border-2 border-ink-900 bg-white p-5">
          <View className="flex-row items-center">
            <Crown size={24} color={COLORS.ink} fill={isPro ? COLORS.claw : 'transparent'} />
            <Text className="ml-2" style={SECTION_TITLE}>{isPro ? 'WolverBark Pro ativo' : 'Plano gratuito'}</Text>
          </View>
          <Text className="mt-1 text-sm text-ink-600">
            {isPro ? 'Todas as fases e recursos liberados. Obrigado por apoiar o Logan!' : 'Fase 1 liberada. Desbloqueie todas as fases com o Pro.'}
          </Text>
          <View className="mt-4 gap-3">
            {!isPro && <HeroButton label="Conhecer o Pro" variant="hero" onPress={() => openPaywall('profile')} />}
            <HeroButton
              label="Adicionar outro pet"
              variant="secondary"
              icon={<Plus size={18} color={COLORS.ink} strokeWidth={3} />}
              onPress={() =>
                isPro ? showAlert('Em breve', 'Múltiplos perfis chegam na próxima versão!') : openPaywall('add_pet')
              }
            />
          </View>
        </View>

        {__DEV__ && (
          <View className="mt-6 rounded-2xl border-2 border-dashed border-gray-300 p-4">
            <Text className="mb-3 text-xs font-bold uppercase text-ink-400">Ferramentas de desenvolvimento</Text>
            <View className="gap-3">
              <HeroButton label={isPro ? 'Desativar Pro (mock)' : 'Ativar Pro (mock)'} variant="secondary" onPress={() => setPro(!isPro)} />
              <HeroButton label="Refazer onboarding" variant="secondary" onPress={restartOnboarding} />
              <HeroButton
                label="Zerar progresso"
                variant="danger"
                onPress={async () => {
                  const ok = await showConfirm('Zerar progresso?', 'Garras, sequência e missões cumpridas serão apagadas.', {
                    confirmText: 'Zerar',
                    destructive: true,
                  });
                  if (ok) resetProgress();
                }}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ icon, value, label }: { icon: ReactNode; value: number | string; label: string }) {
  return (
    <View className="min-w-[46%] flex-1 rounded-xl border-2 border-ink-900 bg-white p-4">
      {icon}
      <Text className="mt-2" style={{ fontFamily: FONTS.display, fontSize: 26, color: COLORS.ink }}>
        {value}
      </Text>
      <Text className="text-xs font-bold text-ink-400">{label}</Text>
    </View>
  );
}

/** Gráfico de barras das garras conquistadas nos últimos 7 dias. */
function WeeklyChart({ xpHistory }: { xpHistory: XpEvent[] }) {
  const today = toDateKey();
  const days = Array.from({ length: 7 }, (_, i) => addDays(today, i - 6));
  const totals = days.map((d) => xpHistory.filter((e) => e.date === d).reduce((sum, e) => sum + e.amount, 0));
  const max = Math.max(30, ...totals);
  const weekTotal = totals.reduce((a, b) => a + b, 0);

  return (
    <View className="mt-4 rounded-xl border-2 border-ink-900 bg-white p-5">
      <View className="mb-4 flex-row items-baseline justify-between">
        <Text style={SECTION_TITLE}>ÚLTIMOS 7 DIAS</Text>
        <Text className="text-sm font-bold text-ink-600">{points(weekTotal)}</Text>
      </View>
      <View className="h-32 flex-row items-end justify-between">
        {days.map((d, i) => {
          const value = totals[i]!;
          const isToday = d === today;
          const weekday = new Date(`${d}T12:00:00`).getDay();
          return (
            <View key={d} className="flex-1 items-center">
              {value > 0 && <Text className="mb-1 text-[10px] font-bold text-ink-400">{value}</Text>}
              <View
                className="w-6 rounded-t-lg"
                style={{
                  height: Math.max(6, (value / max) * 96),
                  backgroundColor: value > 0 ? (isToday ? COLORS.claw : COLORS.heroMid) : COLORS.locked,
                  borderWidth: value > 0 ? 2 : 0,
                  borderColor: COLORS.ink,
                }}
              />
              <Text className="mt-1.5 text-xs font-bold" style={{ color: isToday ? COLORS.ink : COLORS.lockedDark }}>
                {WEEKDAYS[weekday]}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
