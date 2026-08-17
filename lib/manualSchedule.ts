import type { ManualInstallmentRow } from '@/lib/schemas/loanForm';
import type {
  ManualInstallmentInput,
  SimulatedInstallment,
} from '@/types/loan';

interface AllocatedInstallment {
  capitalAmount: number;
  interestAmount: number;
}

/**
 * Reparte el capital prestado entre las cuotas de forma proporcional a su monto
 * y deja el interés como residuo (cuota - capital). Opera en céntimos para
 * evitar errores de punto flotante; la última cuota absorbe el redondeo para que
 * la suma de capitales sea exactamente el monto prestado y la suma de intereses
 * sea exactamente (total pagado - capital prestado).
 */
function allocateCapital(
  rows: ManualInstallmentRow[],
  capital: number,
): AllocatedInstallment[] {
  const totalsCents = rows.map((row) =>
    Math.round((Number(row.totalAmount) || 0) * 100),
  );
  const totalPaidCents = totalsCents.reduce((sum, value) => sum + value, 0);
  const capitalCents = Math.round(capital * 100);

  if (totalPaidCents <= 0 || !isFinite(capitalCents) || capitalCents <= 0) {
    return rows.map(() => ({ capitalAmount: 0, interestAmount: 0 }));
  }

  let allocatedCents = 0;
  return totalsCents.map((totalCents, index) => {
    const isLast = index === totalsCents.length - 1;
    const capitalCentsForInstallment = isLast
      ? capitalCents - allocatedCents
      : Math.round((capitalCents * totalCents) / totalPaidCents);
    allocatedCents += capitalCentsForInstallment;

    return {
      capitalAmount: capitalCentsForInstallment / 100,
      interestAmount: (totalCents - capitalCentsForInstallment) / 100,
    };
  });
}

/** Construye el cronograma manual (store) a partir de las cuotas del formulario. */
export function buildManualSchedule(
  rows: ManualInstallmentRow[],
  capital: number,
): SimulatedInstallment[] {
  return allocateCapital(rows, capital).map((installment, index) => {
    const total = Number(rows[index].totalAmount) || 0;
    const totalStr = total.toFixed(2);
    return {
      id: null,
      installmentNumber: index + 1,
      dueDate: rows[index].dueDate!,
      capitalAmount: installment.capitalAmount.toFixed(2),
      interestAmount: installment.interestAmount.toFixed(2),
      totalAmount: totalStr,
      paidAmount: '0.00',
      remainingAmount: totalStr,
      status: 'PENDING',
      daysOverdue: 0,
      paidAt: null,
      archived: false,
    };
  });
}

/** Construye las cuotas manuales para el payload de creación (POST /loans). */
export function buildManualInstallmentsInput(
  rows: ManualInstallmentRow[],
  capital: number,
): ManualInstallmentInput[] {
  return allocateCapital(rows, capital).map((installment, index) => {
    const total = Number(rows[index].totalAmount) || 0;
    return {
      installmentNumber: index + 1,
      dueDate: rows[index].dueDate!,
      capitalAmount: installment.capitalAmount,
      interestAmount: installment.interestAmount,
      totalAmount: total,
    };
  });
}