import { api } from './api';
import { ENDPOINTS } from './endpoints';
import type {
  PaymentDashboardResponse,
  RegisterPaymentInput,
  RegisterPaymentResponse,
} from '@/types/payment';

export const paymentService = {
  /**
   * Obtiene el dashboard de cuotas para una fecha de calendario.
   * GET /payments/dashboard?date=YYYY-MM-DD
   * Divide las cuotas en dueToday / overdue / paidToday respecto a targetDate.
   */
  getPaymentDashboard: async (date?: string): Promise<PaymentDashboardResponse> => {
    const response = await api.get<PaymentDashboardResponse>(
      ENDPOINTS.PAYMENTS.DASHBOARD,
      { params: date ? { date } : undefined },
    );
    return response.data;
  },

  /**
   * Registra un pago. El backend distribuye el monto automáticamente
   * en orden FIFO sobre las cuotas pendientes más antiguas.
   * POST /payments
   */
  registerPayment: async (data: RegisterPaymentInput): Promise<RegisterPaymentResponse> => {
    const response = await api.post<RegisterPaymentResponse>(
      ENDPOINTS.PAYMENTS.REGISTER,
      data,
    );
    return response.data;
  },
};
