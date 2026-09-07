import { format, isValid, parse } from 'date-fns';
import { es } from 'date-fns/locale';

import { Currency } from '@/types/loan';

/**
 * Formatea un monto con el prefijo de moneda correspondiente ('BOB' → "Bs.- 1.500", 'USD' → "$us 1.500").
 */
export function formatCurrency(amount: number, currency: Currency = 'BOB'): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  const formatted = safeAmount.toLocaleString('es-BO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return currency === 'USD' ? `$us ${formatted}` : `Bs.- ${formatted}`;
}

/**
 * Formatea un monto numérico sin prefijo de moneda (ej. "1.500,00").
 */
export function formatAmountNumber(amount: number): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  return safeAmount.toLocaleString('es-BO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

/**
 * Formatea un monto en Bolivianos con el prefijo de moneda del proyecto.
 * Alias retrocompatible de formatCurrency(amount, 'BOB').
 */
export function formatBs(amount: number): string {
  return formatCurrency(amount, 'BOB');
}

/**
 * Formatea una fecha de calendario 'yyyy-MM-dd' en español.
 * Por defecto usa el patrón textual 'dd MMM yyyy'; se puede pasar otro
 * patrón (ej. 'dd/MM/yyyy'). Devuelve '—' para valores vacíos y el string
 * original si no es parseable.
 */
export function formatDateBO(dateStr: string, pattern = 'dd MMM yyyy'): string {
  if (!dateStr) return '—';
  try {
    const cleanDateStr = dateStr.split('T')[0];
    const parsed = parse(cleanDateStr, 'yyyy-MM-dd', new Date());
    return isValid(parsed) ? format(parsed, pattern, { locale: es }) : dateStr;
  } catch {
    return dateStr;
  }
}

/**
 * Devuelve la fecha de hoy como 'yyyy-MM-dd' en la zona horaria LOCAL.
 * No usar `new Date().toISOString()` para fechas de calendario: al estar en
 * UTC puede devolver el día anterior según la hora local.
 */
export function getTodayISO(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

/**
 * Obtiene las iniciales de un nombre completo (máx. 2 letras).
 * Fallback 'CL' cuando el nombre está vacío.
 */
export function getInitials(name: string): string {
  if (!name) return 'CL';
  const parts = name.trim().split(' ');
  if (parts.length >= 2 && parts[0] && parts[1]) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}
