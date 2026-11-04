import DateTimePicker, { DateTimePickerAndroid, type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Clock } from 'lucide-react-native';
import { useState } from 'react';
import { Modal, Platform, Pressable, Text, TextInput, View } from 'react-native';

import { COLORS, FONTS } from '@/constants/theme';
import { formatTime } from '@/services/notifications';

import { HeroButton } from './HeroButton';

interface TimePickerButtonProps {
  hour: number;
  minute: number;
  /** Destaca o botão quando o horário atual é personalizado. */
  active: boolean;
  onChange: (time: { hour: number; minute: number }) => void;
}

function toDate(hour: number, minute: number): Date {
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  return d;
}

/**
 * "Outro horário": abre o seletor nativo de horas (Android: diálogo; iOS: roda em um modal).
 * No navegador, cai para um campo HH:MM.
 */
export function TimePickerButton({ hour, minute, active, onChange }: TimePickerButtonProps) {
  const [iosOpen, setIosOpen] = useState(false);
  const [draft, setDraft] = useState(toDate(hour, minute));
  const [webValue, setWebValue] = useState(formatTime(hour, minute));

  function open() {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: toDate(hour, minute),
        mode: 'time',
        is24Hour: true,
        onChange: (event: DateTimePickerEvent, date?: Date) => {
          if (event.type === 'set' && date) onChange({ hour: date.getHours(), minute: date.getMinutes() });
        },
      });
    } else if (Platform.OS === 'ios') {
      setDraft(toDate(hour, minute));
      setIosOpen(true);
    }
  }

  const label = active ? `⏰ ${formatTime(hour, minute)}` : '⏰ Outro horário';

  if (Platform.OS === 'web') {
    return (
      <View
        className="flex-row items-center rounded-lg border-2 px-3"
        style={{ borderColor: active ? COLORS.ink : '#D5D8DE', backgroundColor: active ? COLORS.claw : COLORS.white }}
      >
        <Clock size={14} color={COLORS.ink} />
        <TextInput
          value={webValue}
          onChangeText={(t) => {
            setWebValue(t);
            const m = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec(t);
            if (m) onChange({ hour: Number(m[1]), minute: Number(m[2]) });
          }}
          placeholder="HH:MM"
          maxLength={5}
          style={{ width: 64, paddingVertical: 8, marginLeft: 6, fontWeight: '700', outlineWidth: 0 }}
        />
      </View>
    );
  }

  return (
    <>
      <Pressable
        onPress={open}
        accessibilityRole="button"
        accessibilityLabel="Escolher outro horário"
        className="rounded-lg border-2 px-3 py-2"
        style={{ borderColor: active ? COLORS.ink : '#D5D8DE', backgroundColor: active ? COLORS.claw : COLORS.white }}
      >
        <Text className="text-sm font-bold" style={{ color: active ? COLORS.ink : COLORS.inkSoft }}>
          {label}
        </Text>
      </Pressable>

      {Platform.OS === 'ios' && (
        <Modal visible={iosOpen} transparent animationType="slide" onRequestClose={() => setIosOpen(false)}>
          <View className="flex-1 justify-end bg-black/40">
            <View className="rounded-t-2xl border-t-2 border-ink-900 bg-white px-5 pb-8 pt-4">
              <Text style={{ fontFamily: FONTS.display, fontSize: 20, color: COLORS.ink }}>HORÁRIO DO LEMBRETE</Text>
              <DateTimePicker
                value={draft}
                mode="time"
                display="spinner"
                is24Hour
                locale="pt-BR"
                onChange={(_e, date) => date && setDraft(date)}
              />
              <HeroButton
                label="Confirmar"
                onPress={() => {
                  onChange({ hour: draft.getHours(), minute: draft.getMinutes() });
                  setIosOpen(false);
                }}
              />
            </View>
          </View>
        </Modal>
      )}
    </>
  );
}
