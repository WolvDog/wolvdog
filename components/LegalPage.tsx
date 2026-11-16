import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Logan } from '@/components/Logan';
import { COLORS, FONTS } from '@/constants/theme';
import { COMPANY, type LegalDoc } from '@/data/legal';

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

/** Página de texto legal (privacidade, termos, exclusão de conta): no app e na web, sem precisar de login. */
export function LegalPage({ doc }: { doc: LegalDoc }) {
  const canGoBack = router.canGoBack();

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-cloud">
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 48, maxWidth: 760, width: '100%', alignSelf: 'center' }}>
        <View className="flex-row items-center">
          {canGoBack ? (
            <Pressable
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Voltar"
              className="mr-3 rounded-lg border-2 border-ink-900 bg-white p-1.5"
            >
              <ArrowLeft size={20} color={COLORS.ink} />
            </Pressable>
          ) : null}
          <Logan size={44} mood="happy" animated={false} />
          <Text className="ml-2" style={{ fontFamily: FONTS.display, fontSize: 16, color: COLORS.hero }}>
            {COMPANY.brand.toUpperCase()}
          </Text>
        </View>

        <Text className="mt-5" style={{ fontFamily: FONTS.display, fontSize: 30, lineHeight: 36, color: COLORS.ink }} accessibilityRole="header">
          {doc.title}
        </Text>
        <Text className="mt-1 text-xs text-ink-400">Atualizado em {formatDate(doc.updatedAt)}</Text>
        <Text className="mt-4 text-base leading-6 text-ink-900">{doc.intro}</Text>

        {doc.sections.map((section) => (
          <View key={section.title} className="mt-6">
            <Text style={{ fontFamily: FONTS.display, fontSize: 19, color: COLORS.ink }} accessibilityRole="header">
              {section.title}
            </Text>
            {section.bullets?.map((b) => (
              <View key={b} className="mt-2 flex-row">
                <Text className="mr-2 text-base leading-6 text-hero-500">•</Text>
                <Text className="flex-1 text-base leading-6 text-ink-900">{b}</Text>
              </View>
            ))}
            {section.paragraphs?.map((p) => (
              <Text key={p} className="mt-2 text-base leading-6 text-ink-900">
                {p}
              </Text>
            ))}
          </View>
        ))}

        <Text className="mt-10 text-xs leading-5 text-ink-400">
          {COMPANY.name} · CNPJ {COMPANY.cnpj} · {COMPANY.email}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
