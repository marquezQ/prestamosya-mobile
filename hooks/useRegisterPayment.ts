import { useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentService } from '@/services/paymentService';
import { RegisterPaymentInput, RegisterPaymentResponseData } from '@/types/payment';

/**
 * Registra un pago y refresca el dashboard de cobros, el detalle del
 * préstamo afectado y la lista de clientes (estados/morosity agregados).
 * QueryKeys invalidadas: ['payments'], ['loans', loanId], ['clients'].
 */
export const useRegisterPayment = () => {
  const queryClient = useQueryClient();

  return useMutation<RegisterPaymentResponseData, Error, RegisterPaymentInput>({
    mutationFn: async (data: RegisterPaymentInput) => {
      const response = await paymentService.registerPayment(data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['loans', variables.loanId] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
};
