import { useMutation } from '@tanstack/react-query';
import { userService, ChangePasswordInput } from '../services/userService';
import { ApiError } from '../services/errors';

/**
 * Hook para cambiar la contraseña del usuario autenticado.
 *
 * IMPORTANTE: El backend responde HTTP 400 (no 401) cuando la contraseña
 * actual es incorrecta. El interceptor global de Axios solo hace logout en 401,
 * por lo que un error de contraseña incorrecta llega al onError de esta
 * mutación sin cerrar la sesión del usuario.
 */
export const useChangePassword = () => {
  return useMutation<void, ApiError, ChangePasswordInput>({
    mutationFn: (input) => userService.changePassword(input),
  });
};
