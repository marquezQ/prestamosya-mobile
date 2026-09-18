import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { businessConfigService } from '../services/businessConfigService';
import { BusinessConfig, BusinessConfigUpdateInput } from '../types/businessConfig.types';
import { ApiError } from '../services/errors';

const BUSINESS_CONFIG_QUERY_KEY = ['business-config'] as const;

/**
 * Hook para obtener la configuración de negocio del usuario autenticado.
 * Si no existe en BD, el backend la auto-crea con valores por defecto.
 */
export const useBusinessConfig = () => {
  return useQuery<BusinessConfig, ApiError>({
    queryKey: BUSINESS_CONFIG_QUERY_KEY,
    queryFn: () => businessConfigService.getBusinessConfig(),
  });
};

/**
 * Hook para actualizar parcialmente la configuración de negocio.
 * Invalida el cache de business-config en éxito para refrescar la UI.
 */
export const useUpdateBusinessConfig = () => {
  const queryClient = useQueryClient();

  return useMutation<BusinessConfig, ApiError, BusinessConfigUpdateInput>({
    mutationFn: (input) => businessConfigService.updateBusinessConfig(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BUSINESS_CONFIG_QUERY_KEY });
    },
  });
};
