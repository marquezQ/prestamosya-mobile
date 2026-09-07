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
          console.warn('Fallo al validar sesion en backend, limpiando token:', err);
          await secureStorage.deleteToken();
          set({ user: null, isAuthenticated: false, isHydrated: true });
        }
      } else {
        set({ isHydrated: true, isAuthenticated: false, user: null });
      }
    } catch (error) {
      console.error('Error hydrating auth state:', error);
      set({ isHydrated: true, isAuthenticated: false, user: null });
      await secureStorage.deleteToken();
    }
  },

  logout: async () => {
    set({ user: null, isAuthenticated: false });
    await secureStorage.deleteToken();
  },
}));

setLogoutCallback(() => {
  useAuthStore.getState().logout();
});
