import { api } from './api';
import { ENDPOINTS } from './endpoints';
import { normalizeError } from './errors';
import { AuthResponse, LoginCredentials, User } from '../types/auth.types';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const { data } = await api.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, credentials);
      return data;
    } catch (error) {
      throw normalizeError(error);
    }
  },
  
  getProfile: async (): Promise<User> => {
    try {
      const { data } = await api.get<User>(ENDPOINTS.AUTH.ME);
      return data;
    } catch (error) {
      throw normalizeError(error);
    }
  },

  logout: async (): Promise<void> => {
    try {
      await api.post(ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Backend logout failed:', normalizeError(error));
    }
  },
};
