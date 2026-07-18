import { Stack } from "expo-router";

// Layout principal de la app autenticada.
// Cualquier pantalla aquí asume que el usuario tiene sesión.
export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* El grupo (tabs) maneja la navegación inferior principal */}
      <Stack.Screen name="(tabs)" />
      
      {/* Otras pantallas que no son tabs, ej: detalles de préstamo, configuraciones, etc. */}
      {/* <Stack.Screen name="loan-details" /> */}
    </Stack>
  );
}
