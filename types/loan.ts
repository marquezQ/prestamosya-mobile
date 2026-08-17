// ─── Enums alineados con el backend (Prisma) ────────────────

export type LoanMode = 'automatic' | 'manual';

// TODO(PED-20): confirmar el valor exacto del enum del backend.
// Actualmente se envía 'biweekly' para la modalidad "Quincenal" (cada 15 días).
export type PeriodType = 'daily' | 'weekly' | 'monthly' | 'biweekly';

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
  /** Fecha de vencimiento de la 1ra cuota (YYYY-MM-DD) */
  firstDueDate: string;
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
  /** Fecha de vencimiento de la 1ra cuota (YYYY-MM-DD) */
  firstDueDate: string;
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
  startDate: string;
  firstDueDate: string;
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
  { label: 'Quincenal', value: 'biweekly' },
  { label: 'Mensual', value: 'monthly' },
];