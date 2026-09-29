/**
 * stores/authStore.ts
 *
 * Estado de autenticación global (Zustand, efímero — sin persistencia).
 *
 * FLUJO DE PUSH TOKEN EN LOGOUT:
 *
 * El método `logout()` de este store es invocado por DOS caminos:
 *
 *   1. logout() voluntario del usuario → llega a través de useLogout(),
 *      que ya elimina el device token ANTES de llamar a este logout().
 *
 *   2. Interceptor 401 de Axios (JWT expirado) → llama a `logout()` directamente
 *      vía `setLogoutCallback`. En este caso, también debemos intentar
 *      eliminar el device token. Se hace con `best-effort`: si la red no
 *      está disponible, se limpia el store de todos modos para no bloquear al usuario.
 *
 * La decisión de limpiar el pushToken aquí (y no solo en useLogout) garantiza
 * que el cron de las 8 AM deje de mandar pushes al dispositivo aunque la
 * sesión haya expirado silenciosamente (e.g., el usuario dejó de usar la app
 * por días y el JWT venció en background).
 */

import { create } from 'zustand';
import { User } from '../types/auth.types';
import { secureStorage } from '../lib/secureStorage';
import { authService } from '../services/auth.service';
import { setLogoutCallback } from '../services/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isHydrated: boolean;

  setUser: (user: User) => void;
  hydrate: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isHydrated: false,

  setUser: (user: User) => set({ user, isAuthenticated: true }),

  hydrate: async () => {
    try {
      const token = await secureStorage.getToken();
      if (token) {
        try {
          const user = await authService.getProfile();
          set({ user, isAuthenticated: true, isHydrated: true });
        } catch (err) {
          console.warn('[AuthStore] Fallo al validar sesión en backend, limpiando token:', err);
          await secureStorage.deleteToken();
          set({ user: null, isAuthenticated: false, isHydrated: true });
        }
      } else {
        set({ isHydrated: true, isAuthenticated: false, user: null });
      }
    } catch (error) {
      console.error('[AuthStore] Error al hidratar el estado de auth:', error);
      set({ isHydrated: true, isAuthenticated: false, user: null });
      await secureStorage.deleteToken();
    }
  },

  logout: async () => {
    // Importación dinámica para evitar circular dependency:
    //   authStore → notificationStore (ok, no hay ciclo).
    //   notificationStore NO importa authStore.
    // Se usa importación dinámica para que el módulo se resuelva en runtime
    // y no se evalúe en el momento de la definición del store.
    try {
      const { useNotificationStore } = await import('./notificationStore');
      const { notificationService } = await import('../services/notificationService');

      const pushToken = useNotificationStore.getState().pushToken;

      if (pushToken) {
        // Intentamos eliminar el device token en el backend.
        // El JWT aún puede estar en SecureStore en este momento, lo que
        // permite que el DELETE se autentique correctamente.
        // Si el JWT ya expiró y el 401 causó este logout, el DELETE también
        // fallará con 401 — lo aceptamos y continuamos.
        try {
          await notificationService.deleteDeviceToken({ token: pushToken, platform: 'expo' });
        } catch {
          // Best-effort — no bloqueamos el logout si el delete falla.
        } finally {
          useNotificationStore.getState().setPushToken(null);
          useNotificationStore.getState().clearUnread();
        }
      }
    } catch (importErr) {
      console.warn('[AuthStore] No se pudo cargar notificationStore en logout:', importErr);
    }

    // Limpiar sesión local (siempre, independiente del resultado del DELETE).
    set({ user: null, isAuthenticated: false });
    await secureStorage.deleteToken();
  },
}));

// Conecta el interceptor 401 de Axios con el logout del store.
// Esto cubre el caso de JWT expirado silenciosamente en background.
setLogoutCallback(() => {
  useAuthStore.getState().logout();
});
