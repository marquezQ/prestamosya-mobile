import React, { useState } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { DateCarousel } from './DateCarousel';
import { DailyProgressCard } from './DailyProgressCard';
import { InstallmentCard } from './InstallmentCard';
import { OverdueInstallmentCard } from './OverdueInstallmentCard';
import { MOCK_DASHBOARD_TODAY } from './mockPaymentData';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarCheck, ShieldCheck, CheckCircle2 } from 'lucide-react-native';
import { palette } from '@/lib/theme/colors';

export function CollectionsView() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Format header date (e.g., "Jueves, 20 de agosto")
  const headerDateStr = format(selectedDate, "EEEE, d 'de' MMMM", { locale: es });
  const capitalizedHeaderDate =
    headerDateStr.charAt(0).toUpperCase() + headerDateStr.slice(1);

  // En esta fase los datos son mock; al conectar el backend se reemplazará
  // por una query keyeada por la fecha seleccionada.
  const dashboardData = MOCK_DASHBOARD_TODAY;

  const { dueToday, overdue, paidToday } = dashboardData;

  // Calculate totals for progress bar
  const totalPaidToday = paidToday.reduce((acc, curr) => acc + curr.paidAmount, 0);
  const totalDueToday = dueToday.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalTargetToday = totalPaidToday + totalDueToday;

  const handleSelectInstallment = (loanId: string, clientPhone: string) => {
    router.push(`/(app)/loan/${loanId}?clientPhone=${encodeURIComponent(clientPhone)}`);
  };

  return (
    <View className="flex-1 bg-background">
      {/* ── Screen Header ── */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-border bg-background">
        <View>
          <Text className="font-bold text-2xl text-foreground tracking-tight">
            Cobros
          </Text>
          <Text className="text-muted-foreground text-xs font-semibold mt-0.5">
            {capitalizedHeaderDate}
          </Text>
        </View>

        <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center">
          <CalendarCheck size={22} color={palette.azul} />
        </View>
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

        {/* ── Barra de Progreso del Día ── */}
        <DailyProgressCard
          collectedAmount={totalPaidToday}
          totalTargetAmount={totalTargetToday > 0 ? totalTargetToday : 1870}
        />

        {/* ── Sección 1: Cuotas de hoy ── */}
        <View className="mx-4 mt-3 mb-2 flex-row items-center justify-between">
          <Text className="text-foreground font-bold text-xl tracking-tight">
            Cuotas de hoy
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

        {/* ── Sección 3: Cobrados hoy ── */}
        {paidToday.length > 0 && (
          <View className="mt-5">
            <View className="mx-4 mb-2 flex-row items-center justify-between">
              <Text className="text-foreground font-bold text-xl tracking-tight">
                Cobrados hoy
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
      </ScrollView>
    </View>
  );
}
