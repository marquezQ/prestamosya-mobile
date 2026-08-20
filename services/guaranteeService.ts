import { api } from './api';
import { ENDPOINTS } from './endpoints';
import type {
  Guarantee,
  CreateGuaranteeInput,
  UpdateGuaranteeInput,
  GuaranteeResponse,
  GuaranteeListResponse,
} from '@/types/guarantee';

export const guaranteeService = {
  /**
   * GET /api/guarantees?clientId=xxx
   * Obtiene las garantías de un cliente.
   */
  getGuaranteesByClientId: async (clientId: string): Promise<GuaranteeListResponse> => {
    const response = await api.get<GuaranteeListResponse>(ENDPOINTS.GUARANTEES.BASE, {
      params: { clientId },
    });
    return response.data;
  },

  /**
   * GET /api/guarantees/:id
   * Obtiene el detalle de una garantía.
   */
  getGuaranteeById: async (id: string): Promise<GuaranteeResponse> => {
    const response = await api.get<GuaranteeResponse>(ENDPOINTS.GUARANTEES.GET_BY_ID(id));
    return response.data;
  },

  /**
   * POST /api/guarantees
   * Crea una nueva garantía para un cliente.
   */
  createGuarantee: async (data: CreateGuaranteeInput): Promise<GuaranteeResponse> => {
    const response = await api.post<GuaranteeResponse>(ENDPOINTS.GUARANTEES.BASE, data);
    return response.data;
  },

  /**
   * PATCH /api/guarantees/:id
   * Actualiza los datos de una garantía.
   */
  updateGuarantee: async (id: string, data: UpdateGuaranteeInput): Promise<GuaranteeResponse> => {
    const response = await api.patch<GuaranteeResponse>(ENDPOINTS.GUARANTEES.GET_BY_ID(id), data);
    return response.data;
  },

  /**
   * DELETE /api/guarantees/:id
   * Elimina una garantía (soft delete).
   */
  deleteGuarantee: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(ENDPOINTS.GUARANTEES.GET_BY_ID(id));
    return response.data;
  },
};
