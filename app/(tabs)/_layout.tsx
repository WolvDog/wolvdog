import { Tabs } from 'expo-router';
import { Map, PawPrint } from 'lucide-react-native';

import { COLORS } from '@/constants/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.akita,
        tabBarInactiveTintColor: COLORS.lockedDark,
        tabBarLabelStyle: { fontWeight: '800', fontSize: 12 },
        tabBarStyle: { borderTopWidth: 2, borderTopColor: '#F0F0F0', height: 64, paddingTop: 6 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Trilha', tabBarIcon: ({ color, size }) => <Map color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Meu Pet', tabBarIcon: ({ color, size }) => <PawPrint color={color} size={size} /> }}
      />
    </Tabs>
  );
}
