/**
 * hooks/useAuth.ts
 *
 * Mutaciones de autenticación: login y logout.
 *
 * FLUJO DE PUSH TOKENS:
 *
 * LOGIN:
 *   1. Credenciales validadas → se guarda el JWT.
 *   2. Se solicita el Expo Push Token al SO.
 *   3. Si hay token → POST /notifications/device-tokens.
 *   4. El token se persiste en notificationStore para usarlo al logout.
 *
 * LOGOUT (manual o por expiración de JWT / 401):
 *   El interceptor 401 de Axios llama a authStore.logout() directamente.
 *   Para garantizar que el device token se elimine en AMBOS caminos (logout
 *   voluntario y expiración), la limpieza del token se delega a authStore.logout(),
 *   que tiene acceso al notificationStore sin pasar por React Query.
 *
 *   useLogout (logout voluntario del usuario):
 *   1. DELETE /notifications/device-tokens (mientras el JWT todavía es válido).
 *   2. authStore.logout() → limpia JWT + limpia pushToken del store.
 *   3. queryClient.clear() → borra cache de React Query.
 *
 *   authStore.logout() (disparado por interceptor 401):
 *   Ver stores/authStore.ts — el mismo delete se intenta antes de limpiar el JWT.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { LoginCredentials, AuthResponse } from '../types/auth.types';
import { useAuthStore } from '../stores/authStore';
import { useNotificationStore } from '../stores/notificationStore';
import { secureStorage } from '../lib/secureStorage';
import { registerForPushNotifications } from '../lib/pushNotifications';
import { notificationService } from '../services/notificationService';
import { ApiError } from '../services/errors';

// ─── Login ─────────────────────────────────────────────────────────────────────

export const useLogin = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const setPushToken = useNotificationStore((state) => state.setPushToken);
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, ApiError, LoginCredentials>({
    mutationFn: (credentials) => authService.login(credentials),
    onSuccess: async (data) => {
      // 1. Persistir JWT y actualizar estado de autenticación.
      await secureStorage.setToken(data.accessToken);
      setUser(data.user);
      queryClient.clear();

      // 2. Registrar el push token del dispositivo (fire-and-forget).
      //    No bloqueamos el flujo de login si el push falla — el usuario
      //    puede seguir usando la app, simplemente no recibirá pushes.
      registerForPushNotifications()
        .then(async (token) => {
          if (!token) return;
          setPushToken(token);
          await notificationService.registerDeviceToken({ token, platform: 'expo' });
        })
        .catch((err) => {
          console.warn('[useLogin] No se pudo registrar el push token:', err);
        });
    },
  });
};

// ─── Logout ────────────────────────────────────────────────────────────────────

export const useLogout = () => {
  const logout = useAuthStore((state) => state.logout);
  const pushToken = useNotificationStore((state) => state.pushToken);
  const setPushToken = useNotificationStore((state) => state.setPushToken);
  const queryClient = useQueryClient();

  const performLogout = async () => {
    // 1. Eliminar el device token del backend ANTES de limpiar el JWT.
    //    En este punto el JWT todavía es válido, por lo que el DELETE
    //    puede autenticarse correctamente.
    if (pushToken) {
      try {
        await notificationService.deleteDeviceToken({ token: pushToken, platform: 'expo' });
      } catch (err) {
        // Si falla (sin red, token ya no existe), continuamos el logout de todos modos.
        // El backend es idempotente: si el token ya fue eliminado, responde 200.
        console.warn('[useLogout] No se pudo eliminar el push token:', err);
      } finally {
        // Limpiamos el push token del store en cualquier caso.
        setPushToken(null);
      }
    }

    // 2. Limpiar sesión y cache de React Query.
    await logout();
    queryClient.clear();
  };

  return useMutation<void, ApiError, void>({
    mutationFn: () => authService.logout(),
    onSuccess: performLogout,
    // Si el backend falla al hacer logout (ej. red caída), limpiamos la sesión
    // localmente de todos modos para no dejar al usuario atrapado.
    onError: performLogout,
  });
};
