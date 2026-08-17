import { create } from 'zustand';
import type { Client } from '@/types/client';
import type { SimulatedInstallment } from '@/types/loan';

export type SelectedClient = Pick<Client, 'id' | 'fullName' | 'idNumber'>;

interface NewLoanState {
  currentStep: 1 | 2 | 3;
  selectedClient: SelectedClient | null;
  schedule: SimulatedInstallment[];
}

interface NewLoanActions {
  setStep: (step: 1 | 2 | 3) => void;
  nextStep: () => void;
  prevStep: () => void;
  selectClient: (client: SelectedClient) => void;
  setSchedule: (schedule: SimulatedInstallment[]) => void;
  clearSchedule: () => void;
  reset: () => void;
}

const initialState: NewLoanState = {
  currentStep: 1,
  selectedClient: null,
  schedule: [],
};

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

  setSchedule: (schedule) => set({ schedule }),
  clearSchedule: () => set({ schedule: [] }),

  reset: () => set({ ...initialState }),
}));