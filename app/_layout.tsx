import "../global.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PortalHost } from "@rn-primitives/portal";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

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
  return (
    <QueryClientProvider client={queryClient}>
      {/*
        Stack Navigator raíz.
        Acá se definen todas las "pilas" de navegación del proyecto.
        headerShown: false para manejar headers manualmente por pantalla.
      */}
      <Stack screenOptions={{ headerShown: false }}>
        {/* Grupo de autenticación — pantallas sin header, fondo neutro */}
        <Stack.Screen name="(auth)" />

        {/* Grupo de la app autenticada — tabs + pantallas internas */}
        <Stack.Screen name="(app)" />
      </Stack>

      <StatusBar style="auto" />

      {/*
        PortalHost: siempre al final del árbol.
        Permite que Dialog, Dropdown y Select rendericen
        por encima de todo el contenido en native.
      */}
      <PortalHost />
    </QueryClientProvider>
  );
}
