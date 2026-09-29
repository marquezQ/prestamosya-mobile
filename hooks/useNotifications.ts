/**
 * hooks/useNotifications.ts
 *
 * Lista paginada de notificaciones con soporte para cargar más (offset pagination).
 * La paginación se gestiona con estado local — sin useInfiniteQuery para mantener
 * la implementación simple y consistente con el resto del proyecto.
 *
 * QueryKey: ['notifications', 'list', page]
 */

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import { notificationService } from '@/services/notificationService';
import type { NotificationPage } from '@/types/notification';

export const NOTIFICATIONS_LIST_QUERY_KEY = ['notifications', 'list'] as const;

const PER_PAGE = 20;

export const useNotifications = () => {
  const [page, setPage] = useState(1);

  const query = useQuery<NotificationPage>({
    queryKey: [...NOTIFICATIONS_LIST_QUERY_KEY, page],
    queryFn: () => notificationService.getNotifications({ page, perPage: PER_PAGE }),
    // Mantiene los datos anteriores visibles mientras carga la nueva página,
    // evitando el parpadeo en la FlatList al paginar.
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60, // 1 minuto
  });

  const hasMore = query.data
    ? query.data.page * query.data.perPage < query.data.total
    : false;

  const loadNextPage = useCallback(() => {
    if (hasMore && !query.isFetching) {
      setPage((prev) => prev + 1);
    }
  }, [hasMore, query.isFetching]);

  const reset = useCallback(() => {
    setPage(1);
  }, []);

  return {
    ...query,
    page,
    hasMore,
    loadNextPage,
    reset,
  };
};
