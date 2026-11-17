import { LinearGradient } from 'expo-linear-gradient';
import { Check, Ticket, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Linking, Modal, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/react/shallow';

import { COLORS, FONTS } from '@/constants/theme';
import { PRO_BENEFITS, SUBSCRIPTION_PLANS } from '@/data/mockData';
import { showAlert } from '@/services/dialog';
import { lookupPartner, normalizePartnerCode } from '@/services/partners';
import { extraPetLabel } from '@/services/pricing';
import { PurchasesService } from '@/services/purchases';
import { type PaywallSource, useAppStore } from '@/store/useAppStore';
import type { PartnerInfo, SubscriptionPlan } from '@/types';

import { HeroButton } from './HeroButton';
import { Logan } from './Logan';

/** Endereço público do app na web (páginas de termos e privacidade). */
const PUBLIC_SITE_URL = 'https://wolvdog.expo.app';

const STORE_NAME = Platform.OS === 'ios' ? 'App Store' : 'Google Play';

const HEADLINES: Record<PaywallSource, { title: string; logan: string }> = {
  locked_module: {
    title: 'Desbloqueie a próxima fase!',
    logan: 'Você mandou muito bem nas primeiras missões! Bora virar uma dupla de heróis completa?',
  },
  profile: {
    title: 'Vire um Tutor Herói',
    logan: 'Com o Pro, eu te acompanho em TODOS os desafios do seu cão. Prometo!',
  },
  streak_freeze: {
    title: 'Proteja sua sequência',
    logan: 'No Pro você ganha Ossos Reserva: perdeu uma semana, a sequência continua!',
  },
  review: {
    title: 'Reforço inteligente',
    logan: 'Eu lembro a hora certa de revisar cada comando, pra ele nunca esquecer. Isso é coisa de Pro!',
  },
  add_pet: {
    title: 'Mais pets, mais diversão',
    logan: 'Tem mais de um au-au em casa? Cada um ganha sua própria trilha no Pro!',
  },
};

export function PaywallModal() {
  const insets = useSafeAreaInsets();
  const { visible, source, close, setPro, partnerCode, partner, setPartner } = useAppStore(
    useShallow((s) => ({
      visible: s.paywall.visible,
      source: s.paywall.source,
      close: s.closePaywall,
      setPro: s.setPro,
      partnerCode: s.user.partnerCode,
      partner: s.user.partnerInfo,
      setPartner: s.setPartner,
    })),
  );

  const [plans, setPlans] = useState<SubscriptionPlan[]>(SUBSCRIPTION_PLANS);
  const [selectedId, setSelectedId] = useState(SUBSCRIPTION_PLANS[0]!.id);
  const [purchasing, setPurchasing] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [couponStatus, setCouponStatus] = useState<'idle' | 'checking' | 'invalid'>('idle');

  useEffect(() => {
    if (visible && partnerCode && !partner) void lookupPartner(partnerCode).then((p) => p && setPartner(p));
  }, [visible, partnerCode, partner, setPartner]);

  // Preços vêm da loja (RevenueCat); com cupom de parceiro, cada plano traz também o preço com desconto.
  useEffect(() => {
    if (visible) void PurchasesService.getPlans(partner).then(setPlans);
  }, [visible, partner]);

  // O cupom vale para a conta: fica salvo no perfil (atribuição ao parceiro) e já vem aplicado na próxima vez.
  async function applyCoupon() {
    const code = normalizePartnerCode(couponInput);
    if (!code) return;
    setCouponStatus('checking');
    const found = await lookupPartner(code);
    if (found) {
      setPartner(found);
      setCouponInput('');
      setCouponStatus('idle');
    } else {
      setCouponStatus('invalid');
    }
  }

  const headline = HEADLINES[source ?? 'profile'];
  const selected = plans.find((p) => p.id === selectedId) ?? plans[0]!;
  // A loja só oferece o teste grátis a quem ainda não usou: sem teste, o botão vira "Assinar".
  const hasTrial = selected.trialDays > 0;

  // Abre a página pública no navegador e mantém o Pro aberto: quem está assinando não perde o lugar.
  const openLegal = (path: '/termos-de-uso' | '/privacidade') => void Linking.openURL(`${PUBLIC_SITE_URL}${path}`);

  async function handlePurchase() {
    setPurchasing(true);
    let result;
    try {
      result = await PurchasesService.purchase(selected);
    } catch {
      result = { isPro: false, error: 'Não foi possível concluir agora. Tente de novo em instantes.' };
    } finally {
      setPurchasing(false);
    }
    if (result.isPro) {
      setPro(true);
      close();
      showAlert(
        'Pro ativado! 🎉',
        hasTrial
          ? `Seu teste grátis de ${selected.trialDays} dias começou. Todas as fases foram liberadas!`
          : 'Todas as fases foram liberadas!',
      );
    } else if (result.error) {
      showAlert('Ops!', result.error);
    }
  }

  async function handleRestore() {
    setRestoring(true);
    let result;
    try {
      result = await PurchasesService.restore();
    } catch {
      result = { isPro: false, error: 'Não foi possível verificar suas compras agora.' };
    } finally {
      setRestoring(false);
    }
    if (result.isPro) {
      setPro(true);
      close();
    } else {
      showAlert('Restaurar compras', result.error ?? 'Nenhuma compra encontrada.');
    }
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen" onRequestClose={close}>
      <View className="flex-1 bg-white">
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }} bounces={false}>
          <LinearGradient
            colors={[COLORS.ink, COLORS.heroDark, COLORS.hero]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ paddingTop: insets.top + 12, paddingBottom: 28, paddingHorizontal: 20 }}
          >
            <Pressable
              onPress={close}
              accessibilityRole="button"
              accessibilityLabel="Fechar"
              className="h-9 w-9 items-center justify-center self-end rounded-full bg-white/20"
            >
              <X size={20} color="#FFFFFF" />
            </Pressable>

            <View className="mt-2 items-center">
              <Logan size={120} mood="hero" />
              <View className="mt-3 rotate-[-2deg] rounded-md border-2 border-ink-900 bg-claw-500 px-3 py-1">
                <Text style={{ fontFamily: FONTS.display, fontSize: 13, letterSpacing: 2, color: COLORS.ink }}>WOLVDOG PRO</Text>
              </View>
              <Text className="mt-3 text-center" style={{ fontFamily: FONTS.display, fontSize: 32, color: COLORS.white }}>
                {headline.title}
              </Text>
              <Text className="mt-2 text-center text-base leading-6 text-white/90">“{headline.logan}”</Text>
            </View>
          </LinearGradient>

          <View className="px-5 pt-6">
            {PRO_BENEFITS.map((b) => (
              <View key={b.title} className="mb-4 flex-row items-start">
                <View className="h-11 w-11 items-center justify-center rounded-lg border-2 border-ink-900 bg-claw-100">
                  <Text className="text-xl">{b.icon}</Text>
                </View>
                <View className="ml-3 flex-1">
                  <Text className="text-base font-bold text-ink-900">{b.title}</Text>
                  <Text className="text-sm leading-5 text-ink-600">{b.description}</Text>
                </View>
              </View>
            ))}

            <Text className="mb-3 mt-2" style={{ fontFamily: FONTS.display, fontSize: 20, color: COLORS.ink }}>
              ESCOLHA SEU PLANO
            </Text>
            <CouponBox
              partner={partner}
              value={couponInput}
              status={couponStatus}
              onChange={(text) => {
                setCouponInput(text);
                if (couponStatus === 'invalid') setCouponStatus('idle');
              }}
              onApply={() => void applyCoupon()}
              onRemove={() => setPartner(null)}
            />
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} selected={plan.id === selectedId} onPress={() => setSelectedId(plan.id)} />
            ))}

            <View className="mt-1 rounded-lg border-2 border-dashed px-3 py-2.5" style={{ borderColor: '#D5D8DE' }}>
              <Text className="text-sm text-ink-600">
                🐾 O plano inclui 1 cão. Tem mais? <Text className="font-bold text-ink-900">{extraPetLabel(selected)}</Text> (50% do plano).
              </Text>
            </View>

            {hasTrial && (
              <View className="mt-2 flex-row items-center justify-center">
                <Check size={16} color={COLORS.hero} strokeWidth={3} />
                <Text className="ml-1.5 text-sm font-bold text-ink-600">Sem cobrança hoje · cancele quando quiser</Text>
              </View>
            )}
          </View>
        </ScrollView>

        <View className="border-t-2 border-ink-900 px-5 pt-4" style={{ paddingBottom: insets.bottom + 12 }}>
          <HeroButton
            label={hasTrial ? `Começar ${selected.trialDays} dias grátis` : 'Assinar o Pro'}
            variant="primary"
            loading={purchasing}
            onPress={handlePurchase}
          />
          {selected.discount && partner && (
            <Text className="mt-3 text-center text-sm font-bold" style={{ color: COLORS.hero }}>
              🎁 Desconto de parceiro {partner.name} aplicado: {selected.discount.percent}% off.
            </Text>
          )}
          <Text className="mt-3 text-center text-xs leading-4 text-ink-400">
            {selected.discount
              ? `Com o cupom, ${selected.discount.termsLabel}.`
              : hasTrial
                ? `Após o teste, ${selected.priceLabel}.`
                : `${selected.priceLabel}.`}{' '}
            Renovação automática pela {STORE_NAME}. Cancele
            quando quiser nas assinaturas da loja.
          </Text>
          <Pressable onPress={handleRestore} disabled={restoring} className="mt-2 py-1">
            <Text className="text-center text-sm font-bold text-hero-500">
              {restoring ? 'Restaurando…' : 'Restaurar compras'}
            </Text>
          </Pressable>
          {/* A Apple exige os links de termos e privacidade na tela de assinatura. */}
          <View className="mt-1 flex-row justify-center">
            <Pressable onPress={() => openLegal('/termos-de-uso')} accessibilityRole="link" className="px-2 py-1">
              <Text className="text-xs text-ink-400 underline">Termos de uso</Text>
            </Pressable>
            <Pressable onPress={() => openLegal('/privacidade')} accessibilityRole="link" className="px-2 py-1">
              <Text className="text-xs text-ink-400 underline">Política de privacidade</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function PlanCard({ plan, selected, onPress }: { plan: SubscriptionPlan; selected: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      className="mb-3 rounded-xl px-4 py-4"
      style={{
        borderWidth: selected ? 2.5 : 2,
        borderColor: selected ? COLORS.ink : '#D5D8DE',
        backgroundColor: selected ? COLORS.heroLight : COLORS.white,
      }}
    >
      {plan.badge && (
        <View className="absolute -top-3 right-4 rounded-md border-2 border-ink-900 bg-claw-500 px-2 py-0.5">
          <Text className="text-[11px] font-bold text-ink-900">{plan.badge}</Text>
        </View>
      )}
      <View className="flex-row items-center">
        <View
          className="h-6 w-6 items-center justify-center rounded-md border-2"
          style={{ borderColor: COLORS.ink, backgroundColor: selected ? COLORS.claw : COLORS.white }}
        >
          {selected && <Check size={14} color={COLORS.ink} strokeWidth={4} />}
        </View>
        <View className="ml-3 flex-1">
          <View className="flex-row items-center">
            <Text className="text-base font-bold text-ink-900">{plan.title}</Text>
            {plan.savingsPercent ? (
              <View className="ml-2 rounded-md bg-hero-500 px-1.5 py-0.5">
                <Text className="text-[11px] font-bold text-white">-{plan.savingsPercent}%</Text>
              </View>
            ) : null}
          </View>
          {plan.discount ? (
            <View className="flex-row flex-wrap items-baseline">
              <Text className="mr-1.5 text-sm text-ink-400 line-through">{plan.priceLabel}</Text>
              <Text className="text-sm font-bold" style={{ color: COLORS.hero }}>
                {plan.discount.priceLabel}
              </Text>
            </View>
          ) : (
            <Text className="text-sm text-ink-600">{plan.priceLabel}</Text>
          )}
        </View>
        {plan.discount ? (
          <View className="items-end">
            <Text className="text-xs text-ink-400 line-through">{plan.pricePerMonthLabel}</Text>
            <View className="mt-0.5 rounded-md border-2 border-ink-900 px-1.5" style={{ backgroundColor: COLORS.claw }}>
              <Text style={{ fontFamily: FONTS.display, fontSize: 17, color: COLORS.hero }}>{plan.discount.pricePerMonthLabel}</Text>
            </View>
          </View>
        ) : (
          <Text style={{ fontFamily: FONTS.display, fontSize: 17, color: COLORS.ink }}>{plan.pricePerMonthLabel}</Text>
        )}
      </View>
    </Pressable>
  );
}

