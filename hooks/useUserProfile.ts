import { useQuery } from '@tanstack/react-query';
import { userService } from '../services/userService';

/**
 * Hook para obtener el perfil fresco del usuario autenticado desde la BD.
 * Usar cuando se necesiten datos actualizados (ej. pantalla de perfil).
 * Para el estado de sesión en memoria, usar useAuthStore.
 */
export const useUserProfile = () => {
  return useQuery({
    queryKey: ['users', 'me'],
    queryFn: () => userService.getUserProfile(),
  });
};
