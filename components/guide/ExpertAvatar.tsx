import { Stethoscope } from 'lucide-react-native';
import { Image, View } from 'react-native';

import { COLORS } from '@/constants/theme';
import type { Expert } from '@/types';

/**
 * Avatar da especialista: a foto/ilustração cadastrada no Supabase (avatar_url) ou,
 * sem cadastro, um selo genérico de veterinária no estilo quadrinhos do app.
 */
export function ExpertAvatar({ expert, size = 56 }: { expert: Expert | null; size?: number }) {
  const radius = size * 0.28;
  return (
    <View
      className="items-center justify-center overflow-hidden border-[2.5px] border-ink-900"
      style={{ width: size, height: size, borderRadius: radius, backgroundColor: COLORS.splash }}
    >
      {expert?.avatarUrl ? (
        <Image source={{ uri: expert.avatarUrl }} style={{ width: size, height: size }} resizeMode="cover" />
      ) : (
        <Stethoscope size={size * 0.52} color={COLORS.white} strokeWidth={2.5} />
      )}
    </View>
  );
}
