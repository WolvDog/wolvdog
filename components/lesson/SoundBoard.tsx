import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { Square, Volume1, Volume2 } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { COLORS, FONTS } from '@/constants/theme';
import { tap } from '@/services/haptics';
import type { TrainingSound } from '@/types';

const SOURCES: Record<TrainingSound, number> = {
  fogos: require('@/assets/sounds/fogos.wav'),
  rojao: require('@/assets/sounds/rojao.wav'),
  trovao: require('@/assets/sounds/trovao.wav'),
};

const LABELS: Record<TrainingSound, { emoji: string; label: string }> = {
  fogos: { emoji: '🎆', label: 'Fogos' },
  rojao: { emoji: '💥', label: 'Rojão' },
  trovao: { emoji: '⛈️', label: 'Trovão' },
};

/** Nível 1 é quase um sussurro: a dessensibilização começa abaixo do limiar de medo. */
const VOLUME_LEVELS = [0.04, 0.1, 0.22, 0.45, 0.85];

/**
 * Painel de sons para treino de dessensibilização: o tutor toca o som baixinho
 * e entrega petisco, subindo o volume só quando o cão continua tranquilo.
 */
export function SoundBoard({ sounds }: { sounds: TrainingSound[] }) {
  const fogos = useAudioPlayer(SOURCES.fogos);
  const rojao = useAudioPlayer(SOURCES.rojao);
  const trovao = useAudioPlayer(SOURCES.trovao);
  const players = { fogos, rojao, trovao };
  // O botão volta a "tocar" sozinho quando o som termina.
  const status = { fogos: useAudioPlayerStatus(fogos), rojao: useAudioPlayerStatus(rojao), trovao: useAudioPlayerStatus(trovao) };
  const playing = (Object.keys(status) as TrainingSound[]).find((s) => status[s].playing) ?? null;

  const [level, setLevel] = useState(0);

  const stopAll = () => {
    for (const p of Object.values(players)) p.pause();
  };

  const play = (sound: TrainingSound) => {
    tap();
    stopAll();
    const player = players[sound];
    player.volume = VOLUME_LEVELS[level]!;
    player.seekTo(0);
    player.play();
  };

  const changeLevel = (next: number) => {
    tap();
    setLevel(next);
    if (playing) players[playing].volume = VOLUME_LEVELS[next]!;
  };

  return (
    <View className="mt-5 rounded-xl border-2 border-ink-900 bg-white p-4">
      <Text style={{ fontFamily: FONTS.display, fontSize: 18, color: COLORS.ink }}>🔊 SONS DO TREINO</Text>
      <Text className="mt-1 text-xs leading-4 text-ink-600">
        Comece no nível 1. Suba um nível só quando o cão continuar comendo tranquilo.
      </Text>

      <View className="mt-3 flex-row items-center">
        <Volume1 size={18} color={COLORS.inkSoft} />
        <View className="mx-2 flex-1 flex-row gap-1.5">
          {VOLUME_LEVELS.map((_, i) => (
            <Pressable
              key={i}
              onPress={() => changeLevel(i)}
              accessibilityRole="button"
              accessibilityLabel={`Volume nível ${i + 1}`}
              accessibilityState={{ selected: level === i }}
              className="flex-1 items-center rounded-md border-2 py-1.5"
              style={{
                borderColor: COLORS.ink,
                backgroundColor: i <= level ? COLORS.claw : COLORS.white,
              }}
            >
              <Text style={{ fontFamily: FONTS.display, fontSize: 14, color: COLORS.ink }}>{i + 1}</Text>
            </Pressable>
          ))}
        </View>
        <Volume2 size={18} color={COLORS.inkSoft} />
      </View>

      <View className="mt-3 flex-row gap-2">
        {sounds.map((s) => {
          const active = playing === s;
          return (
            <Pressable
              key={s}
              onPress={() => (active ? stopAll() : play(s))}
              accessibilityRole="button"
              accessibilityLabel={active ? `Parar ${LABELS[s].label}` : `Tocar ${LABELS[s].label}`}
              className="flex-1 items-center rounded-xl border-2 border-ink-900 py-3"
              style={{ backgroundColor: active ? COLORS.hero : COLORS.heroLight }}
            >
              {active ? <Square size={22} color={COLORS.white} fill={COLORS.white} /> : <Text style={{ fontSize: 24 }}>{LABELS[s].emoji}</Text>}
              <Text className="mt-1 text-xs font-bold" style={{ color: active ? COLORS.white : COLORS.hero }}>
                {active ? 'Parar' : LABELS[s].label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
