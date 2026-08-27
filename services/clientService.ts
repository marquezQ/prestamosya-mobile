import { api } from './api';
import {
  ClientListResponse,
  ClientDetailResponse,
  ClientCreateInput,
  ClientUpdateInput,
  Client,
} from '@/types/client';
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

  /**
   * Crea un nuevo cliente.
   */
  createClient: async (data: ClientCreateInput): Promise<{ data: Client }> => {
    const response = await api.post<{ data: Client }>(ENDPOINTS.CLIENTS.CREATE, data);
    return response.data;
  },
  /**
   * Actualiza los datos de un cliente (PATCH parcial).
   */
  updateClient: async (id: string, data: ClientUpdateInput): Promise<{ data: Client }> => {
    const response = await api.patch<{ data: Client }>(ENDPOINTS.CLIENTS.UPDATE(id), data);
    return response.data;
  },
};