/** Campo "Cupom de parceiro": valida o código no Supabase; aplicado, mostra o parceiro e o desconto. */
function CouponBox({
  partner,
  value,
  status,
  onChange,
  onApply,
  onRemove,
}: {
  partner: PartnerInfo | null;
  value: string;
  status: 'idle' | 'checking' | 'invalid';
  onChange: (text: string) => void;
  onApply: () => void;
  onRemove: () => void;
}) {
  if (partner) {
    return (
      <View className="mb-4 flex-row items-center rounded-xl border-2 border-ink-900 p-3" style={{ backgroundColor: COLORS.clawLight }}>
        <Ticket size={20} color={COLORS.ink} />
        <View className="ml-2.5 flex-1">
          <Text style={{ fontFamily: FONTS.display, fontSize: 15, color: COLORS.ink }}>
            CUPOM {partner.code}
            {partner.discountPercent ? ` · ${partner.discountPercent}% OFF` : ''}
          </Text>
          <Text className="text-xs text-ink-600">
            {partner.name}: {partner.perk}
          </Text>
        </View>
        <Pressable onPress={onRemove} accessibilityRole="button" accessibilityLabel="Remover cupom" className="px-2 py-1">
          <Text className="text-xs font-bold text-ink-400 underline">Remover</Text>
        </Pressable>
      </View>
    );
  }

  const hasText = value.trim().length > 0;
  return (
    <View className="mb-4">
      <View
        className="flex-row items-center rounded-xl border-2 bg-white pl-3"
        style={{ borderColor: status === 'invalid' ? '#DC2626' : '#D5D8DE' }}
      >
        <Ticket size={18} color={COLORS.ink} />
        <TextInput
          value={value}
          onChangeText={onChange}
          onSubmitEditing={onApply}
          placeholder="Tem cupom de parceiro?"
          placeholderTextColor="#9CA3AF"
          autoCapitalize="characters"
          autoCorrect={false}
          returnKeyType="done"
          accessibilityLabel="Cupom de parceiro"
          className="ml-2 flex-1 py-3 text-base text-ink-900"
        />
        <Pressable
          onPress={onApply}
          disabled={!hasText || status === 'checking'}
          accessibilityRole="button"
          accessibilityLabel="Aplicar cupom"
          className="m-1.5 rounded-lg border-2 border-ink-900 px-3 py-1.5"
          style={{ backgroundColor: hasText ? COLORS.claw : '#F3F4F6' }}
        >
          {status === 'checking' ? (
            <ActivityIndicator size="small" color={COLORS.ink} />
          ) : (
            <Text style={{ fontFamily: FONTS.display, fontSize: 14, color: COLORS.ink }}>APLICAR</Text>
          )}
        </Pressable>
      </View>
      {status === 'invalid' && <Text className="mt-1 text-xs font-bold text-red-600">Cupom inválido ou expirado.</Text>}
    </View>
  );
}
