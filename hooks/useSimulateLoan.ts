import { useMutation } from '@tanstack/react-query';
import { loanService } from '@/services/loanService';
import type { LoanSimulateParams, LoanSimulationResponse } from '@/types/loan';

/**
 * Hook de mutación para simular el cronograma de un préstamo.
 * Llama a POST /loans/simulate y devuelve el cronograma proyectado.
 * No persiste datos — úsalo en el Paso 2 del wizard antes de confirmar.
 */
export function useSimulateLoan() {
  return useMutation<LoanSimulationResponse, Error, LoanSimulateParams>({
    mutationFn: (params) => loanService.simulateLoan(params),
  });
}
