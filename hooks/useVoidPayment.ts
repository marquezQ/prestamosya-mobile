import { useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentService } from '@/services/paymentService';
import type { VoidPaymentResponse } from '@/types/payment';

interface VoidPaymentParams {
  paymentId: string;
  reason: string;
}

export function useVoidPayment() {
  const queryClient = useQueryClient();

  return useMutation<VoidPaymentResponse, Error, VoidPaymentParams>({
    mutationFn: ({ paymentId, reason }) =>
      paymentService.voidPayment(paymentId, reason),
    onSuccess: () => {
      // Invalida pagos, préstamos y clientes para refrescar toda la UI
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['loans'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}
