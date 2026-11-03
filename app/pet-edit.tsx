import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { Camera, X } from 'lucide-react-native';
import { type ComponentProps, type ReactNode, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChunkyButton } from '@/components/ChunkyButton';
import { LoganSays } from '@/components/LoganSays';
import { CHALLENGE_LABELS, PET_SIZE_LABELS } from '@/constants/labels';
import { COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import type { BehaviorChallenge, PetSize } from '@/types';

const SIZES = Object.keys(PET_SIZE_LABELS) as PetSize[];
const CHALLENGES = Object.keys(CHALLENGE_LABELS) as BehaviorChallenge[];

export default function PetEditScreen() {
  const pet = useAppStore((s) => s.pet);
  const savePet = useAppStore((s) => s.savePet);

  const [name, setName] = useState(pet?.name ?? '');
  const [breed, setBreed] = useState(pet?.breed ?? '');
  const [years, setYears] = useState(pet ? String(Math.floor(pet.ageMonths / 12)) : '');
  const [months, setMonths] = useState(pet ? String(pet.ageMonths % 12) : '');
  const [size, setSize] = useState<PetSize>(pet?.size ?? 'medio');
  const [challenges, setChallenges] = useState<BehaviorChallenge[]>(pet?.challenges ?? []);
  const [photoUri, setPhotoUri] = useState(pet?.photoUri);

  const ageMonths = (parseInt(years, 10) || 0) * 12 + (parseInt(months, 10) || 0);
  const canSave = name.trim().length > 0 && breed.trim().length > 0;

  async function pickPhoto() {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!res.canceled && res.assets[0]) setPhotoUri(res.assets[0].uri);
  }

  function toggleChallenge(c: BehaviorChallenge) {
    setChallenges((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  }

  function handleSave() {
    savePet({ id: pet?.id, name: name.trim(), breed: breed.trim(), ageMonths, size, challenges, photoUri });
    router.back();
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-4 py-3">
        <Text className="text-lg font-extrabold text-ink-900">{pet ? 'Editar perfil' : 'Cadastrar pet'}</Text>
        <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Fechar" hitSlop={12}>
          <X size={26} color={COLORS.lockedDark} strokeWidth={3} />
        </Pressable>
      </View>

      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
          <LoganSays
            size={64}
            mood="happy"
            text="Me conta tudo sobre seu parceiro! Assim eu personalizo as dicas pra ele."
          />

          <Pressable onPress={pickPhoto} className="mt-6 items-center" accessibilityRole="button" accessibilityLabel="Escolher foto">
            <View className="h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-dashed border-akita-300 bg-akita-50">
              {photoUri ? <Image source={{ uri: photoUri }} className="h-full w-full" /> : <Camera size={32} color={COLORS.akita} />}
            </View>
            <Text className="mt-2 text-sm font-bold text-akita-600">{photoUri ? 'Trocar foto' : 'Adicionar foto'}</Text>
          </Pressable>

          <Field label="Nome">
            <Input value={name} onChangeText={setName} placeholder="Ex.: Thor" />
          </Field>
          <Field label="Raça">
            <Input value={breed} onChangeText={setBreed} placeholder="Ex.: Akita Inu, SRD…" />
          </Field>
          <Field label="Idade">
            <View className="flex-row gap-3">
              <View className="flex-1">
                <Input value={years} onChangeText={setYears} placeholder="0" keyboardType="number-pad" suffix="anos" />
              </View>
              <View className="flex-1">
                <Input value={months} onChangeText={setMonths} placeholder="0" keyboardType="number-pad" suffix="meses" />
              </View>
            </View>
          </Field>

          <Field label="Porte">
            <View className="flex-row flex-wrap gap-2">
              {SIZES.map((s) => (
                <Chip key={s} label={PET_SIZE_LABELS[s]} active={size === s} onPress={() => setSize(s)} />
              ))}
            </View>
          </Field>

          <Field label="Desafios de comportamento">
            <View className="flex-row flex-wrap gap-2">
              {CHALLENGES.map((c) => (
                <Chip
                  key={c}
                  label={`${CHALLENGE_LABELS[c].emoji} ${CHALLENGE_LABELS[c].label}`}
                  active={challenges.includes(c)}
                  onPress={() => toggleChallenge(c)}
                />
              ))}
            </View>
          </Field>
        </ScrollView>

        <View className="border-t-2 border-gray-100 px-5 py-4">
          <ChunkyButton label="Salvar" disabled={!canSave} onPress={handleSave} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View className="mt-5">
      <Text className="mb-2 text-sm font-extrabold uppercase tracking-wide text-ink-400">{label}</Text>
      {children}
    </View>
  );
}

function Input({ suffix, ...props }: ComponentProps<typeof TextInput> & { suffix?: string }) {
  return (
    <View className="flex-row items-center rounded-2xl border-2 border-gray-200 bg-cloud px-4">
      <TextInput className="flex-1 py-3.5 text-base text-ink-900" placeholderTextColor={COLORS.lockedDark} {...props} />
      {suffix && <Text className="ml-2 font-bold text-ink-400">{suffix}</Text>}
    </View>
  );
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: active }}
      className="rounded-full border-2 px-3.5 py-2"
      style={{ borderColor: active ? COLORS.ice : '#E5E5E5', backgroundColor: active ? '#DDF4FF' : '#FFFFFF' }}
    >
      <Text className="text-sm font-bold" style={{ color: active ? COLORS.ice : COLORS.inkSoft }}>
        {label}
      </Text>
    </Pressable>
  );
}
