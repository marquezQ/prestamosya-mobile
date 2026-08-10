import { z } from 'zod';
import type { LoanMode, ManualInstallmentRow, PeriodType } from '@/types/loan';

// ─── Validadores reutilizables ───────────────────────────────

const positiveAmount = z
  .string()
  .min(1, 'Ingresa el monto')
  .refine((v) => {
    const n = Number(v);
    return isFinite(n) && n > 0;
  }, { message: 'Ingresa un monto válido' });

const nonNegativeNumber = z
  .string()
  .min(1, 'Ingresa la tasa')
  .refine((v) => {
    const n = Number(v);
    return isFinite(n) && n >= 0;
  }, { message: 'Ingresa una tasa válida' });

const positiveInt = z
  .string()
  .min(1, 'Ingresa el número de cuotas')
  .refine((v) => {
    const n = Number(v);
    return isFinite(n) && Number.isInteger(n) && n >= 1;
  }, { message: 'Número de cuotas inválido' });

// ─── Esquemas por modalidad ──────────────────────────────────

export const automaticLoanSchema = z.object({
  loanMode: z.literal('automatic'),
  capitalAmount: positiveAmount,
  interestRate: nonNegativeNumber,
  periodType: z.enum(['daily', 'weekly', 'monthly', 'biweekly']),
  totalInstallments: positiveInt,
  startDate: z.string().min(1, 'Selecciona la fecha de inicio'),
});

export const manualLoanSchema = z
  .object({
    loanMode: z.literal('manual'),
    manualCapitalAmount: positiveAmount,
    installments: z
      .array(
        z.object({
          dueDate: z
            .string()
            .nullable()
            .refine((val) => val !== null && val.length > 0, {
              message: 'Selecciona la fecha',
            }),
          totalAmount: positiveAmount,
        }),
      )
      .min(1, 'Agrega al menos una cuota'),
  })
  .superRefine((data, ctx) => {
    const capital = Number(data.manualCapitalAmount);
    const sum = data.installments.reduce(
      (acc, row) => acc + (Number(row.totalAmount) || 0),
      0,
    );
    if (isFinite(capital) && sum < capital) {
      ctx.addIssue({
        code: 'custom',
        path: ['installments'],
        message: 'La suma de cuotas debe ser al menos igual al capital prestado',
      });
    }
  });

/**
 * Unión discriminada por `loanMode`: solo se validan los campos de la
 * modalidad activa en cada momento.
 */
export const loanFormSchema = z.discriminatedUnion('loanMode', [
  automaticLoanSchema,
  manualLoanSchema,
]);

// ─── Valores del formulario (shape plano, soportado por RHF) ──

export interface LoanFormValues {
  loanMode: LoanMode;
  // Automático
  capitalAmount: string;
  interestRate: string;
  periodType: PeriodType;
  totalInstallments: string;
  startDate: string;
  // Manual
  manualCapitalAmount: string;
  installments: ManualInstallmentRow[];
}

export const createLoanFormDefaultValues = (today: string): LoanFormValues => ({
  loanMode: 'automatic',
  capitalAmount: '',
  interestRate: '',
  periodType: 'monthly',
  totalInstallments: '',
  startDate: today,
  manualCapitalAmount: '',
  installments: [{ dueDate: null, totalAmount: '' }],
});