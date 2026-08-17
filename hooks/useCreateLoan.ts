import { useMutation, useQueryClient } from '@tanstack/react-query';
import { loanService } from '@/services/loanService';
import type {
  CreateAutomaticLoanInput,
  CreateManualLoanInput,
  CreateLoanResponse,
} from '@/types/loan';

type CreateLoanInput = CreateAutomaticLoanInput | CreateManualLoanInput;

/**
 * Hook de mutación para crear y persistir un préstamo en la base de datos.
 * Llama a POST /loans en modo automático o manual.
 * Invalida la query ['clients'] tras éxito para refrescar la lista de clientes.
 */
export function useCreateLoan() {
  const queryClient = useQueryClient();

  return useMutation<CreateLoanResponse, Error, CreateLoanInput>({
    mutationFn: (data) => loanService.createLoan(data),
    onSuccess: () => {
      // Invalida la lista de clientes para que el dashboard refleje los nuevos préstamos.
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}
