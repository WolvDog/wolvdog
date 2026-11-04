import { router } from 'expo-router';
import { CheckCircle2, ChevronRight } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/react/shallow';

import { ClawMarks } from '@/components/icons';
import { ExpertAvatar } from '@/components/guide/ExpertAvatar';
import { Logan } from '@/components/Logan';
import { COLORS, FONTS } from '@/constants/theme';
import { GUIDE_CATEGORY_LABELS, GUIDE_READ_REWARD, TUTOR_GUIDES } from '@/data/guides';
import { useAppStore } from '@/store/useAppStore';

/** Guia do Tutor: consultas rápidas para as dores que acontecem fora do treino (funciona offline). */
export default function GuideScreen() {
  const { expert, guideReads } = useAppStore(useShallow((s) => ({ expert: s.expert, guideReads: s.guideReads })));
  const readCount = TUTOR_GUIDES.filter((g) => guideReads[g.slug]).length;

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-cloud">
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 48 }}>
        {/* Cabeçalho: quem assina o guia + Logan */}
        <View className="rounded-xl border-2 border-ink-900 bg-white p-4">
          <View className="flex-row items-center">
            <ExpertAvatar expert={expert} size={60} />
            <View className="-ml-3 mt-6">
              <Logan size={52} mood="happy" animated={false} />
            </View>
            <View className="ml-2 flex-1">
              <Text style={{ fontFamily: FONTS.display, fontSize: 22, color: COLORS.ink }}>GUIA DO TUTOR</Text>
              <Text className="text-sm text-ink-600">
                {expert ? `Com ${expert.displayName}${expert.title ? ` · ${expert.title}` : ''}` : 'Respostas rápidas para o dia a dia'}
              </Text>
            </View>
          </View>
          <Text className="mt-3 text-sm leading-5 text-ink-600">
            Aconteceu algo fora do treino? Cada guia tem a explicação da veterinária e uma missão de 3 passos do Logan.
            Funciona sem internet.
          </Text>
          <Text className="mt-2 text-xs font-bold text-ink-400">
            {readCount}/{TUTOR_GUIDES.length} lidos · +{GUIDE_READ_REWARD} garras na primeira leitura de cada um
          </Text>
        </View>

        {TUTOR_GUIDES.map((guide) => {
          const read = !!guideReads[guide.slug];
          const urgent = guide.category === 'emergencia';
          return (
            <Pressable
              key={guide.slug}
              onPress={() => router.push({ pathname: '/guide/[slug]', params: { slug: guide.slug } })}
              accessibilityRole="button"
              accessibilityLabel={`${guide.title}. ${read ? 'Lido' : `Vale ${GUIDE_READ_REWARD} garras`}`}
              className="mt-3 flex-row items-center rounded-xl border-2 border-ink-900 bg-white p-3"
              style={urgent ? { backgroundColor: '#FDECEC' } : undefined}
            >
              <View className="h-12 w-12 items-center justify-center rounded-lg border-2 border-ink-900 bg-claw-100">
                <Text style={{ fontSize: 24 }}>{guide.icon}</Text>
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-[10px] font-bold uppercase" style={{ color: urgent ? COLORS.danger : COLORS.hero }}>
                  {GUIDE_CATEGORY_LABELS[guide.category]} · {guide.readMinutes} min
                </Text>
                <Text style={{ fontFamily: FONTS.display, fontSize: 17, color: COLORS.ink }}>{guide.title}</Text>
                <Text className="text-xs text-ink-600" numberOfLines={2}>
                  {guide.summary}
                </Text>
              </View>
              {read ? (
                <CheckCircle2 size={22} color={COLORS.hero} />
              ) : (
                <View className="flex-row items-center rounded-md border border-ink-900 bg-claw-500 px-1.5 py-0.5">
                  <ClawMarks size={12} />
                  <Text className="ml-0.5 text-xs font-bold text-ink-900">+{GUIDE_READ_REWARD}</Text>
                </View>
              )}
              <ChevronRight size={18} color={COLORS.inkSoft} style={{ marginLeft: 4 }} />
            </Pressable>
          );
        })}

        <Text className="mt-6 px-2 text-center text-xs leading-4 text-ink-400">
          Os guias orientam, mas não substituem a consulta. Em caso de dúvida ou emergência, procure um veterinário.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
