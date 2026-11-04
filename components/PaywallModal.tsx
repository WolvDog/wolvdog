import { LinearGradient } from 'expo-linear-gradient';
import { Check, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/react/shallow';

import { COLORS, FONTS } from '@/constants/theme';
import { PRO_BENEFITS, SUBSCRIPTION_PLANS } from '@/data/mockData';
import { showAlert } from '@/services/dialog';
import { lookupPartner } from '@/services/partners';
import { extraPetLabel } from '@/services/pricing';
import { PurchasesService } from '@/services/purchases';
import { type PaywallSource, useAppStore } from '@/store/useAppStore';
import type { SubscriptionPlan } from '@/types';

import { HeroButton } from './HeroButton';
import { Logan } from './Logan';

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
    logan: 'No Pro eu guardo 2 Ossos Reserva por semana pra você. Nada de perder a sequência!',
  },
  add_pet: {
    title: 'Mais pets, mais diversão',
    logan: 'Tem mais de um au-au em casa? Cada um ganha sua própria trilha no Pro!',
  },
};

export function PaywallModal() {
  const insets = useSafeAreaInsets();
  const { visible, source, close, setPro, userId, partnerCode, partner, setPartner } = useAppStore(
    useShallow((s) => ({
      visible: s.paywall.visible,
      source: s.paywall.source,
      close: s.closePaywall,
      setPro: s.setPro,
      userId: s.user.id,
      partnerCode: s.user.partnerCode,
      partner: s.user.partnerInfo,
      setPartner: s.setPartner,
    })),
  );

  const [plans, setPlans] = useState<SubscriptionPlan[]>(SUBSCRIPTION_PLANS);
  const [selectedId, setSelectedId] = useState(SUBSCRIPTION_PLANS[0]!.id);
  const [purchasing, setPurchasing] = useState(false);
  const [restoring, setRestoring] = useState(false);

  useEffect(() => {
    if (visible && partnerCode && !partner) void lookupPartner(partnerCode).then((p) => p && setPartner(p));
  }, [visible, partnerCode, partner, setPartner]);

  useEffect(() => {
    PurchasesService.configure(userId);
    if (visible) void PurchasesService.getPlans().then(setPlans);
  }, [visible, userId]);

  const headline = HEADLINES[source ?? 'profile'];
  const selected = plans.find((p) => p.id === selectedId) ?? plans[0]!;

  async function handlePurchase() {
    setPurchasing(true);
    const result = await PurchasesService.purchase(selected);
    setPurchasing(false);
    if (result.isPro) {
      setPro(true);
      close();
      showAlert('Bem-vindo ao Pro! 🎉', `Seu teste grátis de ${selected.trialDays} dias começou. Todas as fases foram liberadas!`);
    } else if (result.error) {
      showAlert('Ops!', result.error);
    }
  }

  async function handleRestore() {
    setRestoring(true);
    const result = await PurchasesService.restore();
    setRestoring(false);
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
                <Text style={{ fontFamily: FONTS.display, fontSize: 13, letterSpacing: 2, color: COLORS.ink }}>WOLVERBARK PRO</Text>
              </View>
              <Text className="mt-3 text-center" style={{ fontFamily: FONTS.display, fontSize: 32, color: COLORS.white }}>
                {headline.title}
              </Text>
              <Text className="mt-2 text-center text-base leading-6 text-white/90">“{headline.logan}”</Text>
            </View>
          </LinearGradient>

          <View className="px-5 pt-6">
            {partner && (
              <View className="mb-5 rounded-xl border-2 border-ink-900 bg-claw-100 p-4">
                <Text style={{ fontFamily: FONTS.display, fontSize: 15, color: COLORS.ink }}>🎁 BENEFÍCIO {partner.name.toUpperCase()}</Text>
                <Text className="mt-1 text-sm text-ink-600">
                  Código {partner.code}: {partner.perk}. O desconto é aplicado na tela de pagamento da loja.
                </Text>
              </View>
            )}
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
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} selected={plan.id === selectedId} onPress={() => setSelectedId(plan.id)} />
            ))}

            <View className="mt-1 rounded-lg border-2 border-dashed px-3 py-2.5" style={{ borderColor: '#D5D8DE' }}>
              <Text className="text-sm text-ink-600">
                🐾 O plano inclui 1 cão. Tem mais? <Text className="font-bold text-ink-900">{extraPetLabel(selected)}</Text> (50% do plano).
              </Text>
            </View>

            <View className="mt-2 flex-row items-center justify-center">
              <Check size={16} color={COLORS.hero} strokeWidth={3} />
              <Text className="ml-1.5 text-sm font-bold text-ink-600">Sem cobrança hoje · cancele quando quiser</Text>
            </View>
          </View>
        </ScrollView>

        <View className="border-t-2 border-ink-900 px-5 pt-4" style={{ paddingBottom: insets.bottom + 12 }}>
          <HeroButton
            label={`Começar ${selected.trialDays} dias grátis`}
            variant="primary"
            loading={purchasing}
            onPress={handlePurchase}
          />
          <Text className="mt-3 text-center text-xs leading-4 text-ink-400">
            Após o teste, {selected.priceLabel}. Renovação automática pela App Store / Google Play.
          </Text>
          <Pressable onPress={handleRestore} disabled={restoring} className="mt-2 py-1">
            <Text className="text-center text-sm font-bold text-hero-500">
              {restoring ? 'Restaurando…' : 'Restaurar compras'}
            </Text>
          </Pressable>
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
          <Text className="text-sm text-ink-600">{plan.priceLabel}</Text>
        </View>
        <Text style={{ fontFamily: FONTS.display, fontSize: 17, color: COLORS.ink }}>{plan.pricePerMonthLabel}</Text>
      </View>
    </Pressable>
  );
}
