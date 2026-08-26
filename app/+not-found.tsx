import { Link, Stack } from "expo-router";
import { View, Text } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Página no encontrada", headerShown: true }} />
      <View className="flex-1 items-center justify-center p-5 bg-background">
        <Text className="text-xl font-bold text-foreground">Esta pantalla no existe.</Text>
        <Link href="/(app)/(tabs)/home" className="mt-4 py-2">
          <Text className="text-primary text-base font-semibold">Volver al inicio</Text>
        </Link>
      </View>
    </>
  );
}
