import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboardService';
import { HomeDashboardData } from '@/types/dashboard';

/**
 * Custom hook para obtener las métricas consolidadas del Dashboard de Inicio (Home).
 * QueryKey: ['dashboard', 'home']
 */
export const useHomeDashboard = () => {
  return useQuery<HomeDashboardData>({
    queryKey: ['dashboard', 'home'],
    queryFn: async () => {
      const response = await dashboardService.getHomeDashboard();
      return response.data;
    },
    staleTime: 1000 * 60 * 3, // 3 min
  });
};
