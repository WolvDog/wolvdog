import { router } from 'expo-router';
import { Crown, Flame, Pencil, Plus, Trophy, Zap } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/react/shallow';

import { ChunkyButton } from '@/components/ChunkyButton';
import { Logan } from '@/components/Logan';
import { ProgressBar } from '@/components/ProgressBar';
import { CHALLENGE_LABELS, DIFFICULTY_LABELS, formatAge, PET_SIZE_LABELS } from '@/constants/labels';
import { COLORS } from '@/constants/theme';
import { getLessonById } from '@/data/mockData';
import { useProgression } from '@/hooks/useProgression';
import { showAlert, showConfirm } from '@/services/dialog';
import { addDays, toDateKey } from '@/services/gamification';
import { useAppStore } from '@/store/useAppStore';
import type { XpEvent } from '@/types';

const WEEKDAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

export default function ProfileScreen() {
  const { modules, snapshot, level, totalXp, completedCount, totalLessons } = useProgression();
  const { pet, streak, isPro, xpHistory, completedLessons, openPaywall, setPro, resetProgress } = useAppStore(
    useShallow((s) => ({
      pet: s.pet,
      streak: s.streak,
      isPro: s.isPro,
      xpHistory: s.progress.xpHistory,
      completedLessons: s.progress.completedLessons,
      openPaywall: s.openPaywall,
      setPro: s.setPro,
      resetProgress: s.resetProgress,
    })),
  );

  const history = Object.values(completedLessons).sort((a, b) => b.completedAt.localeCompare(a.completedAt));

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-cloud">
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 48 }}>
        {/* Cabeçalho do pet */}
        <View className="items-center rounded-3xl border-2 border-gray-200 bg-white p-5">
          <Pressable
            onPress={() => router.push('/pet-edit')}
            className="absolute right-4 top-4 rounded-full bg-gray-100 p-2"
            accessibilityRole="button"
            accessibilityLabel="Editar perfil do pet"
          >
            <Pencil size={18} color={COLORS.inkSoft} />
          </Pressable>

          <View className="h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-akita-300 bg-akita-50">
            {pet?.photoUri ? (
              <Image source={{ uri: pet.photoUri }} className="h-full w-full" />
            ) : (
              <Text style={{ fontSize: 56 }}>🐕</Text>
            )}
          </View>

          {pet ? (
            <>
              <Text className="mt-3 text-2xl font-extrabold text-ink-900">{pet.name}</Text>
              <Text className="mt-0.5 text-sm text-ink-600">
                {pet.breed} · {formatAge(pet.ageMonths)} · Porte {PET_SIZE_LABELS[pet.size].toLowerCase()}
              </Text>
              {pet.challenges.length > 0 && (
                <View className="mt-3 flex-row flex-wrap justify-center gap-2">
                  {pet.challenges.map((c) => (
                    <View key={c} className="rounded-full bg-akita-50 px-3 py-1">
                      <Text className="text-xs font-bold text-akita-700">
                        {CHALLENGE_LABELS[c].emoji} {CHALLENGE_LABELS[c].label}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </>
          ) : (
            <ChunkyButton className="mt-4 w-full" label="Cadastrar meu pet" onPress={() => router.push('/pet-edit')} />
          )}
        </View>

        {/* Nível de aprendizado */}
        <View className="mt-4 rounded-3xl border-2 border-gray-200 bg-white p-5">
          <View className="flex-row items-center">
            <View className="h-14 w-14 items-center justify-center rounded-2xl bg-hero-500">
              <Text className="text-2xl font-extrabold text-white">{level.level}</Text>
            </View>
            <View className="ml-3 flex-1">
              <Text className="text-xs font-extrabold uppercase text-ink-400">Nível de aprendizado</Text>
              <Text className="text-lg font-extrabold text-ink-900">{level.title}</Text>
            </View>
          </View>
          <View className="mt-4">
            <ProgressBar progress={level.progress} color={COLORS.hero} height={14} />
            <Text className="mt-1.5 text-right text-xs font-bold text-ink-400">
              {level.xpForNextLevel ? `${level.xpIntoLevel}/${level.xpForNextLevel} XP para o próximo nível` : 'Nível máximo!'}
            </Text>
          </View>
        </View>

        {/* Estatísticas */}
        <View className="mt-4 flex-row flex-wrap gap-3">
          <StatCard icon={<Flame size={22} color={COLORS.flame} fill={COLORS.flame} />} value={streak.current} label="Ofensiva atual" />
          <StatCard icon={<Trophy size={22} color={COLORS.gold} fill={COLORS.gold} />} value={streak.longest} label="Maior ofensiva" />
          <StatCard icon={<Zap size={22} color={COLORS.gold} fill={COLORS.gold} />} value={totalXp} label="XP total" />
          <StatCard
            icon={<Text className="text-xl">📚</Text>}
            value={`${completedCount}/${totalLessons}`}
            label="Lições concluídas"
          />
        </View>

        <WeeklyChart xpHistory={xpHistory} />

        {/* Evolução por fase */}
        <View className="mt-4 rounded-3xl border-2 border-gray-200 bg-white p-5">
          <Text className="mb-3 text-lg font-extrabold text-ink-900">Evolução por fase</Text>
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

        {/* Histórico */}
        <View className="mt-4 rounded-3xl border-2 border-gray-200 bg-white p-5">
          <Text className="mb-3 text-lg font-extrabold text-ink-900">Histórico de treinos</Text>
          {history.length === 0 ? (
            <View className="flex-row items-center">
              <Logan size={56} mood="sleepy" animated={false} />
              <Text className="ml-3 flex-1 text-sm leading-5 text-ink-600">
                Nenhum treino ainda. Sua primeira lição leva só 4 minutinhos!
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
                  <Text className="font-extrabold text-yellow-500">+{h.xpEarned} XP</Text>
                </View>
              );
            })
          )}
        </View>

        {/* Assinatura */}
        <View className="mt-4 rounded-3xl border-2 border-gray-200 bg-white p-5">
          <View className="flex-row items-center">
            <Crown size={24} color="#E0A800" fill={isPro ? COLORS.gold : 'transparent'} />
            <Text className="ml-2 text-lg font-extrabold text-ink-900">{isPro ? 'WolverBark Pro ativo' : 'Plano gratuito'}</Text>
          </View>
          <Text className="mt-1 text-sm text-ink-600">
            {isPro ? 'Todas as fases e recursos liberados. Obrigado por apoiar o Logan!' : 'Fase 1 liberada. Desbloqueie todas as fases com o Pro.'}
          </Text>
          <View className="mt-4 gap-3">
            {!isPro && <ChunkyButton label="Conhecer o Pro" variant="hero" onPress={() => openPaywall('profile')} />}
            <ChunkyButton
              label="Adicionar outro pet"
              variant="secondary"
              icon={<Plus size={18} color={COLORS.ice} strokeWidth={3} />}
              onPress={() =>
                isPro ? showAlert('Em breve', 'Múltiplos perfis chegam na próxima versão!') : openPaywall('add_pet')
              }
            />
          </View>
        </View>

        {__DEV__ && (
          <View className="mt-6 rounded-2xl border-2 border-dashed border-gray-300 p-4">
            <Text className="mb-3 text-xs font-extrabold uppercase text-ink-400">Ferramentas de desenvolvimento</Text>
            <View className="gap-3">
              <ChunkyButton label={isPro ? 'Desativar Pro (mock)' : 'Ativar Pro (mock)'} variant="secondary" onPress={() => setPro(!isPro)} />
              <ChunkyButton
                label="Zerar progresso"
                variant="danger"
                onPress={async () => {
                  const ok = await showConfirm('Zerar progresso?', 'XP, ofensiva e lições concluídas serão apagados.', {
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
    <View className="min-w-[46%] flex-1 rounded-2xl border-2 border-gray-200 bg-white p-4">
      {icon}
      <Text className="mt-2 text-2xl font-extrabold text-ink-900">{value}</Text>
      <Text className="text-xs font-bold text-ink-400">{label}</Text>
    </View>
  );
}

/** Gráfico de barras de XP dos últimos 7 dias. */
function WeeklyChart({ xpHistory }: { xpHistory: XpEvent[] }) {
  const today = toDateKey();
  const days = Array.from({ length: 7 }, (_, i) => addDays(today, i - 6));
  const totals = days.map((d) => xpHistory.filter((e) => e.date === d).reduce((sum, e) => sum + e.amount, 0));
  const max = Math.max(30, ...totals);
  const weekTotal = totals.reduce((a, b) => a + b, 0);

  return (
    <View className="mt-4 rounded-3xl border-2 border-gray-200 bg-white p-5">
      <View className="mb-4 flex-row items-baseline justify-between">
        <Text className="text-lg font-extrabold text-ink-900">Últimos 7 dias</Text>
        <Text className="text-sm font-bold text-yellow-500">{weekTotal} XP</Text>
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
                  backgroundColor: value > 0 ? (isToday ? COLORS.akita : COLORS.akitaLight) : '#EFEFEF',
                }}
              />
              <Text className="mt-1.5 text-xs font-extrabold" style={{ color: isToday ? COLORS.akita : COLORS.lockedDark }}>
                {WEEKDAYS[weekday]}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
