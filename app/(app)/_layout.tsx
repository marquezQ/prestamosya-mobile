import { useEffect } from "react";
import { Stack, Redirect } from "expo-router";
import { useAuthStore } from "@/stores/authStore";
import { useNotificationStore } from "@/stores/notificationStore";
import { registerForPushNotifications } from "@/lib/pushNotifications";
import { notificationService } from "@/services/notificationService";

// Layout principal de la app autenticada.
// Cuando el usuario cierra sesión, redirige reactivamente al login.
export default function AppLayout() {
  const { isHydrated, isAuthenticated } = useAuthStore();
  const setPushToken = useNotificationStore((state) => state.setPushToken);

  // Sincroniza el push token con el backend al iniciar la sesión o abrir la app autenticada.
  // Asegura que incluso si el usuario ya estaba logueado, su token se envíe a POST /api/notifications/device-tokens
  useEffect(() => {
    if (isAuthenticated) {
      console.log("[AppLayout] Usuario autenticado detectado. Iniciando registro de push token...");
      registerForPushNotifications()
        .then(async (token) => {
          if (!token) {
            console.warn("[AppLayout] No se obtuvo token del teléfono (permiso denegado o error de Expo).");
            return;
          }
          setPushToken(token);
          console.log("[AppLayout] Token del teléfono obtenido:", token, "-> Enviando al backend...");
          await notificationService.registerDeviceToken({ token, platform: "expo" });
        })
        .catch((err) => {
          console.error("[AppLayout] Error al registrar el push token en el backend:", err);
        });
    }
  }, [isAuthenticated, setPushToken]);

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
      <Stack.Screen name="profile" />
      {/* Bandeja de notificaciones — fullscreen, sin tab bar */}
      <Stack.Screen name="notifications/index" />
    </Stack>
  );
}
