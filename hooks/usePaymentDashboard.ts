import { useQuery } from '@tanstack/react-query';
import { paymentService } from '@/services/paymentService';
import { PaymentDashboardData } from '@/types/payment';

/**
 * Dashboard de cobros para una fecha de calendario 'yyyy-MM-dd'.
 * QueryKey: ['payments', 'dashboard', date]
 */
export const usePaymentDashboard = (date: string) => {
  return useQuery<PaymentDashboardData>({
    queryKey: ['payments', 'dashboard', date],
    queryFn: async () => {
      const response = await paymentService.getPaymentDashboard(date);
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 min
    enabled: !!date,
  });
};
