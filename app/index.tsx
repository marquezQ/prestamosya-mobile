import { useEffect, useState } from "react";
import { View, ActivityIndicator, Image } from "react-native";
import { Redirect } from "expo-router";
import { useAuthStore } from "@/stores/authStore";

export default function Index() {
  const { isHydrated, isAuthenticated } = useAuthStore();
  const [isMinSplashDone, setIsMinSplashDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMinSplashDone(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const isReady = isHydrated && isMinSplashDone;

  if (!isReady) {
    return (
      <View
        className="flex-1 justify-center items-center px-6"
        style={{ backgroundColor: "#206ba5" }}
      >
        <Image
          source={require("@/assets/prestamosYA.jpeg")}
          resizeMode="contain"
          className="w-full h-48 mb-6"
        />
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Redirect href="/(app)/(tabs)/home" />;
}
