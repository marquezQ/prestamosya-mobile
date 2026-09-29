/**
 * stores/notificationStore.ts
 *
 * Estado cliente (Zustand) del módulo de notificaciones.
 *
 * REGLA: Este store solo gestiona estado local/efímero:
 *   - El push token del dispositivo (string del SO).
 *   - El unread count optimista (para actualización inmediata del badge).
 *
 * El server-state (lista de notificaciones, datos de la bandeja) vive
 * exclusivamente en React Query — no duplicar aquí.
 */

import { create } from 'zustand';

interface NotificationState {
  /** Token de push del dispositivo. null = no registrado / permisos denegados. */
  pushToken: string | null;
  /** Copia local del total de no leídas para actualizar el badge sin esperar refetch. */
  unreadCount: number;

  setPushToken: (token: string | null) => void;
  setUnreadCount: (count: number) => void;
  /** Decrementa el count en 1 (al marcar una notificación como leída optimistamente). */
  decrementUnread: () => void;
  /** Resetea el count a 0 (al marcar todas como leídas). */
  clearUnread: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  pushToken: null,
  unreadCount: 0,

  setPushToken: (token) => set({ pushToken: token }),

  setUnreadCount: (count) => set({ unreadCount: Math.max(0, count) }),

  decrementUnread: () => set({ unreadCount: Math.max(0, get().unreadCount - 1) }),

  clearUnread: () => set({ unreadCount: 0 }),
}));
