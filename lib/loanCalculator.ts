import { addDays, addWeeks, addMonths } from 'date-fns';
import type { PeriodType, ScheduleInstallment } from '@/types/loan';

/**
 * Calcula el cronograma de pagos en modo automático.
 *
 * Fórmula (interés fijo sobre capital, alineada con BUSINESS_RULES.md):
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
      dueDate: dueDate.toISOString(),
      capitalAmount: thisCapital,
      interestAmount: interestPerInstallment,
      totalAmount: round2(thisCapital + interestPerInstallment),
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
    case 'custom':
      // Usado para "Quincenal" (2 semanas) en la UI
      return addWeeks(startDate, installmentNumber * 2);
  }
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
