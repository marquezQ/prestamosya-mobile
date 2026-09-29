/**
 * components/notifications/NotificationsView.tsx
 *
 * Orquestador de la pantalla de bandeja de notificaciones.
 *
 * Maneja los tres estados estándar del proyecto: loading, error, data.
 * Incluye:
 *   - Header con título + botón "Marcar todas como leídas".
 *   - FlatList con paginación por scroll (onEndReached).
 *   - Pull-to-refresh.
 *   - Empty state cuando no hay notificaciones.
 */

import { useCallback } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Pressable,
} from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bell, CheckCheck, RefreshCw, AlertCircle } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { palette, getThemeColors } from '@/lib/theme/colors';
import { useNotifications } from '@/hooks/useNotifications';
import { useMarkAsRead } from '@/hooks/useMarkAsRead';
import { useMarkAllAsRead } from '@/hooks/useMarkAllAsRead';
import { useNotificationStore } from '@/stores/notificationStore';
import { NotificationCard } from './NotificationCard';
import type { Notification } from '@/types/notification';

// ─── Sub-componente: Header ────────────────────────────────────────────────────

interface NotificationsHeaderProps {
  unreadCount: number;
  onBack: () => void;
  onMarkAll: () => void;
  isMarkingAll: boolean;
  paddingTop: number;
}

function NotificationsHeader({
  unreadCount,
  onBack,
  onMarkAll,
  isMarkingAll,
  paddingTop,
}: NotificationsHeaderProps) {
  const { colorScheme } = useColorScheme();
  const colors = getThemeColors(colorScheme);

  return (
    <View
      style={{ paddingTop, backgroundColor: colors.background }}
      className="border-b border-border/60"
    >
      <View className="flex-row items-center justify-between px-4 pb-3 pt-2">
        {/* Botón volver */}
        <Pressable
          onPress={onBack}
          className="h-10 w-10 items-center justify-center rounded-xl bg-muted active:opacity-70"
          accessibilityLabel="Volver"
          accessibilityRole="button"
        >
          <ArrowLeft size={20} color={colors.foreground} />
        </Pressable>

        {/* Título */}
        <View className="flex-1 items-center">
          <Text className="text-lg font-bold text-foreground">Notificaciones</Text>
          {unreadCount > 0 && (
            <Text className="text-xs text-muted-foreground font-medium">
              {unreadCount} sin leer
            </Text>
          )}
        </View>

        {/* Marcar todas — solo visible si hay no leídas */}
        {unreadCount > 0 ? (
          <Pressable
            onPress={onMarkAll}
            disabled={isMarkingAll}
            className="h-10 w-10 items-center justify-center rounded-xl bg-muted active:opacity-70 disabled:opacity-40"
            accessibilityLabel="Marcar todas como leídas"
            accessibilityRole="button"
          >
            <CheckCheck size={18} color={palette.azul} />
          </Pressable>
        ) : (
          // Placeholder para mantener el título centrado
          <View className="h-10 w-10" />
        )}
      </View>
    </View>
  );
}

// ─── Sub-componente: Empty State ───────────────────────────────────────────────

function EmptyNotifications() {
  return (
    <View className="flex-1 items-center justify-center gap-4 px-8 py-20">
      <View className="w-20 h-20 rounded-3xl bg-secondary/10 items-center justify-center">
        <Bell size={36} color={palette.azul} />
      </View>
      <Text className="text-foreground font-bold text-lg text-center">
        Sin notificaciones
      </Text>
      <Text className="text-muted-foreground text-sm text-center leading-6">
        Cuando el sistema genere notificaciones, aparecerán aquí. El resumen diario llega cada mañana a las 8:00 AM.
      </Text>
    </View>
  );
}

// ─── Sub-componente: Footer de paginación ─────────────────────────────────────

function PaginationFooter({ isFetching }: { isFetching: boolean }) {
  if (!isFetching) return null;
  return (
    <View className="items-center py-6">
      <ActivityIndicator size="small" color={palette.azul} />
    </View>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function NotificationsView() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const {
    data,
    isLoading,
    isError,
    isFetching,
    refetch,
    isRefetching,
    hasMore,
    loadNextPage,
    reset,
  } = useNotifications();

  const { mutate: markAsRead, isPending: isMarkingOne } = useMarkAsRead();
  const { mutate: markAllAsRead, isPending: isMarkingAll } = useMarkAllAsRead();

  const handleRefresh = useCallback(() => {
    reset();
    refetch();
  }, [reset, refetch]);

  const handleCardPress = useCallback(
    (id: string) => {
      markAsRead(id);
    },
    [markAsRead]
  );

  const handleMarkAll = useCallback(() => {
    markAllAsRead();
  }, [markAllAsRead]);

  const renderItem = useCallback(
    ({ item }: { item: Notification }) => (
      <NotificationCard
        notification={item}
        onPress={handleCardPress}
        isMarkingRead={isMarkingOne}
      />
    ),
    [handleCardPress, isMarkingOne]
  );

  const keyExtractor = useCallback((item: Notification) => item.id, []);

  const items = data?.items ?? [];

  return (
    <View className="flex-1 bg-background">
      <NotificationsHeader
        unreadCount={unreadCount}
        onBack={() => router.back()}
        onMarkAll={handleMarkAll}
        isMarkingAll={isMarkingAll}
        paddingTop={insets.top}
      />

      {/* ── Loader inicial ── */}
      {isLoading && (
        <View className="flex-1 items-center justify-center gap-3">
          <ActivityIndicator size="large" color={palette.azul} />
          <Text className="text-muted-foreground text-sm font-medium">
            Cargando notificaciones…
          </Text>
        </View>
      )}

      {/* ── Error ── */}
      {isError && !isLoading && (
        <View className="mx-4 my-8 border border-destructive/30 bg-destructive/5 rounded-2xl p-5 items-center gap-3">
          <AlertCircle size={28} color="#ef4444" />
          <Text className="text-destructive font-bold text-base text-center">
            No se pudo cargar las notificaciones
          </Text>
          <Text className="text-muted-foreground text-xs text-center">
            Verifica tu conexión e inténtalo de nuevo.
          </Text>
          <Button
            variant="outline"
            onPress={() => refetch()}
            className="mt-1 h-12 px-6 rounded-xl flex-row items-center gap-2 border-secondary/40"
          >
            <RefreshCw size={16} color={palette.azul} />
            <Text className="text-secondary font-bold text-base">Reintentar</Text>
          </Button>
        </View>
      )}

      {/* ── Lista ── */}
      {!isLoading && !isError && (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ListEmptyComponent={EmptyNotifications}
          ListFooterComponent={<PaginationFooter isFetching={isFetching && !isRefetching} />}
          onEndReached={loadNextPage}
          onEndReachedThreshold={0.3}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: insets.bottom + 24,
            flexGrow: 1,
          }}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={handleRefresh}
              tintColor={palette.azul}
              colors={[palette.azul]}
            />
          }
        />
      )}
    </View>
  );
}
