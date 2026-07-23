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
        // If we want to actually validate the token, we would call getProfile()
        // but since we don't have the backend yet, let's just assume valid if exists
        // const user = await authService.getProfile();
        // set({ user, isAuthenticated: true, isHydrated: true });
        
        // Mocking user profile for now so we don't hit 401 loop on startup without backend
        set({ 
          user: { id: "1", username: "admin", name: "Admin", role: "admin" }, 
          isAuthenticated: true, 
          isHydrated: true 
        });
      } else {
        set({ isHydrated: true, isAuthenticated: false });
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
