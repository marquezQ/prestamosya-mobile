/**
 * services/notificationService.ts
 *
 * Capa de acceso a datos para el módulo de notificaciones.
 * Toda comunicación con /api/notifications pasa por aquí.
 * Los consumidores (hooks de React Query) NO hacen llamadas directas a `api`.
 */

import { api } from './api';
import { ENDPOINTS } from './endpoints';
import type {
  NotificationPage,
  GetNotificationsParams,
  DeviceTokenPayload,
} from '@/types/notification';

export const notificationService = {
  /**
   * Lista paginada de notificaciones del usuario autenticado.
   * El campo `unread` del response siempre refleja el total global,
   * independiente de los filtros aplicados.
   */
  async getNotifications(params: GetNotificationsParams = {}): Promise<NotificationPage> {
    const { data } = await api.get<NotificationPage>(ENDPOINTS.NOTIFICATIONS.LIST, {
      params,
    });
    return data;
  },

  /**
   * Total de notificaciones no leídas.
   * El backend devuelve un número entero directo (no un objeto).
   * Usado para el badge de la campanita en el header.
   */
  async getUnreadCount(): Promise<number> {
    const { data } = await api.get<number>(ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT);
    return data;
  },

  /**
   * Marca una notificación específica como leída.
   * @returns true si se marcó, false si ya estaba leída o no pertenece al usuario.
   */
  async markAsRead(id: string): Promise<boolean> {
    const { data } = await api.patch<boolean>(ENDPOINTS.NOTIFICATIONS.MARK_READ(id));
    return data;
  },

  /**
   * Marca todas las notificaciones no leídas del usuario como leídas.
   * @returns Cantidad de notificaciones actualizadas (0 si ya todas estaban leídas).
   */
  async markAllAsRead(): Promise<number> {
    const { data } = await api.patch<number>(ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
    return data;
  },

  /**
   * Registra el token de push del dispositivo en el backend.
   * El backend hace upsert — si el token ya existe, no lo duplica.
   *
   * CUÁNDO LLAMAR: al hacer login exitoso y cada vez que el token cambie
   * (via addPushTokenListener).
   */
  async registerDeviceToken(payload: DeviceTokenPayload): Promise<void> {
    const body = {
      token: payload.token,
      platform: payload.platform || 'expo',
    };
    console.log('[NotificationService] Enviando POST /notifications/device-tokens a:', ENDPOINTS.NOTIFICATIONS.REGISTER_TOKEN, body);
    const res = await api.post(ENDPOINTS.NOTIFICATIONS.REGISTER_TOKEN, body);
    console.log('[NotificationService] Token registrado con éxito en backend. Status:', res.status);
  },

  /**
   * Elimina el token de push del dispositivo del backend.
   * Si el token no existe, el backend responde 200 igualmente (idempotente).
   *
   * CUÁNDO LLAMAR: siempre antes de hacer logout (manual o por expiración de JWT).
   */
  async deleteDeviceToken(payload: DeviceTokenPayload): Promise<void> {
    const body = {
      token: payload.token,
      platform: payload.platform || 'expo',
    };
    console.log('[NotificationService] Enviando DELETE /notifications/device-tokens:', body);
    await api.delete(ENDPOINTS.NOTIFICATIONS.DELETE_TOKEN, { data: body });
    console.log('[NotificationService] Token eliminado con éxito del backend.');
  },
};
