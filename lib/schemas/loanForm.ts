import { z } from 'zod';
import type { LoanMode, PeriodType } from '@/types/loan';

// ─── Validadores Reutilizables ───────────────────────────────

const positiveAmount = z
  .string()
  .min(1, 'Ingresa el monto')
  .refine(
    (v) => {
      const n = Number(v);
      return isFinite(n) && n > 0;
    },
    { message: 'Ingresa un monto válido mayor a 0' },
  );

const nonNegativeRate = z
  .string()
  .min(1, 'Ingresa la tasa')
  .refine(
    (v) => {
      const n = Number(v);
      return isFinite(n) && n >= 0 && n <= 100;
    },
    { message: 'La tasa debe estar entre 0 y 100' },
  );

const positiveInt = z
  .string()
  .min(1, 'Ingresa las cuotas')
  .refine(
    (v) => {
      const n = Number(v);
      return isFinite(n) && Number.isInteger(n) && n >= 1 && n <= 360;
    },
    { message: 'Número de cuotas inválido (1–360)' },
  );

/**
 * Fecha obligatoria que inicia como null.
 * Exige interacción con DatePicker según FORMS.md.
 */
const requiredDateField = z
  .string()
  .nullable()
  .refine((val) => val !== null && val.length > 0, {
    message: 'Selecciona la fecha',
  });

// ─── Fila de Cuota Manual ─────────────────────────────────────

export interface ManualInstallmentRow {
  dueDate: string | null;
  totalAmount: string;
}

const manualInstallmentRowSchema = z.object({
  dueDate: requiredDateField,
  totalAmount: positiveAmount,
});

// Schema base permisivo: en modo automático el arreglo se ignora por completo,
// incluso si conserva filas vacías de una sesión manual anterior.
const permissiveInstallmentRowSchema = z.object({
  dueDate: z.string().nullable(),
  totalAmount: z.string(),
});

// ─── Esquema Unificado de Formulario ──────────────────────────

export const loanFormSchema = z
  .object({
    loanMode: z.enum(['automatic', 'manual']),
    capitalAmount: positiveAmount,
    currency: z.enum(['BOB', 'USD']),
    // En modo manual el interés se deriva de los montos de cada cuota y no hay
    // input para la tasa. '' no es undefined, así que .optional() lo rechazaría;
    // se tolera string vacío y el superRefine exige la tasa solo en automático.
    interestRate: z.union([nonNegativeRate, z.literal('')]).optional(),
    periodType: z.enum(['daily', 'weekly', 'fortnightly', 'monthly']).optional(),
    totalInstallments: positiveInt,
    startDate: requiredDateField,
    // Las cuotas manuales solo aplican en modo manual; en automático el
    // cronograma lo genera el backend y este arreglo debe ignorarse.
    installments: z.array(permissiveInstallmentRowSchema).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.loanMode === 'automatic') {
      if (!data.interestRate) {
        ctx.addIssue({
          code: 'custom',
          path: ['interestRate'],
          message: 'Ingresa la tasa',
        });
      }
      if (!data.periodType) {
        ctx.addIssue({
          code: 'custom',
          path: ['periodType'],
          message: 'Selecciona la frecuencia de cobro',
        });
      }
      if (Number(data.totalInstallments) > 100) {
        ctx.addIssue({
          code: 'custom',
          path: ['totalInstallments'],
          message: 'Máximo 100 cuotas',
        });
      }
      return;
    }

    const items = data.installments || [];

    if (items.length === 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['installments'],
        message: 'Agrega al menos una cuota',
      });
      return;
    }

    items.forEach((row, index) => {
      const result = manualInstallmentRowSchema.safeParse(row);
      if (!result.success) {
        for (const issue of result.error.issues) {
          ctx.addIssue({
            code: 'custom',
            path: ['installments', index, ...issue.path],
            message: issue.message,
          });
        }
      }
    });

    const capital = Number(data.capitalAmount);
    const sum = items.reduce(
      (acc, row) => acc + (Number(row?.totalAmount) || 0),
      0,
    );

    if (isFinite(capital) && capital > 0 && sum < capital) {
      ctx.addIssue({
        code: 'custom',
        path: ['capitalAmount'], // Asignamos a capitalAmount para no corromper la estructura de array de `installments` en @hookform/resolvers
        message: 'La suma de las cuotas debe ser al menos igual al capital prestado',
      });
    }
  });

// ─── Interface de Formulario y Valores por Defecto ─────────────

export interface LoanFormValues {
  loanMode: LoanMode;
  capitalAmount: string;
  currency: 'BOB' | 'USD';
  interestRate?: string;
  periodType?: PeriodType;
  totalInstallments: string;
  startDate: string | null;
  installments?: ManualInstallmentRow[];
}

export const createDefaultLoanFormValues = (): LoanFormValues => ({
  loanMode: 'automatic',
  capitalAmount: '',
  currency: 'BOB',
  interestRate: '',
  periodType: 'monthly',
  totalInstallments: '',
  startDate: null,
  installments: [{ dueDate: null, totalAmount: '' }],
});