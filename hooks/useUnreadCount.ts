/**
 * hooks/useUnreadCount.ts
 *
 * Devuelve el total de notificaciones no leídas del usuario.
 * Alimenta el badge de la campanita en el header.
 *
 * staleTime: 0 → siempre se refresca al montar o recuperar foco.
 * El componente HeaderActions.tsx escucha AppState y llama
 * refetch() cuando la app vuelve al foco ('active').
 */

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { notificationService } from '@/services/notificationService';
import { useNotificationStore } from '@/stores/notificationStore';

export const UNREAD_COUNT_QUERY_KEY = ['notifications', 'unreadCount'] as const;

export const useUnreadCount = () => {
  const setUnreadCount = useNotificationStore((state) => state.setUnreadCount);

  const query = useQuery<number>({
    queryKey: UNREAD_COUNT_QUERY_KEY,
    queryFn: () => notificationService.getUnreadCount(),
    // Sin staleTime: los datos se marcan como stale inmediatamente.
    // React Query refetcheará en background al recuperar foco si
    // `refetchOnWindowFocus` está habilitado (default en RQ v5).
    staleTime: 0,
  });

  // Sincronizamos el count del servidor con el store local cada vez
  // que React Query obtiene un valor actualizado.
  useEffect(() => {
    if (query.data !== undefined) {
      setUnreadCount(query.data);
    }
  }, [query.data, setUnreadCount]);

  return query;
};
