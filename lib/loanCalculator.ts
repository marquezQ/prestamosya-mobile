import { addDays, addWeeks, addMonths, parse } from 'date-fns';
import type {
  LoanMode,
  ManualInstallmentRow,
  PeriodType,
  ScheduleInstallment,
} from '@/types/loan';

/**
 * Calcula el cronograma de pagos en modo automático.
 *
 * Fórmula (interés fijo sobre capital):
 *   interés por cuota = capital × tasa
 *   capital por cuota  = capital / n_cuotas
 *   cuota total        = capital_por_cuota + interés_por_cuota
 *   última cuota absorbe diferencia de redondeo
 *
 * @example
 * // Bs 1.000 al 10% mensual × 3 cuotas
 * // interés = 1000 × 0.10 = 100
 * // capital = 1000 / 3    = 333.33
 * // cuota   = 433.33 (última: 433.34 por redondeo)
 */
export function calculateAutomaticSchedule(params: {
  capitalAmount: number;
  interestRate: number; // porcentaje: 10 = 10%
  periodType: PeriodType;
  totalInstallments: number;
  startDate: Date;
}): ScheduleInstallment[] {
  const { capitalAmount, interestRate, periodType, totalInstallments, startDate } = params;

  if (totalInstallments <= 0 || capitalAmount <= 0) return [];

  const rate = interestRate / 100;
  const interestPerInstallment = round2(capitalAmount * rate);
  const capitalPerInstallment = round2(capitalAmount / totalInstallments);

  const schedule: ScheduleInstallment[] = [];
  let accumulatedCapital = 0;

  for (let i = 1; i <= totalInstallments; i++) {
    const dueDate = getNextDueDate(startDate, periodType, i);

    const isLast = i === totalInstallments;
    // Última cuota absorbe la diferencia de redondeo
    const thisCapital = isLast
      ? round2(capitalAmount - accumulatedCapital)
      : capitalPerInstallment;

    accumulatedCapital += thisCapital;

    schedule.push({
      number: i,
      dueDate: formatDate(dueDate),
      capitalAmount: thisCapital,
      interestAmount: interestPerInstallment,
      totalAmount: round2(thisCapital + interestPerInstallment),
    });
  }

  return schedule;
}

// ─── Derivación del cronograma desde el estado del formulario ─

interface DeriveScheduleParams {
  loanMode: LoanMode;
  capitalAmount?: string;
  interestRate?: string;
  periodType?: PeriodType;
  totalInstallments?: string;
  startDate?: string;
  manualInstallments?: ManualInstallmentRow[];
}

/**
 * Valor derivado (no estado): calcula el cronograma a partir de los
 * campos del formulario. Devuelve `[]` si los datos aún son inválidos,
 * por lo que el preview y el resumen nunca muestran datos desactualizados.
 */
export function deriveSchedule(params: DeriveScheduleParams): ScheduleInstallment[] {
  if (params.loanMode === 'automatic') {
    const capital = Number(params.capitalAmount);
    const rate = Number(params.interestRate);
    const installments = Number(params.totalInstallments);
    const startDate = params.startDate ? parse(params.startDate, 'yyyy-MM-dd', new Date()) : null;

    if (
      !isFinite(capital) || capital <= 0 ||
      !isFinite(rate) || rate < 0 ||
      !isFinite(installments) || !Number.isInteger(installments) || installments < 1 ||
      !startDate || isNaN(startDate.getTime())
    ) {
      return [];
    }

    return calculateAutomaticSchedule({
      capitalAmount: capital,
      interestRate: rate,
      periodType: params.periodType ?? 'monthly',
      totalInstallments: installments,
      startDate,
    });
  }

  // ── Manual: cada fila es una cuota (el interés va incluido en el monto) ──
  if (!params.manualInstallments || params.manualInstallments.length === 0) return [];

  const schedule: ScheduleInstallment[] = [];
  for (let i = 0; i < params.manualInstallments.length; i++) {
    const row = params.manualInstallments[i];
    const dueDate = row.dueDate ? row.dueDate.trim() : '';
    const total = Number(row.totalAmount);
    const parsedDate = parse(dueDate, 'yyyy-MM-dd', new Date());

    // Cualquier fila inválida invalida el cronograma completo.
    if (!dueDate || isNaN(parsedDate.getTime()) || !isFinite(total) || total <= 0) {
      return [];
    }

    schedule.push({
      number: i + 1,
      dueDate: formatDate(parsedDate),
      capitalAmount: round2(total),
      interestAmount: 0,
      totalAmount: round2(total),
    });
  }

  return schedule;
}

// ─── Helpers internos ────────────────────────────────────────

function getNextDueDate(startDate: Date, periodType: PeriodType, installmentNumber: number): Date {
  switch (periodType) {
    case 'daily':
      return addDays(startDate, installmentNumber);
    case 'weekly':
      return addWeeks(startDate, installmentNumber);
    case 'monthly':
      return addMonths(startDate, installmentNumber);
    case 'biweekly':
      // Quincenal = exactamente cada 15 días
      return addDays(startDate, installmentNumber * 15);
  }
}

/** Serializa una fecha de calendario como 'yyyy-MM-dd' (sin zona horaria). */
function formatDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}