/**
 * hooks/useMarkAllAsRead.ts
 *
 * Marca todas las notificaciones no leídas del usuario como leídas.
 * Invalida la lista y el unread count para limpiar el badge.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '@/services/notificationService';
import { useNotificationStore } from '@/stores/notificationStore';
import { NOTIFICATIONS_LIST_QUERY_KEY } from './useNotifications';
import { UNREAD_COUNT_QUERY_KEY } from './useUnreadCount';

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();
  const clearUnread = useNotificationStore((state) => state.clearUnread);

  return useMutation<number, Error, void>({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: (updatedCount) => {
      if (updatedCount === 0) return; // Ya estaban todas leídas — no invalidar.

      // Limpiar el badge de forma optimista.
      clearUnread();

      // Invalidar queries para sincronizar con el servidor.
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_LIST_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: UNREAD_COUNT_QUERY_KEY });
    },
  });
};
