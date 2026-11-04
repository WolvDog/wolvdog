import { router, useLocalSearchParams } from 'expo-router';
import { AlertTriangle, BadgeCheck, Clock, X } from 'lucide-react-native';
import { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/react/shallow';

import { HeroButton } from '@/components/HeroButton';
import { ExpertAvatar } from '@/components/guide/ExpertAvatar';
import { Logan } from '@/components/Logan';
import { COLORS, FONTS } from '@/constants/theme';
import { GUIDE_CATEGORY_LABELS, GUIDE_READ_REWARD, getGuideBySlug } from '@/data/guides';
import { showAlert } from '@/services/dialog';
import { guideSeal } from '@/services/experts';
import { tap } from '@/services/haptics';
import { personalize } from '@/services/personalize';
import { useAppStore } from '@/store/useAppStore';

export default function GuideDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { expert, petName, petSex, readOn, markGuideRead } = useAppStore(
    useShallow((s) => ({
      expert: s.expert,
      petName: s.pet?.name,
      petSex: s.pet?.sex,
      readOn: slug ? s.guideReads[slug] : undefined,
      markGuideRead: s.markGuideRead,
    })),
  );
  const guide = useMemo(() => {
    const found = getGuideBySlug(slug);
    return found ? personalize(found, { name: petName, sex: petSex }) : undefined;
  }, [slug, petName, petSex]);

  const close = () => (router.canGoBack() ? router.back() : router.replace('/guide'));

  if (!guide) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-cloud p-6">
        <Text className="text-center text-ink-600">Guia não encontrado.</Text>
        <HeroButton className="mt-4" label="Voltar" onPress={close} />
      </SafeAreaView>
    );
  }

  const seal = guideSeal(expert, guide.slug);
  const doctorLabel = expert ? `Visão médica · ${expert.displayName}` : 'Visão veterinária';

  const finish = () => {
    const earned = markGuideRead(guide.slug);
    tap();
    if (earned > 0) showAlert(`+${earned} garras! 🐾`, 'Guia lido. Agora você sabe o que fazer quando acontecer.');
    close();
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-cloud">
      <View className="flex-row items-center justify-between px-4 pb-2 pt-1">
        <Text className="text-xs font-bold uppercase" style={{ color: guide.category === 'emergencia' ? COLORS.danger : COLORS.hero }}>
          {GUIDE_CATEGORY_LABELS[guide.category]}
        </Text>
        <Pressable onPress={close} accessibilityRole="button" accessibilityLabel="Fechar guia" className="rounded-lg border-2 border-ink-900 bg-white p-1">
          <X size={20} color={COLORS.ink} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}>
        {/* Header do módulo: especialista + Logan + selo */}
        <View className="rounded-xl border-2 border-ink-900 bg-white p-4">
          <View className="flex-row items-end">
            <ExpertAvatar expert={expert} size={64} />
            <View className="-ml-3">
              <Logan size={58} mood="happy" animated={false} />
            </View>
            <View className="ml-1 flex-1 flex-row items-center justify-end">
              <Clock size={14} color={COLORS.inkSoft} />
              <Text className="ml-1 text-xs text-ink-600">{guide.readMinutes} min</Text>
            </View>
          </View>
          <Text className="mt-3" style={{ fontFamily: FONTS.display, fontSize: 26, lineHeight: 30, color: COLORS.ink }}>
            {guide.icon} {guide.title}
          </Text>
          <View
            className="mt-2 flex-row items-center self-start rounded-md border px-2 py-1"
            style={{ borderColor: seal.validated ? COLORS.hero : COLORS.lockedDark, backgroundColor: seal.validated ? COLORS.heroLight : COLORS.locked }}
          >
            {seal.validated ? <BadgeCheck size={14} color={COLORS.hero} /> : null}
            <Text className="ml-1 text-xs font-bold" style={{ color: seal.validated ? COLORS.hero : COLORS.inkSoft }}>
              {seal.label}
            </Text>
          </View>
        </View>

        {/* Visão médica: 2 frases */}
        <View className="mt-3 rounded-xl border-2 border-ink-900 p-4" style={{ backgroundColor: COLORS.heroLight }}>
          <Text className="text-xs font-bold uppercase text-hero-500">🩺 {doctorLabel}</Text>
          <Text className="mt-2 text-base leading-6 text-ink-900">{guide.doctorAdvice}</Text>
        </View>

        {/* Missão de ação: 3 passos */}
        <View className="mt-3 rounded-xl border-2 border-ink-900 bg-white p-4">
          <Text className="text-xs font-bold uppercase" style={{ color: COLORS.akitaDark }}>
            ⚡ Missão do Logan
          </Text>
          {guide.loganSteps.map((step, i) => (
            <View key={i} className="mt-3 flex-row">
              <View className="h-7 w-7 items-center justify-center rounded-md border-2 border-ink-900 bg-claw-500">
                <Text style={{ fontFamily: FONTS.display, fontSize: 15, color: COLORS.ink }}>{i + 1}</Text>
              </View>
              <Text className="ml-3 flex-1 text-base leading-6 text-ink-900">{step}</Text>
            </View>
          ))}
        </View>

        {guide.warning ? (
          <View className="mt-3 flex-row rounded-xl border-2 p-4" style={{ borderColor: COLORS.danger, backgroundColor: '#FDECEC' }}>
            <AlertTriangle size={20} color={COLORS.danger} />
            <Text className="ml-2 flex-1 text-sm leading-5 text-ink-900">
              <Text className="font-bold">Procure o veterinário: </Text>
              {guide.warning}
            </Text>
          </View>
        ) : null}

        <HeroButton
          className="mt-5"
          label={readOn ? 'Fechar' : `Li e entendi · +${GUIDE_READ_REWARD} garras`}
          variant={readOn ? 'secondary' : 'primary'}
          onPress={readOn ? close : finish}
        />
        {readOn ? <Text className="mt-2 text-center text-xs text-ink-400">Você já leu este guia.</Text> : null}
      </ScrollView>
    </SafeAreaView>
  );
}
