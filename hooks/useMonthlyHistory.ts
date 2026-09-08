import { useQuery } from '@tanstack/react-query';
import { statsService } from '@/services/statsService';
import { MonthlyHistoryItem } from '@/types/stats';

/**
 * Custom hook para el historial mensual (últimos `months` meses).
 * QueryKey: ['stats', 'history', months]
 */
export const useMonthlyHistory = (months = 6) => {
  return useQuery<MonthlyHistoryItem[]>({
    queryKey: ['stats', 'history', months],
    queryFn: async () => {
      const response = await statsService.getMonthlyHistory(months);
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};