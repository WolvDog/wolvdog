import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { COLORS } from '@/constants/theme';
import { lookupPartner, normalizePartnerCode, type Partner } from '@/services/partners';

import { TextField } from './form';

const MIN_LENGTH = 4;

/**
 * Campo de código de parceiro: aceita só caixa alta, consulta o parceiro (com atraso
 * para não buscar a cada tecla) e avisa quem indicou e qual é o benefício.
 */
export function PartnerCodeField({ onChange }: { onChange: (partner: Partner | null) => void }) {
  const [input, setInput] = useState('');
  const [partner, setPartner] = useState<Partner | null>(null);
  const [status, setStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle');
  // Guarda o callback mais recente: só a digitação deve disparar uma nova busca.
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (input.length < MIN_LENGTH) {
      setStatus('idle');
      setPartner(null);
      onChangeRef.current(null);
      return;
    }
    let cancelled = false;
    setStatus('checking');
    const id = setTimeout(async () => {
      const found = await lookupPartner(input);
      if (cancelled) return;
      setPartner(found);
      setStatus(found ? 'valid' : 'invalid');
      onChangeRef.current(found);
    }, 500);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [input]);

  return (
    <View>
      <TextField
        value={input}
        onChangeText={(t) => setInput(normalizePartnerCode(t))}
        placeholder="Ex: AUAU"
        autoCapitalize="characters"
        autoCorrect={false}
      />
      {status === 'checking' && (
        <View className="mt-2 flex-row items-center">
          <ActivityIndicator size="small" color={COLORS.hero} />
          <Text className="ml-2 text-xs text-ink-400">Conferindo o código…</Text>
        </View>
      )}
      {status === 'valid' && partner && (
        <View className="mt-2 rounded-lg border-2 border-ink-900 bg-claw-100 p-3">
          <Text className="text-sm font-bold text-ink-900">🎁 {partner.name}</Text>
          <Text className="text-xs text-ink-600">Benefício no Pro: {partner.perk}</Text>
        </View>
      )}
      {status === 'invalid' && (
        <Text className="mt-2 text-xs" style={{ color: COLORS.danger }}>
          Código não encontrado. Confira com quem te indicou.
        </Text>
      )}
    </View>
  );
}
