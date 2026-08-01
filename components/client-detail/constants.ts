import { ActiveLoanSummary, CompletedLoanSummary, ClientStats } from '@/types/client';

export const MOCK_ACTIVE_LOANS: ActiveLoanSummary[] = [
  {
    id: 'L-101',
    type: 'MICRO-CRÉDITO COMERCIAL',
    status: 'IN_PROGRESS',
    totalAmount: 2000,
    totalDebt: 2000,
    paidInstallments: 7,
    totalInstallments: 12,
    nextPaymentDate: new Date().toISOString(), // Hoy
    installmentAmount: 350,
    frequency: 'Semanal',
  },
  {
    id: 'L-102',
    type: 'PRÉSTAMO PERSONAL',
    status: 'IN_PROGRESS',
    totalAmount: 1500,
    totalDebt: 1500,
    paidInstallments: 8,
    totalInstallments: 10,
    nextPaymentDate: '2026-05-25T00:00:00.000Z',
    installmentAmount: 150,
    frequency: 'Quincenal',
  }
];

export const MOCK_COMPLETED_LOANS: CompletedLoanSummary[] = [
  {
    id: 'L-090',
    totalAmount: 5000,
    completedDate: '2025-11-15T00:00:00.000Z',
  }
];

export const MOCK_CLIENT_STATS: ClientStats = {
  totalPayments: 14,
  punctualityPercentage: 98.2,
};
