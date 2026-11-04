import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { Camera, X } from 'lucide-react-native';
import { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Chip, Field, TextField } from '@/components/form';
import { HeroButton } from '@/components/HeroButton';
import { LoganSays } from '@/components/LoganSays';
import { CHALLENGE_LABELS, PET_SEX_LABELS, PET_SIZE_LABELS } from '@/constants/labels';
import { COLORS, FONTS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import type { BehaviorChallenge, PetSex, PetSize } from '@/types';

const SIZES = Object.keys(PET_SIZE_LABELS) as PetSize[];
const CHALLENGES = Object.keys(CHALLENGE_LABELS) as BehaviorChallenge[];

export default function PetEditScreen() {
  const pet = useAppStore((s) => s.pet);
  const savePet = useAppStore((s) => s.savePet);

  const [name, setName] = useState(pet?.name ?? '');
  const [breed, setBreed] = useState(pet?.breed ?? '');
  const [years, setYears] = useState(pet ? String(Math.floor(pet.ageMonths / 12)) : '');
  const [months, setMonths] = useState(pet ? String(pet.ageMonths % 12) : '');
  const [weight, setWeight] = useState(pet?.weightKg ? String(pet.weightKg).replace('.', ',') : '');
  const [size, setSize] = useState<PetSize>(pet?.size ?? 'medio');
  const [sex, setSex] = useState<PetSex | undefined>(pet?.sex);
  const [challenges, setChallenges] = useState<BehaviorChallenge[]>(pet?.challenges ?? []);
  const [photoUri, setPhotoUri] = useState(pet?.photoUri);

  const ageMonths = (parseInt(years, 10) || 0) * 12 + (parseInt(months, 10) || 0);
  const weightKg = parseFloat(weight.replace(',', '.'));
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
    savePet({
      id: pet?.id,
      name: name.trim(),
      breed: breed.trim(),
      ageMonths,
      size,
      sex,
      weightKg: weightKg > 0 ? weightKg : undefined,
      challenges,
      photoUri,
    });
    router.back();
  }

  return (
    <SafeAreaView className="flex-1 bg-cloud">
      <View className="flex-row items-center justify-between border-b-2 border-ink-900 bg-white px-4 py-3">
        <Text style={{ fontFamily: FONTS.display, fontSize: 20, color: COLORS.ink }}>
          {pet ? 'EDITAR PERFIL' : 'CADASTRAR PET'}
        </Text>
        <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Fechar" hitSlop={12}>
          <X size={26} color={COLORS.ink} strokeWidth={3} />
        </Pressable>
      </View>

      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
          <LoganSays size={64} mood="happy" text="Me conta tudo sobre seu parceiro! Assim eu personalizo as missões pra ele." />

          <Pressable onPress={pickPhoto} className="mt-6 items-center" accessibilityRole="button" accessibilityLabel="Escolher foto">
            <View className="h-28 w-28 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-ink-900 bg-white">
              {photoUri ? <Image source={{ uri: photoUri }} className="h-full w-full" /> : <Camera size={32} color={COLORS.ink} />}
            </View>
            <Text className="mt-2 text-sm font-bold text-hero-500">{photoUri ? 'Trocar foto' : 'Adicionar foto'}</Text>
          </Pressable>

          <Field label="Nome">
            <TextField value={name} onChangeText={setName} placeholder="Ex: Mel" />
          </Field>
          <Field label="Sexo">
            <View className="flex-row gap-2">
              {(Object.keys(PET_SEX_LABELS) as PetSex[]).map((sx) => (
                <Chip key={sx} label={`${PET_SEX_LABELS[sx].emoji} ${PET_SEX_LABELS[sx].label}`} active={sex === sx} onPress={() => setSex(sx)} />
              ))}
            </View>
          </Field>
          <Field label="Raça">
            <TextField value={breed} onChangeText={setBreed} placeholder="Ex: Akita Inu, SRD…" />
          </Field>
          <Field label="Idade">
            <View className="flex-row gap-3">
              <View className="flex-1">
                <TextField value={years} onChangeText={setYears} placeholder="0" keyboardType="number-pad" suffix="anos" />
              </View>
              <View className="flex-1">
                <TextField value={months} onChangeText={setMonths} placeholder="0" keyboardType="number-pad" suffix="meses" />
              </View>
            </View>
          </Field>
          <Field label="Peso">
            <TextField value={weight} onChangeText={setWeight} placeholder="Ex: 12,5" keyboardType="decimal-pad" suffix="kg" />
          </Field>

          <Field label="Porte">
            <View className="flex-row flex-wrap gap-2">
              {SIZES.map((s) => (
                <Chip key={s} label={PET_SIZE_LABELS[s]} active={size === s} onPress={() => setSize(s)} />
              ))}
            </View>
          </Field>

          <Field label="Foco do treinamento">
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

        <View className="border-t-2 border-ink-900 bg-white px-5 py-4">
          <HeroButton label="Salvar" disabled={!canSave} onPress={handleSave} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
