import { create } from 'zustand';
import type { Client } from '@/types/client';
import type { LoanMode, PeriodType, ScheduleInstallment } from '@/types/loan';

// ─── Tipos del store ─────────────────────────────────────────

/** Datos mínimos del cliente para el wizard */
export type SelectedClient = Pick<Client, 'id' | 'fullName' | 'idNumber'>;

/** Fila de cuota manual */
export interface ManualInstallmentEntry {
  dueDate: string;
  totalAmount: string;
}

interface NewLoanState {
  // Navegación
  currentStep: 1 | 2 | 3;

  // Paso 1 — Cliente seleccionado
  selectedClient: SelectedClient | null;

  // Paso 2 — Configuración
  loanMode: LoanMode;

  // Modo automático
  capitalAmount: string;
  interestRate: string;
  periodType: PeriodType;
  totalInstallments: string;

  // Modo manual
  manualCapitalAmount: string;
  manualInstallments: ManualInstallmentEntry[];

  // Cronograma generado (ambos modos)
  schedule: ScheduleInstallment[];
}

interface NewLoanActions {
  setStep: (step: 1 | 2 | 3) => void;
  nextStep: () => void;
  prevStep: () => void;

  selectClient: (client: SelectedClient) => void;

  setLoanMode: (mode: LoanMode) => void;

  // Modo automático
  setAutoField: <K extends 'capitalAmount' | 'interestRate' | 'totalInstallments'>(
    field: K,
    value: string,
  ) => void;
  setPeriodType: (periodType: PeriodType) => void;

  // Modo manual
  setManualCapitalAmount: (value: string) => void;
  updateManualInstallment: (index: number, field: keyof ManualInstallmentEntry, value: string) => void;
  addManualInstallment: () => void;
  removeManualInstallment: (index: number) => void;

  // Cronograma
  setSchedule: (schedule: ScheduleInstallment[]) => void;

  // Reset completo
  reset: () => void;
}

// ─── Estado inicial ──────────────────────────────────────────

const createInitialManualInstallments = (): ManualInstallmentEntry[] => [
  { dueDate: '', totalAmount: '' },
  { dueDate: '', totalAmount: '' },
  { dueDate: '', totalAmount: '' },
];

const initialState: NewLoanState = {
  currentStep: 1,
  selectedClient: null,
  loanMode: 'automatic',
  capitalAmount: '',
  interestRate: '',
  periodType: 'monthly',
  totalInstallments: '',
  manualCapitalAmount: '',
  manualInstallments: createInitialManualInstallments(),
  schedule: [],
};

// ─── Store ───────────────────────────────────────────────────

export const useNewLoanStore = create<NewLoanState & NewLoanActions>()((set) => ({
  ...initialState,

  setStep: (step) => set({ currentStep: step }),
  nextStep: () =>
    set((s) => ({
      currentStep: Math.min(s.currentStep + 1, 3) as 1 | 2 | 3,
    })),
  prevStep: () =>
    set((s) => ({
      currentStep: Math.max(s.currentStep - 1, 1) as 1 | 2 | 3,
    })),

  selectClient: (client) => set({ selectedClient: client }),

  setLoanMode: (mode) => set({ loanMode: mode, schedule: [] }),

  setAutoField: (field, value) => set({ [field]: value }),
  setPeriodType: (periodType) => set({ periodType }),

  setManualCapitalAmount: (value) => set({ manualCapitalAmount: value }),
  updateManualInstallment: (index, field, value) =>
    set((s) => {
      const updated = [...s.manualInstallments];
      updated[index] = { ...updated[index], [field]: value };
      return { manualInstallments: updated };
    }),
  addManualInstallment: () =>
    set((s) => ({
      manualInstallments: [...s.manualInstallments, { dueDate: '', totalAmount: '' }],
    })),
  removeManualInstallment: (index) =>
    set((s) => ({
      manualInstallments: s.manualInstallments.filter((_, i) => i !== index),
    })),

  setSchedule: (schedule) => set({ schedule }),

  reset: () => set({ ...initialState, manualInstallments: createInitialManualInstallments() }),
}));
