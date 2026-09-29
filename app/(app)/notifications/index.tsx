/**
 * app/(app)/notifications/index.tsx
 *
 * Ruta de la bandeja de notificaciones.
 * Pantalla fullscreen fuera del tab bar (igual que client/[id].tsx).
 *
 * Renderiza exclusivamente <NotificationsView /> siguiendo el patrón
 * de screens delgadas: la lógica vive en el componente, no aquí.
 */

import { NotificationsView } from '@/components/notifications/NotificationsView';

export default function NotificationsScreen() {
  return <NotificationsView />;
}
