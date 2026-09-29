/**
 * components/notifications/NotificationCard.tsx
 *
 * Card individual para una notificación en la bandeja.
 *
 * Visual:
 *   - No leída: punto celeste, título en bold, fondo ligeramente resaltado.
 *   - Leída: sin punto, título normal, fondo estándar.
 *   - Al tocar: marca como leída vía PATCH /notifications/:id/read.
 *
 * La fecha relativa (ej. "hace 2 horas") se formatea con date-fns en español.
 * Los timestamps del backend son ISO completos → parseISO es correcto aquí.
 */

import { View, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { Bell, BellRing, AlertCircle, Info } from 'lucide-react-native';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { palette } from '@/lib/theme/colors';
import type { Notification, NotificationType } from '@/types/notification';

// ─── Configuración de iconos por tipo ─────────────────────────────────────────

interface TypeConfig {
  Icon: typeof Bell;
  iconColor: string;
  bgClass: string;
}

function getTypeConfig(type: NotificationType): TypeConfig {
  switch (type) {
    case 'DAILY_SUMMARY':
      return { Icon: BellRing, iconColor: palette.azul, bgClass: 'bg-secondary/10' };
    case 'SYSTEM':
      return { Icon: Info, iconColor: palette.celeste, bgClass: 'bg-primary/10' };
    case 'DAILY_OVERDUE':
    case 'PAYMENT_DUE':
      return { Icon: AlertCircle, iconColor: '#f97316', bgClass: 'bg-orange-500/10' };
    default:
      return { Icon: Bell, iconColor: palette.azul, bgClass: 'bg-secondary/10' };
  }
}

// ─── Helper de fecha relativa ──────────────────────────────────────────────────

function formatRelativeDate(isoString: string): string {
  try {
    return formatDistanceToNow(parseISO(isoString), { addSuffix: true, locale: es });
  } catch {
    return '';
  }
}

// ─── Props ─────────────────────────────────────────────────────────────────────

interface NotificationCardProps {
  notification: Notification;
  onPress: (id: string) => void;
  isMarkingRead?: boolean;
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function NotificationCard({
  notification,
  onPress,
  isMarkingRead = false,
}: NotificationCardProps) {
  const isUnread = notification.readAt === null;
  const { Icon, iconColor, bgClass } = getTypeConfig(notification.type);

  return (
    <Pressable
      onPress={() => onPress(notification.id)}
      disabled={isMarkingRead}
      accessibilityLabel={`Notificación: ${notification.title}. ${isUnread ? 'No leída.' : 'Leída.'}`}
      accessibilityRole="button"
      className={[
        'flex-row items-start gap-3 px-4 py-4',
        'border-b border-border/60',
        isUnread ? 'bg-primary/5' : 'bg-transparent',
        isMarkingRead ? 'opacity-60' : '',
      ].join(' ')}
    >
      {/* Ícono del tipo de notificación */}
      <View className={`w-10 h-10 rounded-2xl ${bgClass} items-center justify-center flex-shrink-0 mt-0.5`}>
        <Icon size={18} color={iconColor} />
      </View>

      {/* Contenido */}
      <View className="flex-1 gap-1">
        <View className="flex-row items-center justify-between gap-2">
          <Text
            className={`text-sm flex-1 ${isUnread ? 'font-bold text-foreground' : 'font-medium text-foreground/80'}`}
            numberOfLines={2}
          >
            {notification.title}
          </Text>

          {/* Punto de no leída */}
          {isUnread && (
            <View className="w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0" />
          )}
        </View>

        <Text
          className="text-sm text-muted-foreground leading-5"
          numberOfLines={3}
        >
          {notification.body}
        </Text>

        <Text className="text-xs text-muted-foreground/70 mt-0.5">
          {formatRelativeDate(notification.createdAt)}
        </Text>
      </View>
    </Pressable>
  );
}
