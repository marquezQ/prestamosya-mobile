import { api } from './api';
import { ENDPOINTS } from './endpoints';
import type {
  LoanSimulateParams,
  LoanSimulationResponse,
  CreateAutomaticLoanInput,
  CreateManualLoanInput,
  CreateLoanResponse,
  LoanDetailResponse,
  GetLoansParams,
  GetLoansResponse,
  LoanListItem,
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

  /**
   * Obtiene la lista de préstamos según filtro y búsqueda opcional.
   * GET /loans?filter=...&search=...
   */
  getLoans: async (params?: GetLoansParams): Promise<LoanListItem[]> => {
    const response = await api.get<GetLoansResponse>(ENDPOINTS.LOANS.LIST, {
      params,
    });
    return response.data.data;
  },

  /**
   * Obtiene el detalle de un préstamo por ID (incluyendo cuotas, pagos y garantías).
   * GET /loans/:id
   */
  getLoanById: async (id: string): Promise<LoanDetailResponse> => {
    const response = await api.get<LoanDetailResponse>(
      ENDPOINTS.LOANS.GET_BY_ID(id),
    );
    return response.data;
  },
};
