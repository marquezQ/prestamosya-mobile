import React, { useState } from 'react';
import { View, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMonthlyStats } from '@/hooks/useMonthlyStats';
import { useMonthlyHistory } from '@/hooks/useMonthlyHistory';
import { MonthNavigator } from './MonthNavigator';
import { SummaryGroupHeader } from './SummaryGroupHeader';
import { IncomeCard } from './IncomeCard';
import { PerformanceCard } from './PerformanceCard';
import { BalanceCard } from './BalanceCard';
import { MonthlyActivityCard } from './MonthlyActivityCard';
import { PortfolioCard } from './PortfolioCard';
import { MonthlyBarChart } from './MonthlyBarChart';
import { palette } from '@/lib/theme/colors';
import { RefreshCw, CalendarDays, Wallet } from 'lucide-react-native';

export function SummaryView() {
  const insets = useSafeAreaInsets();
  const today = new Date();
  const [monthSelection, setMonthSelection] = useState({
    year: today.getFullYear(),
    month: today.getMonth() + 1,
  });

  const {
    data: stats,
    isLoading,
    isError,
    refetch: refetchStats,
    isRefetching: isRefetchingStats,
  } = useMonthlyStats(monthSelection.year, monthSelection.month);

  const {
    data: history,
    isLoading: isHistoryLoading,
    isError: isHistoryError,
    refetch: refetchHistory,
    isFetching: isRefetchingHistory,
  } = useMonthlyHistory(6);

  const isRefetching = isRefetchingStats || isRefetchingHistory;

  const handleRefresh = async () => {
    await Promise.all([refetchStats(), refetchHistory()]);
  };

  return (
    <View className="flex-1 bg-background">
      <MonthNavigator
        year={monthSelection.year}
        month={monthSelection.month}
        period={stats?.period}
        onMonthChange={(year, month) => setMonthSelection({ year, month })}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handleRefresh}
            tintColor={palette.azul}
            colors={[palette.azul]}
          />
        }
      >
        {/* ── Carga centralizada: un solo loader hasta tener datos ── */}
        {isLoading && (
          <View className="items-center py-20 gap-3">
            <ActivityIndicator size="large" color={palette.azul} />
            <Text className="text-muted-foreground text-sm font-medium">
              Preparando tu resumen del mes…
            </Text>
          </View>
        )}

        {isError && !isLoading && (
          <View className="mx-4 my-6 border border-destructive/30 bg-destructive/5 rounded-2xl p-5 items-center gap-3">
            <Text className="text-destructive font-bold text-base text-center">
              No se pudo cargar el resumen del mes
            </Text>
            <Text className="text-muted-foreground text-xs text-center font-medium">
              Verifica tu conexión e inténtalo de nuevo.
            </Text>
            <Button
              variant="outline"
              onPress={() => refetchStats()}
              className="mt-1 h-12 px-6 rounded-xl flex-row items-center gap-2 border-secondary/40"
            >
              <RefreshCw size={16} color={palette.azul} />
              <Text className="text-secondary font-bold text-base">Reintentar</Text>
            </Button>
          </View>
        )}

        {!isLoading && !isError && stats && (
          <>
            <SummaryGroupHeader
              icon={<CalendarDays size={18} color={palette.azul} />}
              title="Resumen del Mes"
              subtitle="Lo ocurrido entre el día 1 y el último día del mes seleccionado"
            />
            <IncomeCard income={stats.incomeBreakdown} />
            <PerformanceCard performance={stats.performanceSummary} />
            <BalanceCard balance={stats.monthlyBalance} />
            <MonthlyActivityCard
              newLoansCapital={stats.riskIndicators?.newLoansCapital ?? { BOB: 0, USD: 0 }}
              newLoansCount={stats.riskIndicators?.newLoansCount ?? 0}
              completedLoansCount={stats.riskIndicators?.completedLoansCount ?? 0}
              newClientsCount={stats.riskIndicators?.newClientsCount ?? 0}
            />

            {/* Gráfica del historial: skeleton (sin spinner) + retry propio */}
            {isHistoryLoading ? (
              <View className="mx-4 mb-3 h-44 bg-muted/40 rounded-2xl" />
            ) : isHistoryError ? (
              <View className="mx-4 mb-3 bg-card border border-border rounded-2xl p-4 shadow-sm items-center gap-2">
                <Text className="text-muted-foreground text-sm font-semibold text-center">
                  No se pudo cargar el historial mensual
                </Text>
                <Button
                  variant="outline"
                  onPress={() => refetchHistory()}
                  className="h-11 px-5 rounded-xl flex-row items-center gap-2"
                >
                  <RefreshCw size={15} color={palette.azul} />
                  <Text className="text-secondary font-bold text-sm">Reintentar</Text>
                </Button>
              </View>
            ) : (
              <MonthlyBarChart data={history ?? []} />
            )}

            <SummaryGroupHeader
              icon={<Wallet size={18} color={palette.azul} />}
              title="Estado Actual de Tu Cartera"
              subtitle="Foto al día de hoy · no cambia al cambiar de mes"
            />
            <PortfolioCard
              capitalDeployed={stats.monthlyBalance?.capitalDeployed ?? { BOB: 0, USD: 0 }}
              portfolioAtRisk={stats.riskIndicators?.portfolioAtRisk ?? { BOB: 0, USD: 0 }}
              delinquencyRate={stats.riskIndicators?.delinquencyRate ?? 0}
              overdueLoansCount={stats.riskIndicators?.overdueLoansCount ?? 0}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
}