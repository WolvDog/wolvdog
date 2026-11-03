import { Crown, Lock } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { COLORS, FONTS } from '@/constants/theme';
import type { Module, NodeStatus } from '@/types';

import { ClawMarks } from './icons';

interface ModuleBannerProps {
  module: Module;
  status: NodeStatus;
  requiresPro: boolean;
  completedCount: number;
  onPressLocked?: () => void;
}

/** Cabeçalho de cada fase: cartão preto com faixa lateral na cor da fase. */
export function ModuleBanner({ module, status, requiresPro, completedCount, onPressLocked }: ModuleBannerProps) {
  const locked = status === 'locked';
  const accent = locked ? COLORS.lockedDark : module.color;

  return (
    <Pressable onPress={locked ? onPressLocked : undefined} disabled={!locked} className="mx-4 mb-2 mt-8">
      <View className="flex-row overflow-hidden rounded-xl border-2 border-ink-900 bg-ink-900">
        <View style={{ width: 10, backgroundColor: accent }} />
        <View className="flex-1 px-4 py-3.5">
          <View className="flex-row items-center justify-between">
            <Text style={{ fontFamily: FONTS.display, fontSize: 13, letterSpacing: 2, color: accent }}>
              {module.subtitle.toUpperCase()}
            </Text>
            {requiresPro ? (
              <View className="flex-row items-center rounded-md bg-claw-500 px-2 py-0.5">
                <Crown size={12} color={COLORS.ink} fill={COLORS.ink} />
                <Text className="ml-1 text-xs font-bold text-ink-900">PRO</Text>
              </View>
            ) : locked ? (
              <Lock size={15} color={COLORS.lockedDark} />
            ) : (
              <View className="flex-row items-center">
                <ClawMarks size={14} />
                <Text className="ml-1 text-xs font-bold text-white">
                  {completedCount}/{module.lessons.length}
                </Text>
              </View>
            )}
          </View>
          <Text style={{ fontFamily: FONTS.display, fontSize: 22, color: COLORS.white, marginTop: 2 }}>{module.title}</Text>
          <Text className="mt-0.5 text-sm leading-5 text-white/70">{module.description}</Text>
        </View>
      </View>
    </Pressable>
  );
}
