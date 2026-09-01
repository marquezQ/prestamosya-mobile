import { Stack, Redirect } from "expo-router";
import { useAuthStore } from "@/stores/authStore";

// Layout principal de la app autenticada.
// Cuando el usuario cierra sesión, redirige reactivamente al login.
export default function AppLayout() {
  const { isHydrated, isAuthenticated } = useAuthStore();

  // Guardián reactivo: si el store ya terminó de hidratar y no hay sesión,
  // redirige al login. Esto cubre el caso de logout y token expirado (401).
  if (isHydrated && !isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* El grupo (tabs) maneja la navegación inferior principal */}
      <Stack.Screen name="(tabs)" />

      {/* Otras pantallas que no son tabs */}
      <Stack.Screen name="client/[id]" />
      <Stack.Screen name="client/edit/[id]" />
      <Stack.Screen name="loan/new" />
      <Stack.Screen name="loan/[id]" />
    </Stack>
  );
}
