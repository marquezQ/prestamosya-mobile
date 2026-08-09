// ─── Enums alineados con el backend (Prisma) ────────────────

export type LoanMode = 'automatic' | 'manual';

export type PeriodType = 'daily' | 'weekly' | 'monthly' | 'custom';

export type Currency = 'BOB' | 'USD';

// ─── Cuota individual del cronograma ─────────────────────────

export interface ScheduleInstallment {
  /** Número de cuota (1-indexed) */
  number: number;
  /** Fecha de vencimiento (ISO string) */
  dueDate: string;
  /** Porción de capital en esta cuota */
  capitalAmount: number;
  /** Porción de interés en esta cuota */
  interestAmount: number;
  /** Monto total de la cuota (capital + interés) */
  totalAmount: number;
}

// ─── Opciones para los selects de UI ─────────────────────────

export const PERIOD_OPTIONS: { label: string; value: PeriodType }[] = [
  { label: 'Semanal', value: 'weekly' },
  { label: 'Quincenal', value: 'custom' },
  { label: 'Mensual', value: 'monthly' },
];

// ─── Inputs para crear préstamo ──────────────────────────────

export interface AutomaticLoanInput {
  mode: 'automatic';
  clientId: string;
  capitalAmount: number;
  interestRate: number;
  periodType: PeriodType;
  totalInstallments: number;
  currency: Currency;
  startDate: string;
  notes?: string;
}

export interface ManualLoanInput {
  mode: 'manual';
  clientId: string;
  capitalAmount: number;
  currency: Currency;
  installments: { dueDate: string; totalAmount: number }[];
  notes?: string;
}

export type CreateLoanInput = AutomaticLoanInput | ManualLoanInput;
