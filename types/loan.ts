// ─── Enums alineados con el backend (Prisma) ────────────────

export type LoanMode = 'automatic' | 'manual';

// Valores válidos: daily, weekly, fortnightly (+15 días), monthly, custom.
export type PeriodType = 'daily' | 'weekly' | 'fortnightly' | 'monthly' | 'custom';

export type Currency = 'BOB' | 'USD';

export type LoanStatus = 'ACTIVE' | 'PAID' | 'DEFAULTED' | 'CANCELLED';
export type InstallmentStatus = 'PENDING' | 'PAID' | 'OVERDUE' | 'PARTIAL';

// ─── Cuota individual devuelta por el backend ─────────────────
// Los montos llegan como strings formateados a 2 decimales (precisión financiera).

export interface SimulatedInstallment {
  /** null cuando proviene de /simulate (no persistida); UUID cuando viene de /loans */
  id: string | null;
  installmentNumber: number;
  /** Fecha de calendario 'yyyy-MM-dd' sin zona horaria */
  dueDate: string;
  capitalAmount: string;
  interestAmount: string;
  totalAmount: string;
  paidAmount: string;
  remainingAmount: string;
  status: InstallmentStatus;
  daysOverdue: number;
  paidAt: string | null;
  archived: boolean;
}

// ─── Respuesta de POST /loans/simulate ───────────────────────

export interface LoanSimulationData {
  capitalAmount: number;
  totalAmount: number;
  installments: SimulatedInstallment[];
}

export interface LoanSimulationResponse {
  data: LoanSimulationData;
  message: string;
}

// ─── Parámetros de entrada para simular ─────────────────────

export interface LoanSimulateParams {
  capitalAmount: number;
  currency: Currency;
  interestRate: number;
  periodType: PeriodType;
  totalInstallments: number;
  /** Fecha de desembolso (YYYY-MM-DD). El backend calcula firstDueDate = startDate + 1 período */
  startDate: string;
}

// ─── Inputs para crear préstamo (POST /loans) ─────────────────

export interface CreateAutomaticLoanInput {
  clientId: string;
  mode: 'automatic';
  capitalAmount: number;
  currency: Currency;
  interestRate: number;
  periodType: PeriodType;
  totalInstallments: number;
  /** Fecha de desembolso (YYYY-MM-DD) */
  startDate: string;
  notes?: string;
}

export interface ManualInstallmentInput {
  installmentNumber: number;
  dueDate: string;
  capitalAmount: number;
  interestAmount: number;
  totalAmount: number;
}

export interface CreateManualLoanInput {
  clientId: string;
  mode: 'manual';
  capitalAmount: number;
  currency: Currency;
  interestRate: number;
  periodType: PeriodType;
  totalInstallments: number;
  /** Fecha de desembolso (YYYY-MM-DD) */
  startDate: string;
  notes?: string;
  manualInstallments: ManualInstallmentInput[];
}

// ─── Respuesta de POST /loans (préstamo creado) ───────────────

export interface CreatedLoan {
  id: string;
  clientId: string;
  createdBy: string;
  mode: LoanMode;
  capitalAmount: string;
  currency: Currency;
  interestRate: number;
  periodType: PeriodType;
  totalInstallments: number;
  totalAmount: string;
  totalPaid: string;
  outstandingBalance: string;
  status: LoanStatus;
  startDate: string;
  firstDueDate: string;
  notes: string | null;
  installments: SimulatedInstallment[];
}

export interface CreateLoanResponse {
  data: CreatedLoan;
  message: string;
}

// ─── Fila de cuota editable en el formulario (UI) ────────────

export interface EditableInstallmentRow {
  installmentNumber: number;
  /** Fecha de calendario 'yyyy-MM-dd'. Nula hasta que el usuario la ajusta. */
  dueDate: string | null;
  capitalAmount: string;
  interestAmount: string;
  totalAmount: string;
}

// ─── Opciones para los selects de UI ─────────────────────────

export const PERIOD_OPTIONS: { label: string; value: PeriodType }[] = [
  { label: 'Diario', value: 'daily' },
  { label: 'Semanal', value: 'weekly' },
  { label: 'Quincenal', value: 'fortnightly' },
  { label: 'Mensual', value: 'monthly' },
];

// ─── Respuesta de GET /loans/:id ────────────────────────────

export interface LoanInstallmentItem {
  id: string;
  installmentNumber: number;
  dueDate: string;
  capitalAmount: number;
  interestAmount: number;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'PARTIAL' | string;
  daysOverdue: number;
  paidAt: string | null;
}

export interface LoanGuaranteeItem {
  linkId: string;
  id: string;
  type: string;
  description: string;
  estimatedValue: number;
  status: string;
}

export interface LoanPaymentItem {
  id: string;
  amount: number;
  paymentDate: string;
  method: string;
  notes: string | null;
  voided: boolean;
  voidedAt: string | null;
  voidReason: string | null;
  createdAt: string;
}

export interface LoanDetailData {
  loan: {
    id: string;
    clientId: string;
    clientName: string;
    clientIdNumber: string;
    createdBy: string;
    mode: string;
    capitalAmount: number;
    currency: string;
    interestRate: number;
    periodType: string;
    totalInstallments: number;
    totalAmount: number;
    totalPaid: number;
    outstandingBalance: number;
    status: string;
    startDate: string;
    firstDueDate: string;
    notes: string | null;
    createdAt: string;
  };
  installments: LoanInstallmentItem[];
  guarantees: LoanGuaranteeItem[];
  payments: LoanPaymentItem[];
}

export interface LoanDetailResponse {
  data: LoanDetailData;
  message?: string;
}