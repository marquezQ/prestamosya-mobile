import { AlertCircle, CheckCircle2, Clock } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';

/**
 * Fuente única de configuración visual para el estado de una cuota.
 * Consumida por InstallmentCard y LoanScheduleTable para mantener
 * etiquetas y colores consistentes en todo el módulo de Cobros.
 */
export interface InstallmentStatusConfig {
  label: string;
  bg: string;
  textColor: string;
  icon: LucideIcon;
  iconColor: string;
}

const INSTALLMENT_STATUS_CONFIG: Record<string, InstallmentStatusConfig> = {
  PAID: {
    label: 'Pagada',
    bg: 'bg-green-500/10 dark:bg-green-500/20',
    textColor: 'text-green-600 dark:text-green-400',
    icon: CheckCircle2,
    iconColor: '#22c55e',
  },
  PARTIAL: {
    label: 'Parcial',
    bg: 'bg-blue-500/10 dark:bg-blue-500/20',
    textColor: 'text-blue-600 dark:text-blue-400',
    icon: Clock,
    iconColor: '#3b82f6',
  },
  OVERDUE: {
    label: 'Vencida',
    bg: 'bg-red-500/10 dark:bg-red-500/20',
    textColor: 'text-red-600 dark:text-red-400',
    icon: AlertCircle,
    iconColor: '#ef4444',
  },
  PENDING: {
    label: 'Pendiente',
    bg: 'bg-amber-500/10 dark:bg-amber-500/20',
    textColor: 'text-amber-600 dark:text-amber-400',
    icon: Clock,
    iconColor: '#f59e0b',
  },
};

export function getInstallmentStatusConfig(status: string): InstallmentStatusConfig {
  return INSTALLMENT_STATUS_CONFIG[status] ?? INSTALLMENT_STATUS_CONFIG.PENDING;
}
