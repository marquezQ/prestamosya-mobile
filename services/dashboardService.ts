import { api } from './api';
import { ENDPOINTS } from './endpoints';
import { HomeDashboardResponse } from '@/types/dashboard';

export const dashboardService = {
  /**
   * Obtiene la información consolidada para la pantalla principal / Home.
   */
  getHomeDashboard: async (): Promise<HomeDashboardResponse> => {
    const response = await api.get<HomeDashboardResponse>(ENDPOINTS.DASHBOARD.HOME);
    return response.data;
  },
};
