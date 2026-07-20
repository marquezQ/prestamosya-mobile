import { router } from "expo-router";
import { View, Button, Text, Image } from "react-native";

export default function LoginScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 20 }}>
      <Image 
        source={require("../../assets/prestamosYA.jpeg")} 
        style={{ width: 250, height: 250, borderRadius: 20 }} 
        resizeMode="contain"
      />
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Login de prueba</Text>
      <Button 
        title="Ingresar" 
        onPress={() => router.replace("/(app)/(tabs)/home")} 
      />
    </View>
  );
}
