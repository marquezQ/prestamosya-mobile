import { Tabs } from "expo-router";
import { Home, Users, PlusCircle, Banknote, BarChart2 } from "lucide-react-native";
import { View, Text, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitle: () => (
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "#0047AB" }}>
            PrestamosYA
          </Text>
        ),
        headerRight: () => (
          <View style={{ marginRight: 15 }}>
            <Image
              source={{ uri: "https://i.pravatar.cc/100?img=11" }}
              style={{ width: 35, height: 35, borderRadius: 20 }}
            />
          </View>
        ),
        tabBarActiveTintColor: "#0047AB",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          paddingBottom: 5 + insets.bottom,
          paddingTop: 5,
          height: 60 + insets.bottom,
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
          tabBarIcon: ({ color, size }) => (
            <PlusCircle size={size} color={color} />
          ),
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
