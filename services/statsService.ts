import { api } from './api';
import { ENDPOINTS } from './endpoints';
import { ENV } from '@/config/env';
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
  /**
   * Obtiene la URL completa del endpoint del reporte mensual en PDF.
   * GET /stats/monthly-pdf?year=YYYY&month=M
   */
  getMonthlyPdfUrl: (year?: number, month?: number): string => {
    const params = new URLSearchParams();
    if (year) params.append('year', year.toString());
    if (month) params.append('month', month.toString());
    const queryString = params.toString();
    return `${ENV.API_URL}${ENDPOINTS.STATS.MONTHLY_PDF}${queryString ? `?${queryString}` : ''}`;
  },
};