import { api } from './api';
import { ClientListResponse } from '@/types/client';
import { ENDPOINTS } from './endpoints';

export const clientService = {
  /**
   * Obtiene la lista completa de clientes.
   */
  getClients: async (): Promise<ClientListResponse> => {
    const response = await api.get<ClientListResponse>(ENDPOINTS.CLIENTS.GET_ALL);
    return response.data;
  },
};
