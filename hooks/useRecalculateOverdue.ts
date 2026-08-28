import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/adminService';
import type { RecalculateOverdueResponse } from '@/types/admin';

export function useRecalculateOverdue() {
  const queryClient = useQueryClient();

  return useMutation<RecalculateOverdueResponse, Error, void>({
    mutationFn: () => adminService.recalculateOverdue(),
    onSuccess: () => {
      // Invalida pagos, clientes y préstamos para actualizar toda la data de la app
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['loans'] });
    },
  });
}
