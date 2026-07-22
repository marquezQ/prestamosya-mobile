import { Tabs } from "expo-router";
import { Home, Users, Plus, Banknote, BarChart2, Sun, Moon } from "lucide-react-native";
import { View, Text, Image, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import { Icon } from "@/components/ui/icon";
import { getThemeColors, palette } from "@/lib/theme";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const colors = getThemeColors(colorScheme);

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
        },
        headerTitle: () => (
          <View className="flex-row items-center gap-2 pl-2">
            <Image
              source={require("../../../assets/LogoP.png")}
              style={{ width: 32, height: 32 }}
              resizeMode="contain"
            />
            <Text className="text-xl font-bold text-secondary dark:text-primary">
              PrestamosYA
            </Text>
          </View>
        ),
        headerRight: () => (
          <View className="flex-row items-center gap-4 pr-4">
            <Pressable
              onPress={toggleColorScheme}
              className="rounded-full bg-muted p-2"
            >
              <Icon
                as={colorScheme === "dark" ? Sun : Moon}
                className="text-foreground"
                size={20}
              />
            </Pressable>
            <Image
              source={{ uri: "https://i.pravatar.cc/100?img=11" }}
              style={{ width: 36, height: 36, borderRadius: 18 }}
            />
          </View>
        ),
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
          tabBarIcon: ({ size }) => (
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: palette.verde,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <Plus size={size + 2} color={palette.celeste} strokeWidth={2.5} />
            </View>
          ),
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
