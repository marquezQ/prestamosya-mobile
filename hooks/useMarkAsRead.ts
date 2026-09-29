/**
 * hooks/useMarkAsRead.ts
 *
 * Marca una notificación específica como leída.
 * Invalida la lista y el unread count para sincronizar el badge.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '@/services/notificationService';
import { useNotificationStore } from '@/stores/notificationStore';
import { NOTIFICATIONS_LIST_QUERY_KEY } from './useNotifications';
import { UNREAD_COUNT_QUERY_KEY } from './useUnreadCount';

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  const decrementUnread = useNotificationStore((state) => state.decrementUnread);

  return useMutation<boolean, Error, string>({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: (wasUpdated) => {
      if (!wasUpdated) return; // Ya estaba leída — no invalidar innecesariamente.

      // Actualización optimista del badge sin esperar el refetch.
      decrementUnread();

      // Invalidar queries para sincronizar con el servidor.
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_LIST_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: UNREAD_COUNT_QUERY_KEY });
    },
  });
};
