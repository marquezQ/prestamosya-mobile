import "../global.css";

import { useEffect, useState, useRef } from "react";
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
import { View, ActivityIndicator, Image } from "react-native";
import { configureReanimatedLogger, ReanimatedLogLevel } from "react-native-reanimated";
import {
  configurePushNotifications,
  setupNotificationListeners,
} from "@/lib/pushNotifications";
import * as Notifications from "expo-notifications";

// Desactiva el warning de 'strict mode' de Reanimated en desarrollo causado por componentes primitivos de UI
if (__DEV__) {
  configureReanimatedLogger({
    level: ReanimatedLogLevel.warn,
    strict: false,
  });
}

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
    // Fuerza a la app a estar siempre en Modo Claro ("light") por defecto de forma estable
    setColorScheme("light");
    setIsColorSchemeLoaded(true);
  }, []);

  if (!isColorSchemeLoaded) {
    return null;
  }
  
  return (
    <KeyboardProvider>
      <ThemeProvider value={getNavigationTheme(colorScheme)}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(app)" />
        </Stack>
        {/* PortalHost MUST be inside ThemeProvider/NavigationContainer so that
            Dialog/Sheet content rendered via Portal has access to the navigation
            context. Placing it outside (at root level) causes crashes when any
            hook inside a portal tries to access NavigationContainer context. */}
        <PortalHost />
      </ThemeProvider>
    </KeyboardProvider>
  );
}

export default function RootLayout() {
  const { hydrate } = useAuthStore();
  const router = useRouter();
  const notificationResponseRef = useRef<Notifications.NotificationResponse | null>(
    // Captura la notificación inicial si la app fue abierta desde un push (cold start).
    Notifications.useLastNotificationResponse?.() ?? null
  );

  useEffect(() => {
    configurePushNotifications();
    hydrate();
  }, [hydrate]);

  // Configura el listener de respuesta a notificaciones (usuario toca el push).
  // El deep link navega a la pantalla de bandeja.
  useEffect(() => {
    const cleanup = setupNotificationListeners({
      onResponse: () => {
        // La navegación necesita que el router esté listo.
        // El timeout 0 garantiza que el navigator ya está montado.
        setTimeout(() => {
          router.push("/(app)/notifications");
        }, 0);
      },
    });

    return cleanup;
  }, [router]);

  return (
    <QueryClientProvider client={queryClient}>
      <RootLayoutNav />
      <StatusBar style="light" />
    </QueryClientProvider>
  );
}
