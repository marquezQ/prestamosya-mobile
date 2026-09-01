import { Stack, Redirect } from "expo-router";
import { useAuthStore } from "@/stores/authStore";

// Layout para el grupo de autenticación.
// Cuando el usuario inicia sesión exitosamente, redirige reactivamente al Home.
export default function AuthLayout() {
  const { isHydrated, isAuthenticated } = useAuthStore();

  // Guardián reactivo: si ya está autenticado (tras login exitoso),
  // redirige al home. Esto evita que el usuario vea el login si ya tiene sesión.
  if (isHydrated && isAuthenticated) {
    return <Redirect href="/(app)/(tabs)/home" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
    </Stack>
  );
}
