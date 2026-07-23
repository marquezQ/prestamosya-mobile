import { Tabs } from "expo-router";
import { Home, Users, Banknote, BarChart2 } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import { getThemeColors } from "@/lib/theme";

import { HeaderLogo } from "@/components/navigation/HeaderLogo";
import { HeaderActions } from "@/components/navigation/HeaderActions";
import { TabBarFAB } from "@/components/navigation/TabBarFAB";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const colors = getThemeColors(colorScheme);

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
        },
        headerTitle: () => <HeaderLogo />,
        headerRight: () => <HeaderActions />,
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: {
          paddingBottom: 5 + insets.bottom,
          paddingTop: 5,
          height: 60 + insets.bottom,
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, size }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="clients"
        options={{
          title: "Clientes",
          tabBarIcon: ({ color, size }) => (
            <Users size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="new"
        options={{
          title: "Nuevo",
          tabBarIcon: ({ size }) => <TabBarFAB size={size} />,
          tabBarLabelStyle: {
            marginTop: 0.5,
          },
        }}
      />
      <Tabs.Screen
        name="collections"
        options={{
          title: "Cobros",
          tabBarIcon: ({ color, size }) => (
            <Banknote size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="summary"
        options={{
          title: "Resumen",
          tabBarIcon: ({ color, size }) => (
            <BarChart2 size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
