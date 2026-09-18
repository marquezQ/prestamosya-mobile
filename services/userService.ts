import { api } from './api';
import { ENDPOINTS } from './endpoints';
import { normalizeError } from './errors';
import { User } from '../types/auth.types';

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export const userService = {
  /**
   * Obtiene el perfil fresco del usuario autenticado desde la BD.
   * A diferencia de GET /auth/me (que refleja el JWT), este endpoint
   * devuelve campos adicionales: isActive, createdAt, updatedAt.
   */
  getUserProfile: async (): Promise<User> => {
    try {
      const { data } = await api.get<User>(ENDPOINTS.USERS.ME);
      return data;
    } catch (error) {
      throw normalizeError(error);
    }
  },

  /**
   * Cambia la contraseña del usuario autenticado.
   *
   * IMPORTANTE: El backend responde 400 (no 401) cuando la contraseña actual
   * es incorrecta. El interceptor global de Axios solo dispara logout en 401,
   * por lo que un 400 llega directamente al componente como error manejable.
   */
  changePassword: async (input: ChangePasswordInput): Promise<void> => {
    try {
      await api.patch(ENDPOINTS.USERS.CHANGE_PASSWORD, input);
    } catch (error) {
      throw normalizeError(error);
    }
  },
};
