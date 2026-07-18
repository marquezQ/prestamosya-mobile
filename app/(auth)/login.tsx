import { router } from "expo-router";
import { View, Button, Text } from "react-native";

export default function LoginScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Login de prueba</Text>
      <Button 
        title="Ingresar" 
        onPress={() => router.replace("/(app)/(tabs)/home")} 
      />
    </View>
  );
}
