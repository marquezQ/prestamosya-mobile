// ─── Estadísticas Mensuales — GET /api/stats/monthly ─────────────────────
// Los montos por moneda siguen el mismo patrón que `CapitalEnCalle`:
// un objeto con claves por moneda, nunca un campo `currency` individual.

export interface CurrencyAmount {
  BOB: number;
  USD: number;
}

export interface MonthlyPeriod {
  year: number;
  month: number;
  label: string;
  startDate: string;
  endDate: string;
  isCurrentMonth: boolean;
}

export interface IncomeBreakdown {
  interestCollected: CurrencyAmount;
  capitalRecovered: CurrencyAmount;
  totalCashIn: CurrencyAmount;
  discountsGiven: CurrencyAmount;
}

export interface PerformanceSummary {
  installmentsDueCount: number;
  installmentsPaidOnTimeCount: number;
  installmentsPaidLateCount: number;
  installmentsStillOverdueCount: number;
  installmentsPartialCount: number;
  /** Porcentaje de cobranza (0-100) */
  collectionRate: number;
  expectedRevenue: CurrencyAmount;
  actualRevenue: CurrencyAmount;
  /** Porcentaje de eficiencia de ingresos (0-100) */
  revenueEfficiency: number;
}

export interface RiskIndicators {
  /** Porcentaje de morosidad (ej: 16.67 = 16.67%) */
  delinquencyRate: number;
  portfolioAtRisk: CurrencyAmount;
  newLoansCount: number;
  newLoansCapital: CurrencyAmount;
  completedLoansCount: number;
  newClientsCount: number;
  /** Préstamos con al menos una cuota vencida (MVP) */
  overdueLoansCount?: number;
  /** Cuotas impagas del período (MVP) */
  delinquentInstallmentsCount?: number;
}

export interface MonthlyBalance {
  netProfit: CurrencyAmount;
  capitalDeployed: CurrencyAmount;
  /** Retorno sobre capital como porcentaje por moneda (ej: BOB: 3.64 = 3.64%) */
  returnOnCapital: CurrencyAmount;
}

export interface MonthlyStatsData {
  period: MonthlyPeriod;
  incomeBreakdown: IncomeBreakdown;
  performanceSummary: PerformanceSummary;
  riskIndicators: RiskIndicators;
  monthlyBalance: MonthlyBalance;
  generatedAt: string;
}

export interface MonthlyStatsResponse {
  data: MonthlyStatsData;
  message?: string;
}

// ─── Historial Mensual — GET /api/stats/monthly-history ─────────────────
// Arreglo donde el índice 0 es el mes más reciente.

export interface MonthlyHistoryItem {
  year: number;
  month: number;
  label: string;
  interestCollected: CurrencyAmount;
  netProfit: CurrencyAmount;
  /** Porcentaje de cobranza (0-100) */
  collectionRate: number;
  newLoansCount: number;
}

export interface MonthlyHistoryResponse {
  data: MonthlyHistoryItem[];
  message?: string;
}