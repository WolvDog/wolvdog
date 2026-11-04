import { useVideoPlayer, VideoView } from 'expo-video';
import LottieView from 'lottie-react-native';
import { Text, View } from 'react-native';

import type { DemoMedia as DemoMediaData } from '@/types';

/**
 * Demonstração do movimento do comando na etapa "Hora do treino":
 * animação Lottie ou vídeo curto em loop, sem som e sem controles.
 * (Versão web em DemoMedia.web.tsx.)
 */
export function DemoMedia({ media }: { media: DemoMediaData }) {
  const aspectRatio = media.aspectRatio ?? (media.type === 'lottie' ? 1 : 16 / 9);

  return (
    <View className="mt-5 overflow-hidden rounded-xl border-2 border-ink-900 bg-white">
      <View style={{ width: '100%', aspectRatio }}>
        {media.type === 'lottie' ? (
          <LottieView
            source={typeof media.source === 'string' ? { uri: media.source } : media.source}
            autoPlay
            loop
            style={{ width: '100%', height: '100%' }}
          />
        ) : (
          <LoopingVideo source={media.source} />
        )}
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
