import { Text, View } from 'react-native';

import type { LoganMood } from '@/types';

import { Logan } from './Logan';

interface LoganSaysProps {
  text: string;
  mood?: LoganMood;
  size?: number;
  /** "left": Logan à esquerda do balão (padrão). "top": Logan em cima, balão embaixo. */
  layout?: 'left' | 'top';
  animated?: boolean;
}

/** Avatar do Logan + balão de fala. */
export function LoganSays({ text, mood = 'happy', size = 76, layout = 'left', animated = true }: LoganSaysProps) {
  if (layout === 'top') {
    return (
      <View className="items-center">
        <Logan size={size} mood={mood} animated={animated} />
        <View className="mt-2 rounded-2xl border-2 border-gray-200 bg-white px-4 py-3">
          <View className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-2 rotate-45 border-l-2 border-t-2 border-gray-200 bg-white" />
          <Text className="text-center text-base leading-6 text-ink-900">{text}</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-row items-end">
      <Logan size={size} mood={mood} animated={animated} />
      <View className="ml-3 flex-1 rounded-2xl border-2 border-gray-200 bg-white px-4 py-3">
        <View className="absolute -left-2 bottom-5 h-4 w-4 rotate-45 border-b-2 border-l-2 border-gray-200 bg-white" />
        <Text className="text-[15px] leading-6 text-ink-900">{text}</Text>
      </View>
    </View>
  );
}
