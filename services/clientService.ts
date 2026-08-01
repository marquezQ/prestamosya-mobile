import { api } from './api';
import { ClientListResponse, ClientDetailResponse } from '@/types/client';
import { ENDPOINTS } from './endpoints';

export const clientService = {
  /**
   * Obtiene la lista completa de clientes.
   */
  getClients: async (): Promise<ClientListResponse> => {
    const response = await api.get<ClientListResponse>(ENDPOINTS.CLIENTS.GET_ALL);
    return response.data;
  },

  /**
   * Obtiene el detalle de un cliente por ID.
   */
  getClientById: async (id: string): Promise<ClientDetailResponse> => {
    const response = await api.get<ClientDetailResponse>(ENDPOINTS.CLIENTS.GET_BY_ID(id));
    return response.data;
  },
};
