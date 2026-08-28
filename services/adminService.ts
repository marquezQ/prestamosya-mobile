import { api } from './api';
import { ENDPOINTS } from './endpoints';
import type { RecalculateOverdueResponse } from '@/types/admin';

export const adminService = {
  /**
   * Recálculo manual de mora (ejecuta el mismo proceso que el cron diario).
   * POST /api/admin/recalculate-overdue
   */
  recalculateOverdue: async (): Promise<RecalculateOverdueResponse> => {
    const response = await api.post<RecalculateOverdueResponse>(
      ENDPOINTS.ADMIN.RECALCULATE_OVERDUE,
    );
    return response.data;
  },
};
