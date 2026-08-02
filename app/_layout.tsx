import "../global.css";

import { useEffect, useState } from "react";
import { Appearance } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PortalHost } from "@rn-primitives/portal";
import { getNavigationTheme } from "@/lib/theme";
import { useColorScheme } from "nativewind";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider } from "@react-navigation/native";
import { KeyboardProvider } from "@/components/ui/KeyboardProvider";
import { useAuthStore } from "@/stores/authStore";
import { View, ActivityIndicator } from "react-native";

// QueryClient configurado una sola vez a nivel raíz
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      refetchOnWindowFocus: false,
    },
  },
});

function RootLayoutNav() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = useState(false);

  useEffect(() => {
    // Fuerza a NativeWind a inyectar las clases CSS correctas (dark/light) antes del primer render
    const theme = Appearance.getColorScheme() ?? "light";
    setColorScheme(colorScheme ?? theme);
    setIsColorSchemeLoaded(true);
  }, [colorScheme, setColorScheme]);

  if (!isColorSchemeLoaded) {
    return null;
  }
  
  return (
    <KeyboardProvider>
      <ThemeProvider value={getNavigationTheme(colorScheme)}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(app)" />
        </Stack>
      </ThemeProvider>
    </KeyboardProvider>
  );
}

export default function RootLayout() {
  const { isHydrated, isAuthenticated, hydrate } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!isHydrated) return;

    const inAuthGroup = segments[0] === "(auth)";

    // Usar setTimeout para evitar actualizaciones de estado durante el render de React Navigation
    setTimeout(() => {
      if (!isAuthenticated && !inAuthGroup) {
        router.replace("/(auth)/login");
      } else if (isAuthenticated && inAuthGroup) {
        // Redirige específicamente al index del home
        router.replace("/(app)/(tabs)/home"); 
      }
    }, 0);
  }, [isAuthenticated, isHydrated, segments]);

  if (!isHydrated) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <RootLayoutNav />
      <StatusBar style="auto" />
      <PortalHost />
    </QueryClientProvider>
  );
}
