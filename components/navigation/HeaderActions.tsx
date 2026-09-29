/**
 * components/navigation/HeaderActions.tsx
 *
 * Acciones del lado derecho del header compartido (visible en todos los tabs).
 *
 * Incluye:
 *   - Botón de campanita con badge de no leídas.
 *   - Toggle dark/light mode.
 *   - Dropdown de cuenta (perfil, cerrar sesión).
 *
 * El unread count se refresca:
 *   - Al montar el componente (useUnreadCount con staleTime: 0).
 *   - Al recuperar foco (AppState: 'active' → refetch).
 *   - Automáticamente tras marcar como leídas (invalidación de QueryKey).
 */

import { useEffect, useCallback } from 'react';
import { View, Pressable, AppState, type AppStateStatus } from 'react-native';
import { Text } from '@/components/ui/text';
import { Sun, Moon, User as UserIcon, UserCog, LogOut, Bell } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { Icon } from '@/components/ui/icon';
import { useLogout } from '@/hooks/useAuth';
import { useUnreadCount } from '@/hooks/useUnreadCount';
import { useNotificationStore } from '@/stores/notificationStore';
import { useRouter } from 'expo-router';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// ─── Sub-componente: Badge numérico sobre la campana ──────────────────────────

interface NotificationBadgeProps {
  count: number;
}

function NotificationBadge({ count }: NotificationBadgeProps) {
  if (count <= 0) return null;

  const label = count > 99 ? '99+' : String(count);

  return (
    <View
      className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-destructive items-center justify-center px-1"
      accessibilityLabel={`${count} notificaciones sin leer`}
    >
      <Text className="text-white text-[10px] font-bold leading-none">{label}</Text>
    </View>
  );
}

// ─── Componente principal ──────────────────────────────────────────────────────

export function HeaderActions() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const { mutate: logout } = useLogout();
  const router = useRouter();

  // Unread count con sincronización al store de Zustand (ver useUnreadCount.ts).
  const { refetch } = useUnreadCount();
  const unreadCount = useNotificationStore((state) => state.unreadCount);

  // Refresca el count cada vez que la app vuelve al foco (AppState: active).
  // Patrón recomendado por el backend: "pollear cada vez que la app toma foco".
  const handleAppStateChange = useCallback(
    (nextState: AppStateStatus) => {
      if (nextState === 'active') {
        refetch();
      }
    },
    [refetch]
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [handleAppStateChange]);

  return (
    <View className="flex-row items-center gap-3 pr-4">
      {/* ── Campanita con badge ── */}
      <Pressable
        onPress={() => router.push('/(app)/notifications')}
        className="rounded-full bg-muted p-2 relative"
        accessibilityLabel="Notificaciones"
        accessibilityRole="button"
      >
        <Icon
          as={Bell}
          className="text-foreground"
          size={20}
        />
        <NotificationBadge count={unreadCount} />
      </Pressable>

      {/* ── Toggle dark/light ── */}
      <Pressable
        onPress={toggleColorScheme}
        className="rounded-full bg-muted p-2"
        accessibilityLabel={colorScheme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      >
        <Icon
          as={colorScheme === 'dark' ? Sun : Moon}
          className="text-foreground"
          size={20}
        />
      </Pressable>

      {/* ── Dropdown de cuenta ── */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Pressable
            className="rounded-full bg-muted p-2"
            accessibilityLabel="Menú de usuario"
          >
            <Icon
              as={UserIcon}
              className="text-foreground"
              size={20}
            />
          </Pressable>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56 mt-2" align="end">
          <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem onPress={() => router.push('/(app)/profile')}>
            <Icon as={UserCog} className="text-foreground mr-2" size={16} />
            <Text>Editar perfil</Text>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem variant="destructive" onPress={() => logout()}>
            <Icon as={LogOut} className="text-destructive mr-2" size={16} />
            <Text className="text-destructive">Cerrar sesión</Text>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </View>
  );
}
