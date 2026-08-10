// ─── Enums alineados con el backend (Prisma) ────────────────

export type LoanMode = 'automatic' | 'manual';

// TODO(PED-20): confirmar el valor exacto del enum del backend.
// Actualmente se envía 'biweekly' para la modalidad "Quincenal" (cada 15 días).
export type PeriodType = 'daily' | 'weekly' | 'monthly' | 'biweekly';

export type Currency = 'BOB' | 'USD';

// ─── Cuota individual del cronograma ─────────────────────────

export interface ScheduleInstallment {
  /** Número de cuota (1-indexed) */
  number: number;
  /** Fecha de vencimiento (fecha de calendario 'yyyy-MM-dd' sin zona horaria) */
  dueDate: string;
  /** Porción de capital en esta cuota */
  capitalAmount: number;
  /** Porción de interés en esta cuota */
  interestAmount: number;
  /** Monto total de la cuota (capital + interés) */
  totalAmount: number;
}

// ─── Fila de cuota manual (UI/formulario) ────────────────────

export interface ManualInstallmentRow {
  /** Fecha de calendario 'yyyy-MM-dd'. Nula hasta que el usuario elige. */
  dueDate: string | null;
  /** Monto de la cuota como string (validado por Zod). */
  totalAmount: string;
}

// ─── Opciones para los selects de UI ─────────────────────────

export const PERIOD_OPTIONS: { label: string; value: PeriodType }[] = [
  { label: 'Semanal', value: 'weekly' },
  { label: 'Quincenal', value: 'biweekly' },
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