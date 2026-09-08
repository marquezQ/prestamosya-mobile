import { useQuery } from '@tanstack/react-query';
import { statsService } from '@/services/statsService';
import { MonthlyStatsData } from '@/types/stats';

/**
 * Custom hook para el reporte mensual de estadísticas.
 * QueryKey: ['stats', 'monthly', year, month] — cambia al navegar de mes.
 */
export const useMonthlyStats = (year: number, month: number) => {
  return useQuery<MonthlyStatsData>({
    queryKey: ['stats', 'monthly', year, month],
    queryFn: async () => {
      const response = await statsService.getMonthlyStats(year, month);
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};