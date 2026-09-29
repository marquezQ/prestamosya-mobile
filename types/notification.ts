/**
 * types/notification.ts
 *
 * Tipos del dominio de notificaciones, derivados del contrato de API del backend.
 * Cada campo refleja exactamente la respuesta del servidor — no agregar
 * transformaciones aquí. Las transformaciones de presentación van en los
 * componentes o en helpers de lib/format.ts.
 */

// ─── Enums ────────────────────────────────────────────────────────────────────

/**
 * Tipo de notificación.
 * - DAILY_SUMMARY: Resumen diario generado por el cron de las 8:00 AM (Bolivia).
 * - DAILY_OVERDUE: Reservado — alerta específica de mora crítica (futura).
 * - PAYMENT_DUE:   Reservado — alerta de cuota por vencer (futura).
 * - SYSTEM:        Mensajes administrativos del sistema.
 */
export type NotificationType =
  | 'DAILY_SUMMARY'
  | 'DAILY_OVERDUE'
  | 'PAYMENT_DUE'
  | 'SYSTEM';

// ─── Payload específicos por tipo ─────────────────────────────────────────────

/** Payload del resumen diario (type = DAILY_SUMMARY) */
export interface DailySummaryPayload {
  dueTodayCount: number;
  overdueClients: number;
}

/**
 * Payload genérico. El backend puede devolver distintas estructuras
 * según el tipo de notificación. Se tipan los campos conocidos y el
 * resto queda como índice abierto para compatibilidad futura.
 */
export type NotificationPayload = DailySummaryPayload | Record<string, unknown> | null;

// ─── Entidad principal ────────────────────────────────────────────────────────

export interface Notification {
  id: string;                      // UUID
  type: NotificationType;
  title: string;
  body: string;
  payload: NotificationPayload;
  /** null = no leída. ISO timestamp = leída. */
  readAt: string | null;
  createdAt: string;               // ISO timestamp
}

// ─── Respuesta paginada ───────────────────────────────────────────────────────

export interface NotificationPage {
  items: Notification[];
  total: number;
  page: number;
  perPage: number;
  /** Total global de no leídas del usuario (independiente del filtro activo). */
  unread: number;
}

// ─── Parámetros de query ──────────────────────────────────────────────────────

export interface GetNotificationsParams {
  page?: number;
  perPage?: number;
  unreadOnly?: boolean;
  type?: NotificationType;
}

// ─── Device token ─────────────────────────────────────────────────────────────

/** Plataformas soportadas actualmente por el backend. */
export type PushPlatform = 'expo' | 'fcm' | 'webpush';

export interface DeviceTokenPayload {
  token: string;
  deviceToken?: string;
  platform: PushPlatform | string;
}
