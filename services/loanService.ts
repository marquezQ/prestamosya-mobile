import { api } from './api';
import { ENDPOINTS } from './endpoints';
import type {
  LoanSimulateParams,
  LoanSimulationResponse,
  CreateAutomaticLoanInput,
  CreateManualLoanInput,
  CreateLoanResponse,
} from '@/types/loan';

export const loanService = {
  /**
   * Simula el cronograma de pagos sin persistir nada en la base de datos.
   * POST /loans/simulate
   */
  simulateLoan: async (
    params: LoanSimulateParams,
  ): Promise<LoanSimulationResponse> => {
    const response = await api.post<LoanSimulationResponse>(
      ENDPOINTS.LOANS.SIMULATE,
      params,
    );
    return response.data;
  },

  /**
   * Crea y persiste el préstamo definitivo en la base de datos.
   * POST /loans
   * Acepta tanto modo automático como manual.
   */
  createLoan: async (
    data: CreateAutomaticLoanInput | CreateManualLoanInput,
  ): Promise<CreateLoanResponse> => {
    const response = await api.post<CreateLoanResponse>(
      ENDPOINTS.LOANS.CREATE,
      data,
    );
    return response.data;
  },
};
