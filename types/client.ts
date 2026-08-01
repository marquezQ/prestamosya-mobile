export interface Client {
  id: string;
  fullName: string;
  phone: string;
  idNumber: string;
  phoneAlt: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  status: 'NO_LOAN' | 'WITH_LOAN' | 'OVERDUE' | string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ClientListResponse {
  data: Client[];
}

/** Loan status union */
export type LoanStatus = 'IN_PROGRESS' | 'OVERDUE' | 'COMPLETED';

/** Active loan summary for the client detail view */
export interface ActiveLoanSummary {
  id: string;
  type: string;
  status: LoanStatus;
  totalAmount: number;
  totalDebt: number;
  paidInstallments: number;
  totalInstallments: number;
  nextPaymentDate: string;
  installmentAmount: number;
  frequency: string;
}

/** Completed loan summary */
export interface CompletedLoanSummary {
  id: string;
  totalAmount: number;
  completedDate: string;
}

/** Stats for the client profile */
export interface ClientStats {
  totalPayments: number;
  punctualityPercentage: number;
}

/** Backend response for GET /clients/:id */
export interface ClientDetailResponse {
  data: {
    client: Client;
    activeLoans: any[];
    guarantees: any[];
    financialSummary: any[];
  };
}
