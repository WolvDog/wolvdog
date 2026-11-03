import { Tabs } from 'expo-router';
import { Map, PawPrint } from 'lucide-react-native';

import { COLORS, FONTS } from '@/constants/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.hero,
        tabBarInactiveTintColor: COLORS.lockedDark,
        tabBarLabelStyle: { fontFamily: FONTS.displayMedium, fontSize: 12, letterSpacing: 0.5 },
        tabBarStyle: { borderTopWidth: 2, borderTopColor: COLORS.ink, height: 64, paddingTop: 6 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Missões', tabBarIcon: ({ color, size }) => <Map color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Meu Pet', tabBarIcon: ({ color, size }) => <PawPrint color={color} size={size} /> }}
      />
    </Tabs>
  );
}
