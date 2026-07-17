import "./global.css";

import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-blue-500">
        🎉 NativeWind está funcionando!
      </Text>
      <Text className="mt-2 text-sm text-gray-500">
        PrestamosYA Mobile — Expo SDK 54 + NativeWind v4
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}
