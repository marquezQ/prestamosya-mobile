import { Currency } from './loan';

export interface CapitalEnCalle {
  BOB: number;
  USD: number;
}

export interface LoansSummary {
  totalActive: number;
  totalUpToDate: number;
  totalDelinquent: number;
  /** Porcentaje de morosidad (ej: 25.0 = 25%) */
  delinquencyRate: number;
}

export interface ClientsSummary {
  totalClients: number;
  currentClients: number;
  delinquentClients: number;
  noLoanClients: number;
}

export interface OverdueClientInfo {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface OverdueInstallmentItem {
  installmentId: string;
  loanId: string;
  installmentNumber: number;
  currency: Currency;
  client: OverdueClientInfo;
  /** Fecha de vencimiento 'YYYY-MM-DD' */
  dueDate: string;
  daysOverdue: number;
  expectedAmount: number;
  paidAmount: number;
  pendingAmount: number;
}

export interface HomeDashboardData {
  capitalEnCalle: CapitalEnCalle;
  loansSummary: LoansSummary;
  clientsSummary: ClientsSummary;
  overdueInstallments: OverdueInstallmentItem[];
  generatedAt: string;
}

export interface HomeDashboardResponse {
  data: HomeDashboardData;
  message?: string;
}
