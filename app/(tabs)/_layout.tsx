import { Tabs } from 'expo-router';
import { BookHeart, Map, PawPrint } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS, FONTS } from '@/constants/theme';

export default function TabsLayout() {
  // Altura fixa tira o ajuste automático: soma o espaço dos botões/gestos do Android e da barra do iPhone.
  const { bottom } = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.hero,
        tabBarInactiveTintColor: COLORS.lockedDark,
        tabBarLabelStyle: { fontFamily: FONTS.displayMedium, fontSize: 12, letterSpacing: 0.5 },
        tabBarStyle: { borderTopWidth: 2, borderTopColor: COLORS.ink, height: 64 + bottom, paddingTop: 6, paddingBottom: bottom + 6 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Missões', tabBarIcon: ({ color, size }) => <Map color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="guide"
        options={{ title: 'Guia', tabBarIcon: ({ color, size }) => <BookHeart color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Meu Pet', tabBarIcon: ({ color, size }) => <PawPrint color={color} size={size} /> }}
      />
    </Tabs>
  );
}
