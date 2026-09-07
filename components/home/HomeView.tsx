import React from 'react';
import { View, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHomeDashboard } from '@/hooks/useHomeDashboard';
import { HomeHeader } from './HomeHeader';
import { OutstandingCapitalCard } from './OutstandingCapitalCard';
import { LoansClientsSummaryCards } from './LoansClientsSummaryCards';
import { OverdueCollectionList } from './OverdueCollectionList';
import { palette } from '@/lib/theme/colors';
import { RefreshCw, AlertCircle } from 'lucide-react-native';

export function HomeView() {
  const insets = useSafeAreaInsets();
  const { data, isLoading, isError, refetch, isRefetching } = useHomeDashboard();

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => refetch()}
            tintColor={palette.azul}
            colors={[palette.azul]}
          />
        }
      >
        {/* Header scrolls with content */}
        <HomeHeader />
        {/* ── Loader State ── */}
        {isLoading && (
          <View className="items-center py-16 gap-3">
            <ActivityIndicator size="large" color={palette.azul} />
            <Text className="text-muted-foreground text-sm font-medium">
              Cargando resumen del dashboard…
            </Text>
          </View>
        )}

        {/* ── Error State ── */}
        {isError && !isLoading && !isRefetching && (
          <View className="mx-4 my-6 border border-destructive/30 bg-destructive/5 rounded-2xl p-5 items-center gap-3">
            <AlertCircle size={28} className="text-destructive" />
            <Text className="text-destructive font-bold text-base text-center">
              No se pudo cargar la información del inicio
            </Text>
            <Text className="text-muted-foreground text-xs text-center font-medium">
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

        {/* ── Content Loaded ── */}
        {!isLoading && !isError && data && (
          <View className="pt-1">
            {/* Outstanding Capital Card */}
            <OutstandingCapitalCard capital={data.capitalEnCalle} />

            {/* KPIs & App Parameters */}
            <LoansClientsSummaryCards
              loansSummary={data.loansSummary}
              clientsSummary={data.clientsSummary}
            />

            {/* Top Morosos con WhatsApp 1-Tap */}
            <OverdueCollectionList overdueItems={data.overdueInstallments} />
          </View>
        )}
      </ScrollView>
    </View>
  );
}
