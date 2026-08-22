export type InstallmentStatus = 'PENDING' | 'PARTIAL' | 'PAID' | 'OVERDUE';

/**
 * Métodos de pago soportados por el backend.
 * 'transfer' cubre transferencias bancarias y pagos por QR (el estándar en Bolivia).
 */
export type PaymentMethod = 'cash' | 'transfer';

export interface DashboardInstallmentItem {
  installmentId: string;
  installmentNumber: number;
  loanId: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  dueDate: string; // YYYY-MM-DD
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: InstallmentStatus;
  daysOverdue: number;
  paidAt: string | null;
}

export interface PaymentDashboardMetadata {
  targetDate: string;
  serverToday: string;
}

export interface PaymentDashboardData {
  metadata: PaymentDashboardMetadata;
  dueToday: DashboardInstallmentItem[];
  overdue: DashboardInstallmentItem[];
  paidToday: DashboardInstallmentItem[];
}

export interface PaymentDashboardResponse {
  data: PaymentDashboardData;
  message?: string;
}

export interface RegisterPaymentInput {
  loanId: string;
  amount: number;
  method: PaymentMethod;
  paymentDate: string; // YYYY-MM-DD
  notes?: string;
}

export interface AffectedInstallment {
  installmentId: string;
  installmentNumber: number;
  amountApplied: number;
  newStatus: InstallmentStatus;
  remainingAmount: number;
}

export interface RegisterPaymentResponseData {
  paymentId: string;
  loanId: string;
  amount: number;
  method: PaymentMethod;
  paymentDate: string;
  notes: string | null;
  affectedInstallments: AffectedInstallment[];
  loanStatus: string;
  outstandingBalance: number;
}

export interface RegisterPaymentResponse {
  data: RegisterPaymentResponseData;
  message: string;
}
