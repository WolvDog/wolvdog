import { useVideoPlayer, VideoView } from 'expo-video';
import { Text, View } from 'react-native';

import type { DemoMedia as DemoMediaData } from '@/types';

/**
 * Versão web da demonstração: o lottie-react-native no navegador exige um pacote extra
 * (@lottiefiles/dotlottie-react), então aqui só os vídeos são exibidos.
 */
export function DemoMedia({ media }: { media: DemoMediaData }) {
  if (media.type === 'lottie') {
    return (
      <View className="mt-5 rounded-xl border-2 border-dashed border-gray-300 p-4">
        <Text className="text-center text-xs text-ink-400">🎬 Animação disponível no app do celular.</Text>
      </View>
    );
  }
  return (
    <View className="mt-5 overflow-hidden rounded-xl border-2 border-ink-900 bg-white">
      <View style={{ width: '100%', aspectRatio: media.aspectRatio ?? 16 / 9 }}>
        <LoopingVideo source={media.source} />
      </View>
      {media.caption ? <Text className="border-t border-gray-100 px-3 py-2 text-xs text-ink-600">🎬 {media.caption}</Text> : null}
    </View>
  );
}

function LoopingVideo({ source }: { source: number | string }) {
  const player = useVideoPlayer(source, (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });
  return <VideoView player={player} style={{ width: '100%', height: '100%' }} contentFit="cover" nativeControls={false} />;
}
