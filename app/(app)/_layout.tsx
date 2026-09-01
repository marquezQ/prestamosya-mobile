import { Stack } from "expo-router";

// Layout principal de la app autenticada.
export default function AppLayout() {
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
