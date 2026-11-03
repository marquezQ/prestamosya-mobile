import { Platform } from 'react-native';
import { api } from './api';
import {
  ClientListResponse,
  ClientDetailResponse,
  ClientCreateInput,
  ClientUpdateInput,
  ClientImagePayload,
  Client,
} from '@/types/client';
import { ENDPOINTS } from './endpoints';

/**
 * Headers obligatorios para las peticiones multipart de clientes.
 *
 * CRÍTICO (axios >= 1.x): la instancia `api` declara 'Content-Type': 'application/json'
 * como default global. Si no se sobreescribe por petición, transformRequest convierte
 * el FormData a JSON y el archivo se pierde. Con 'multipart/form-data' explícito axios
 * deja el FormData intacto; el boundary lo agrega la runtime.
 */
const MULTIPART_HEADERS = { 'Content-Type': 'multipart/form-data' };

/**
 * Adjunta la imagen bajo la clave 'image' al FormData de forma cross-platform.
 *
 * - NATIVO: usa el objeto { uri, name, type } que RN convierte a binario.
 *   Sin name o type el archivo no viaja y llega undefined al backend.
 * - WEB: el asset del picker es un data URI, no un archivo nativo.
 *   FormData del navegador requiere un File/Blob real — convertir primero.
 */
async function appendClientImageToFormData(
  formData: FormData,
  image: ClientImagePayload,
): Promise<void> {
  if (Platform.OS === 'web') {
    const response = await fetch(image.uri);
    const blob = await response.blob();
    formData.append(
      'image',
      new File([blob], image.name || 'cliente.jpg', {
        type: blob.type || image.mimeType || 'image/jpeg',
      }),
    );
    return;
  }

  formData.append('image', {
    uri: image.uri,
    name: image.name,
    type: image.mimeType ?? 'image/jpeg',
  } as unknown as Blob);
}

/**
 * Arma el FormData para POST /api/clients.
 * Solo incluye campos con valor; el campo `image` es opcional.
 */
async function buildCreateClientFormData(data: ClientCreateInput): Promise<FormData> {
  const formData = new FormData();

  formData.append('fullName', data.fullName);
  formData.append('phone', data.phone);
  formData.append('idNumber', data.idNumber);

  if (data.phoneAlt) formData.append('phoneAlt', data.phoneAlt);
  if (data.address) formData.append('address', data.address);
  if (data.latitude !== null && data.latitude !== undefined)
    formData.append('latitude', String(data.latitude));
  if (data.longitude !== null && data.longitude !== undefined)
    formData.append('longitude', String(data.longitude));
  if (data.notes) formData.append('notes', data.notes);
  if (data.image) await appendClientImageToFormData(formData, data.image);

  return formData;
}

/**
 * Arma el FormData para PATCH /api/clients/:id.
 * Solo incluye los campos que se pasan (merge parcial en el backend).
 */
async function buildUpdateClientFormData(data: ClientUpdateInput): Promise<FormData> {
  const formData = new FormData();

  if (data.fullName !== undefined) formData.append('fullName', data.fullName);
  if (data.phone !== undefined) formData.append('phone', data.phone);
  if (data.idNumber !== undefined) formData.append('idNumber', data.idNumber);
  if (data.phoneAlt) formData.append('phoneAlt', data.phoneAlt);
  if (data.address !== undefined && data.address !== null)
    formData.append('address', data.address);
  if (data.latitude !== null && data.latitude !== undefined)
    formData.append('latitude', String(data.latitude));
  if (data.longitude !== null && data.longitude !== undefined)
    formData.append('longitude', String(data.longitude));
  if (data.notes !== undefined && data.notes !== null) formData.append('notes', data.notes);
  if (data.image) await appendClientImageToFormData(formData, data.image);

  return formData;
}

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
   * Crea un nuevo cliente con foto opcional (multipart/form-data).
   */
  createClient: async (data: ClientCreateInput): Promise<{ data: Client }> => {
    const formData = await buildCreateClientFormData(data);
    const response = await api.post<{ data: Client }>(ENDPOINTS.CLIENTS.CREATE, formData, {
      headers: MULTIPART_HEADERS,
      timeout: 60000,
    });
    return response.data;
  },

  /**
   * Actualiza los datos de un cliente (PATCH parcial, multipart/form-data).
   * Si se incluye `image`, reemplaza la foto anterior.
   */
  updateClient: async (id: string, data: ClientUpdateInput): Promise<{ data: Client }> => {
    const formData = await buildUpdateClientFormData(data);
    const response = await api.patch<{ data: Client }>(ENDPOINTS.CLIENTS.UPDATE(id), formData, {
      headers: MULTIPART_HEADERS,
      timeout: 60000,
    });
    return response.data;
  },
};
