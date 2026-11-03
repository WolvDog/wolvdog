import { Crown, Lock } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import type { Module, NodeStatus } from '@/types';

interface ModuleBannerProps {
  module: Module;
  status: NodeStatus;
  requiresPro: boolean;
  completedCount: number;
  onPressLocked?: () => void;
}

/** Cabeçalho colorido de cada fase da trilha. */
export function ModuleBanner({ module, status, requiresPro, completedCount, onPressLocked }: ModuleBannerProps) {
  const locked = status === 'locked';
  const bg = locked ? '#AFAFAF' : module.color;
  const shadow = locked ? '#8A8A8A' : module.colorDark;

  return (
    <Pressable onPress={locked ? onPressLocked : undefined} disabled={!locked} className="mx-4 mb-4 mt-6">
      <View style={{ backgroundColor: shadow, borderRadius: 18, paddingBottom: 5 }}>
        <View className="rounded-[18px] px-5 py-4" style={{ backgroundColor: bg }}>
          <View className="flex-row items-center justify-between">
            <Text className="text-xs font-extrabold uppercase tracking-widest text-white/80">{module.subtitle}</Text>
            {requiresPro ? (
              <View className="flex-row items-center rounded-full bg-white/25 px-2.5 py-1">
                <Crown size={13} color="#FFFFFF" fill="#FFFFFF" />
                <Text className="ml-1 text-xs font-extrabold text-white">PRO</Text>
              </View>
            ) : locked ? (
              <Lock size={16} color="#FFFFFF" />
            ) : (
              <Text className="text-xs font-extrabold text-white">
                {completedCount}/{module.lessons.length}
              </Text>
            )}
          </View>
          <Text className="mt-1 text-xl font-extrabold text-white">{module.title}</Text>
          <Text className="mt-1 text-sm leading-5 text-white/90">{module.description}</Text>
        </View>
      </View>
    </Pressable>
  );
}
