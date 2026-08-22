import { Platform } from 'react-native';
import { api } from './api';
import { ENDPOINTS } from './endpoints';
import type {
  Guarantee,
  GuaranteeImagePayload,
  CreateGuaranteeInput,
  UpdateGuaranteeInput,
  GuaranteeResponse,
  GuaranteeListResponse,
} from '@/types/guarantee';

/**
 * Adjunta la imagen bajo la clave 'image' (la que espera Multer en el backend).
 *
 * - NATIVO: la runtime de RN arma el binario desde el objeto { uri, name, type };
 *   si falta name o type, el archivo no viaja y llega undefined al backend.
 * - WEB: el asset del picker es un data URI (o blob: URL), NO un archivo nativo.
 *   El FormData del navegador requiere un File/Blob real — si se envía un objeto
 *   plano se serializa como "[object Object]" y Multer no detecta ningún archivo.
 */
async function appendImageToFormData(
  formData: FormData,
  image: GuaranteeImagePayload,
): Promise<void> {
  if (Platform.OS === 'web') {
    const response = await fetch(image.uri);
    const blob = await response.blob();
    formData.append(
      'image',
      new File([blob], image.name || 'garantia.jpg', {
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
 * Headers obligatorios para las peticiones multipart.
 *
 * CRÍTICO (axios >= 1.x): la instancia `api` declara
 * 'Content-Type': 'application/json' como default global. Si no se
 * sobreescribe por petición, transformRequest detecta ese content-type
 * y convierte TODO el FormData a JSON con formDataToJSON(): los campos
 * de texto llegan al backend pero el archivo se pierde (Multer recibe
 * undefined). Con 'multipart/form-data' explícito axios deja el FormData
 * intacto; el boundary lo agrega la runtime (navegador en web, capa de
 * red de RN en nativo).
 */
const MULTIPART_HEADERS = { 'Content-Type': 'multipart/form-data' };
/**
 * Arma el FormData para POST/PATCH /api/guarantees.
 */
async function buildGuaranteeFormData(
  data: CreateGuaranteeInput | UpdateGuaranteeInput,
): Promise<FormData> {
  const formData = new FormData();

  if ('clientId' in data && data.clientId) {
    formData.append('clientId', data.clientId);
  }
  if (data.type) {
    formData.append('type', data.type);
  }
  if (data.description) {
    formData.append('description', data.description);
  }
  if (data.estimatedValue !== null && data.estimatedValue !== undefined) {
    // El multipart solo transporta strings; el backend parsea a número.
    formData.append('estimatedValue', String(data.estimatedValue));
  }
  if (data.image) {
    await appendImageToFormData(formData, data.image);
  }

  return formData;
}

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
   * POST /api/guarantees (multipart/form-data)
   * Crea una nueva garantía para un cliente, con foto opcional.
   * Timeout extendido: la subida de imágenes puede tardar más que un JSON.
   */
  createGuarantee: async (data: CreateGuaranteeInput): Promise<GuaranteeResponse> => {
    const formData = await buildGuaranteeFormData(data);
    const response = await api.post<GuaranteeResponse>(ENDPOINTS.GUARANTEES.BASE, formData, {
      headers: MULTIPART_HEADERS,
      timeout: 60000,
    });
    return response.data;
  },

  /**
   * PATCH /api/guarantees/:id (multipart/form-data)
   * Actualiza los datos de una garantía. Si se adjunta imagen, reemplaza la foto anterior.
   */
  updateGuarantee: async (id: string, data: UpdateGuaranteeInput): Promise<GuaranteeResponse> => {
    const formData = await buildGuaranteeFormData(data);
    const response = await api.patch<GuaranteeResponse>(
      ENDPOINTS.GUARANTEES.GET_BY_ID(id),
      formData,
      { headers: MULTIPART_HEADERS, timeout: 60000 },
    );
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
