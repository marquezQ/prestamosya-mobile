import { Tabs, useRouter } from "expo-router";
import { View } from "react-native";
import { Home, Users, Banknote, BarChart2 } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import { getThemeColors } from "@/lib/theme";

import { HeaderLogo } from "@/components/navigation/HeaderLogo";
import { HeaderActions } from "@/components/navigation/HeaderActions";
import { TabBarFAB } from "@/components/navigation/TabBarFAB";

function TabIcon({ Icon, color, size, focused }: { Icon: any; color: string; size: number; focused: boolean }) {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 5,
        paddingHorizontal: 16,
        borderRadius: 24,
        backgroundColor: focused ? `${color}15` : "transparent",
      }}
    >
      <Icon size={size + 2} color={color} strokeWidth={focused ? 2.5 : 2} />
    </View>
  );
}

export default function TabsLayout() {
  const router = useRouter();
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
          paddingBottom: 8 + insets.bottom,
          paddingTop: 8,
          height: 68 + insets.bottom,
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon Icon={Home} color={color} size={size} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="clients"
        options={{
          title: "Clientes",
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon Icon={Users} color={color} size={size} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="new"
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push("/(app)/loan/new");
          },
        }}
        options={{
          title: "Nuevo",
          tabBarIcon: ({ size }) => <TabBarFAB size={size} />,
          tabBarLabelStyle: {
            marginTop: 2,
            fontSize: 11,
            fontWeight: "600",
          },
        }}
      />
      <Tabs.Screen
        name="collections"
        options={{
          title: "Cobros",
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon Icon={Banknote} color={color} size={size} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="summary"
        options={{
          title: "Resumen",
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon Icon={BarChart2} color={color} size={size} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
