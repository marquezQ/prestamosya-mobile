import "../global.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PortalHost } from "@rn-primitives/portal";
import { getNavigationTheme } from "@/lib/theme";
import { useColorScheme } from "nativewind";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider } from "@react-navigation/native";

// QueryClient configurado una sola vez a nivel raíz
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={getNavigationTheme(colorScheme)}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(app)" />
        </Stack>
      </ThemeProvider>

      <StatusBar style="auto" />
      <PortalHost />
    </QueryClientProvider>
  );
}
