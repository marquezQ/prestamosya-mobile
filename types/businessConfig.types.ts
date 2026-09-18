/**
 * Tipos para el módulo business-config.
 * El backend auto-crea la config con defaults si no existe (GET /api/business-config).
 * El PATCH es parcial — solo se persisten los campos enviados.
 */

export type PeriodType = 'monthly' | 'weekly' | 'biweekly';
export type PrimaryCurrency = 'BOB' | 'USD';

export interface BusinessConfig {
  id: string;
  businessName: string;
  primaryCurrency: PrimaryCurrency;
  exchangeRate: number;        // Tipo de cambio BOB/USD — ej. 6.96
  defaultInterestRate: number; // Tasa de interés por defecto — ej. 10 → 10%
  defaultPeriodType: PeriodType;
  graceDays: number;           // Días de gracia antes de mora
  createdAt: string;
  updatedAt: string;
}

/** Payload para PATCH /api/business-config — todos los campos son opcionales */
export type BusinessConfigUpdateInput = Partial<
  Omit<BusinessConfig, 'id' | 'createdAt' | 'updatedAt'>
>;
