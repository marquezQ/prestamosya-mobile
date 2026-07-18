import { Stack } from "expo-router";

// Layout para el grupo de autenticación.
// Todas las pantallas dentro de (auth)/ usan este Stack.
// El prefijo (auth) es un "route group" — no aparece en la URL/ruta.
export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
    </Stack>
  );
}
