import { router } from "expo-router";
import { View, Button, Text, Image } from "react-native";

export default function LoginScreen() {
  return (
    <View className="flex-1 justify-center items-center gap-5 bg-background">
      <Image 
        source={require("../../assets/prestamosYA.jpeg")} 
        className="w-[250px] h-[250px] rounded-2xl" 
        resizeMode="contain"
      />
      <Text className="text-2xl font-bold text-foreground">Login de prueba</Text>
      <Button 
        title="Ingresar" 
        onPress={() => router.replace("/(app)/(tabs)/home")} 
      />
    </View>
  );
}
