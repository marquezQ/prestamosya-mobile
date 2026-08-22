import { format, isValid, parse } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Formatea un monto en Bolivianos con el prefijo de moneda del proyecto.
 * Ej.: formatBs(1500) → "Bs.- 1.500"
 */
export function formatBs(amount: number): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  return `Bs.- ${safeAmount.toLocaleString('es-BO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
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
    const parsed = parse(dateStr, 'yyyy-MM-dd', new Date());
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
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().split('T')[0];
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
