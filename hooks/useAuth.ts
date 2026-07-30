import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { LoginCredentials, AuthResponse } from '../types/auth.types';
import { useAuthStore } from '../stores/authStore';
import { secureStorage } from '../lib/secureStorage';
import { ApiError } from '../services/errors';

export const useLogin = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, ApiError, LoginCredentials>({
    mutationFn: (credentials) => authService.login(credentials),
    onSuccess: async (data) => {
      await secureStorage.setToken(data.accessToken);
      setUser(data.user);
      queryClient.clear();
    },
  });
};

export const useLogout = () => {
  const logout = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, void>({
    mutationFn: () => authService.logout(),
    onSuccess: async () => {
      await logout();
      queryClient.clear();
    },
    onError: async () => {
      await logout();
      queryClient.clear();
    }
  });
};
