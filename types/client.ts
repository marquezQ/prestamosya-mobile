export interface Client {
  id: string;
  fullName: string;
  phone: string;
  idNumber: string;
  phoneAlt: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  status: 'CURRENT' | 'DELINQUENT' | 'NO_LOAN';
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  activeLoanCount?: number;
}

export interface ClientCreateInput {
  fullName: string;
  phone: string;
  idNumber: string;
  phoneAlt: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  notes: string | null;
}

/**
 * PATCH /api/clients/:id — todos los campos son opcionales.
 * El campo `status` es calculado por el backend y NO se envía.
 */
export type ClientUpdateInput = Partial<ClientCreateInput>;

export interface ClientListResponse {
  data: Client[];
}

/** Client loan summary in GET /api/clients/:id */
export interface ClientLoanSummary {
  id: string;
  currency: string;
  mode: string;
  capitalAmount: number;
  interestRate: number;
  periodType: string;
  totalInstallments: number;
  totalAmount: number;
  totalPaid: number;
  outstandingBalance: number;
  status: string; // 'ACTIVE', 'COMPLETED', 'DEFAULTED', 'REFINANCED'
  startDate: string;
  createdAt: string;
}

/** Client guarantee summary in GET /api/clients/:id */
export interface ClientGuaranteeSummary {
  id: string;
  type: string;
  description: string;
  estimatedValue: number;
  status: string;
  imageUrl?: string | null;
  createdAt: string;
}



/** Backend response for GET /api/clients/:id */
export interface ClientDetailResponse {
  data: {
    client: Client;
    activeLoans: ClientLoanSummary[];
    completedLoans: ClientLoanSummary[];
    guarantees: ClientGuaranteeSummary[];
  };
}

