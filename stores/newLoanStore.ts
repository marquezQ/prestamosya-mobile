import { create } from 'zustand';
import type { Client } from '@/types/client';
import type { LoanMode, ScheduleInstallment } from '@/types/loan';

// ─── Tipos del store ─────────────────────────────────────────

/** Datos mínimos del cliente para el wizard */
export type SelectedClient = Pick<Client, 'id' | 'fullName' | 'idNumber'>;

interface NewLoanState {
  // Navegación
  currentStep: 1 | 2 | 3;

  // Paso 1 — Cliente seleccionado
  selectedClient: SelectedClient | null;

  // Paso 2 — Configuración (los campos del formulario viven en RHF)
  loanMode: LoanMode;

  // Cronograma calculado de forma explícita (botón "Calcular Cronograma").
  // Se limpia cada vez que cambia algún input del paso 2.
  schedule: ScheduleInstallment[];
}

interface NewLoanActions {
  setStep: (step: 1 | 2 | 3) => void;
  nextStep: () => void;
  prevStep: () => void;

  selectClient: (client: SelectedClient) => void;

  setLoanMode: (mode: LoanMode) => void;

  // Cronograma
  setSchedule: (schedule: ScheduleInstallment[]) => void;
  clearSchedule: () => void;

  // Reset completo
  reset: () => void;
}

// ─── Estado inicial ──────────────────────────────────────────

const initialState: NewLoanState = {
  currentStep: 1,
  selectedClient: null,
  loanMode: 'automatic',
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

  setSchedule: (schedule) => set({ schedule }),
  clearSchedule: () => set({ schedule: [] }),

  reset: () => set({ ...initialState }),
}));