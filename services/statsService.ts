import { api } from './api';
import { ENDPOINTS } from './endpoints';
import { MonthlyStatsResponse, MonthlyHistoryResponse } from '@/types/stats';

export const statsService = {
  /**
   * Obtiene el reporte mensual consolidado de estadísticas.
   * GET /stats/monthly?year=YYYY&month=M — sin params devuelve el mes actual.
   */
  getMonthlyStats: async (year?: number, month?: number): Promise<MonthlyStatsResponse> => {
    const response = await api.get<MonthlyStatsResponse>(ENDPOINTS.STATS.MONTHLY, {
      params: year && month ? { year, month } : undefined,
    });
    return response.data;
  },

  /**
   * Obtiene el historial mensual (índice 0 = mes más reciente).
   * GET /stats/monthly-history?months=N — por defecto últimos 6 meses.
   */
  getMonthlyHistory: async (months?: number): Promise<MonthlyHistoryResponse> => {
    const response = await api.get<MonthlyHistoryResponse>(
      ENDPOINTS.STATS.MONTHLY_HISTORY,
      {
        params: months ? { months } : undefined,
      },
    );
    return response.data;
  },
};