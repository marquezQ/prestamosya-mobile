import { api } from './api';
import { ENDPOINTS } from './endpoints';
import { normalizeError } from './errors';
import { BusinessConfig, BusinessConfigUpdateInput } from '../types/businessConfig.types';

export const businessConfigService = {
  /**
   * Obtiene la configuración de negocio del usuario autenticado.
   * Si no existe, el backend la auto-crea con valores por defecto.
   */
  getBusinessConfig: async (): Promise<BusinessConfig> => {
    try {
      const { data } = await api.get<BusinessConfig>(ENDPOINTS.BUSINESS_CONFIG.BASE);
      return data;
    } catch (error) {
      throw normalizeError(error);
    }
  },

  /**
   * Actualiza parcialmente la configuración de negocio.
   * Solo se persisten los campos enviados en el payload.
   */
  updateBusinessConfig: async (input: BusinessConfigUpdateInput): Promise<BusinessConfig> => {
    try {
      const { data } = await api.patch<BusinessConfig>(ENDPOINTS.BUSINESS_CONFIG.BASE, input);
      return data;
    } catch (error) {
      throw normalizeError(error);
    }
  },
};
