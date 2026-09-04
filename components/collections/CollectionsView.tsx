import React, { useState } from 'react';
import { View, ScrollView, Pressable, ActivityIndicator, Alert, Platform } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { DateCarousel } from './DateCarousel';
import { DailyProgressCard } from './DailyProgressCard';
import { InstallmentCard } from './InstallmentCard';
import { OverdueInstallmentCard } from './OverdueInstallmentCard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ShieldCheck, RefreshCw } from 'lucide-react-native';
import { palette } from '@/lib/theme/colors';
import { formatDateBO } from '@/lib/format';
import { usePaymentDashboard } from '@/hooks/usePaymentDashboard';
import { useRecalculateOverdue } from '@/hooks/useRecalculateOverdue';

export function CollectionsView() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const selectedISO = format(selectedDate, 'yyyy-MM-dd');
  const {
    data: dashboardData,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = usePaymentDashboard(selectedISO);

  const { mutateAsync: recalculateOverdue, isPending: isRecalculating } =
    useRecalculateOverdue();

  const handleRecalculate = async () => {
    try {
      const res = await recalculateOverdue();
      const summaryMsg = `Cobros y moras recalculados exitosamente.\n\n• Cuotas actualizadas: ${res.data.updatedInstallmentsCount}\n• Clientes en mora: ${res.data.markedDelinquentClientsCount}\n• Clientes regularizados: ${res.data.restoredCurrentClientsCount}`;
      if (Platform.OS === 'web') {
        window.alert(summaryMsg);
      } else {
        Alert.alert('Cobros Actualizados', summaryMsg);
      }
    } catch (error) {
      const errorMsg = 'No se pudo completar el recálculo de moras. Inténtalo nuevamente.';
      if (Platform.OS === 'web') {
        window.alert(errorMsg);
      } else {
        Alert.alert('Error', errorMsg);
      }
    }
  };

  // Format header date (e.g., "Jueves, 20 de agosto")
  const headerDateStr = format(selectedDate, "EEEE, d 'de' MMMM", { locale: es });
  const capitalizedHeaderDate =
    headerDateStr.charAt(0).toUpperCase() + headerDateStr.slice(1);

  // El backend define qué día es "hoy" para el servidor
  const isViewingToday =
    !!dashboardData && dashboardData.metadata.serverToday === selectedISO;
  const dayLabel = formatDateBO(selectedISO, 'd MMM');

  const { dueToday = [], overdue = [], paidToday = [] } = dashboardData ?? {};

  // Progreso por moneda
  const bobDueToday = dueToday.filter((i) => (i.currency || 'BOB') === 'BOB');
  const usdDueToday = dueToday.filter((i) => i.currency === 'USD');
  const bobPaidToday = paidToday.filter((i) => (i.currency || 'BOB') === 'BOB');
  const usdPaidToday = paidToday.filter((i) => i.currency === 'USD');

  // Totales BOB
  const bobPaidAmount =
    bobPaidToday.reduce((acc, curr) => acc + curr.paidAmount, 0) +
    bobDueToday.reduce((acc, curr) => acc + curr.paidAmount, 0);
  const bobDueAmount = bobDueToday.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalBOBTarget = bobDueAmount + bobPaidAmount;

  // Totales USD
  const usdPaidAmount =
    usdPaidToday.reduce((acc, curr) => acc + curr.paidAmount, 0) +
    usdDueToday.reduce((acc, curr) => acc + curr.paidAmount, 0);
  const usdDueAmount = usdDueToday.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalUSDTarget = usdDueAmount + usdPaidAmount;

  const hasUSDActivity = totalUSDTarget > 0 || usdDueToday.length > 0 || usdPaidToday.length > 0;

  const progressItems = [
    {
      currency: 'BOB' as const,
      collectedAmount: bobPaidAmount,
      totalTargetAmount: totalBOBTarget,
    },
    ...(hasUSDActivity
      ? [
          {
            currency: 'USD' as const,
            collectedAmount: usdPaidAmount,
            totalTargetAmount: totalUSDTarget,
          },
        ]
      : []),
  ];

  const handleSelectInstallment = (loanId: string, clientPhone: string) => {
    router.push(`/(app)/loan/${loanId}?clientPhone=${encodeURIComponent(clientPhone)}`);
  };

  const isBusy = isRecalculating || isRefetching;

  return (
    <View className="flex-1 bg-background">
      {/* ── Screen Header ── */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-border bg-background">
        <View>
          <Text className="font-bold text-lg text-foreground">
            Cobros
          </Text>
          <Text className="text-muted-foreground text-xs font-semibold mt-0.5">
            {capitalizedHeaderDate}
          </Text>
        </View>

        <Pressable
          onPress={handleRecalculate}
          disabled={isBusy}
          className="bg-secondary active:bg-secondary/90 h-9 px-3.5 rounded-xl flex-row items-center gap-1.5 disabled:opacity-50"
        >
          {isBusy ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <RefreshCw size={16} color="#ffffff" />
          )}
          <Text className="text-white text-xs font-bold">
            {isBusy ? 'Actualizando...' : 'Actualizar'}
          </Text>
        </Pressable>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Carrusel de Días ── */}
        <DateCarousel
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />

        {/* ── Barra de Progreso del Día (Tarjeta Única) ── */}
        {!isError && <DailyProgressCard progressItems={progressItems} />}

        {/* ── Estado de carga ── */}
        {isLoading && (
          <View className="items-center py-14 gap-3">
            <ActivityIndicator size="large" color={palette.azul} />
            <Text className="text-muted-foreground text-sm font-medium">
              Cargando cobros del día…
            </Text>
          </View>
        )}

        {/* ── Estado de error ── */}
        {isError && !isRefetching && (
          <View className="mx-4 border border-destructive/30 bg-destructive/5 rounded-2xl p-5 items-center my-2 gap-3">
            <Text className="text-destructive text-sm font-semibold text-center">
              No se pudo cargar el dashboard de cobros
            </Text>
            <Button
              variant="outline"
              onPress={() => refetch()}
              className="h-12 px-6 rounded-xl flex-row items-center gap-2"
            >
              <RefreshCw size={16} className="text-secondary" />
              <Text className="text-secondary font-bold text-base">Reintentar</Text>
            </Button>
          </View>
        )}

        {!isLoading && !isError && (
          <>
            {/* ── Sección 1: Cuotas del día ── */}
            <View className="mx-4 mt-3 mb-2 flex-row items-center justify-between">
              <Text className="text-foreground font-bold text-xl tracking-tight">
                {isViewingToday ? 'Cuotas de hoy' : `Cuotas del ${dayLabel}`}
              </Text>
              <View className="bg-muted px-2.5 py-0.5 rounded-full">
                <Text className="text-muted-foreground text-xs font-bold">
                  {dueToday.length}
                </Text>
              </View>
            </View>

            {dueToday.length > 0 ? (
              dueToday.map((item) => (
                <InstallmentCard
                  key={item.installmentId}
                  item={item}
                  onPress={() =>
                    handleSelectInstallment(item.loanId, item.clientPhone)
                  }
                />
              ))
            ) : (
              <View className="mx-4 border border-dashed border-border rounded-2xl p-5 items-center my-2">
                <ShieldCheck size={28} color={palette.celeste} />
                <Text className="text-muted-foreground text-xs font-semibold mt-2">
                  No hay cuotas programadas para esta fecha
                </Text>
              </View>
            )}

            {/* ── Sección 2: Atrasados de días anteriores ── */}
            <View className="mx-4 mt-5 mb-2 flex-row items-center justify-between">
              <Text className="text-foreground font-bold text-xl tracking-tight">
                Atrasados de días anteriores
              </Text>

              {overdue.length > 0 && (
                <View className="bg-red-500/10 px-2.5 py-0.5 rounded-full border border-red-500/20">
                  <Text className="text-red-600 dark:text-red-400 text-xs font-bold">
                    {overdue.length} pendientes
                  </Text>
                </View>
              )}
            </View>

            {overdue.length > 0 ? (
              overdue.map((item) => (
                <OverdueInstallmentCard
                  key={item.installmentId}
                  item={item}
                  onPress={() =>
                    handleSelectInstallment(item.loanId, item.clientPhone)
                  }
                />
              ))
            ) : (
              <View className="mx-4 border border-dashed border-border rounded-2xl p-4 items-center my-1 bg-green-500/5">
                <Text className="text-green-600 dark:text-green-400 text-xs font-bold">
                  ¡Sin cuotas atrasadas pendientes!
                </Text>
              </View>
            )}

            {/* ── Sección 3: Cobrados en el día ── */}
            {paidToday.length > 0 && (
              <View className="mt-5">
                <View className="mx-4 mb-2 flex-row items-center justify-between">
                  <Text className="text-foreground font-bold text-xl tracking-tight">
                    {isViewingToday ? 'Cobrados hoy' : `Cobrados del ${dayLabel}`}
                  </Text>
                  <View className="bg-green-500/10 px-2.5 py-0.5 rounded-full">
                    <Text className="text-green-600 dark:text-green-400 text-xs font-bold">
                      {paidToday.length}
                    </Text>
                  </View>
                </View>

                {paidToday.map((item) => (
                  <InstallmentCard
                    key={item.installmentId}
                    item={item}
                    onPress={() =>
                      handleSelectInstallment(item.loanId, item.clientPhone)
                    }
                  />
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}
