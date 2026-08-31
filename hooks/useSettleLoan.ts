import { useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentService } from '@/services/paymentService';
import { SettleLoanInput, SettleLoanResponseData } from '@/types/payment';

/**
 * Liquida un préstamo anticipadamente (POST /payments/settle).
 *
 * Tras el éxito, el backend cambia el estado del préstamo a COMPLETED y
 * pone outstandingBalance a 0 de forma atómica. Se invalidan las tres
 * queries afectadas para que la UI refleje el cambio inmediatamente:
 *
 * - ['payments']          → las cuotas desaparecen de dueToday / overdue
 * - ['loans', loanId]     → el detalle queda con status COMPLETED
 * - ['clients']           → el préstamo migra de activeLoans a completedLoans
 */
export const useSettleLoan = () => {
  const queryClient = useQueryClient();

  return useMutation<SettleLoanResponseData, Error, SettleLoanInput>({
    mutationFn: async (data: SettleLoanInput) => {
      const response = await paymentService.settleLoan(data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['loans', variables.loanId] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
};
