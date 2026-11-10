import React, { useState, useEffect } from 'react';
import { View, FlatList, Pressable, ActivityIndicator, RefreshControl } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { getThemeColors, palette } from '@/lib/theme/colors';
import { Text } from '@/components/ui/text';
import { useLoans } from '@/hooks/useLoans';
import { LoanFilterScope, LoanListItem } from '@/types/loan';
import { LoanCard } from './LoanCard';
import { LoanFilterChips } from './LoanFilterChips';
import { LoanSearchBar } from './LoanSearchBar';
import { LoanListEmpty } from './LoanListEmpty';
import { ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react-native';

const VALID_FILTERS: LoanFilterScope[] = ['active', 'up_to_date', 'overdue', 'completed'];

export function LoansListView() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const colors = getThemeColors(colorScheme);

  // Parámetros de ruta (ej. cuando se navega desde Home al tocar una tarjeta específica)
  const params = useLocalSearchParams<{ filter?: string }>();

  const initialFilter: LoanFilterScope =
    params.filter && VALID_FILTERS.includes(params.filter as LoanFilterScope)
      ? (params.filter as LoanFilterScope)
      : 'active';

  const [selectedFilter, setSelectedFilter] = useState<LoanFilterScope>(initialFilter);
  const [search, setSearch] = useState('');
  const lastParamFilter = React.useRef(params.filter);

  // Si cambian los params de ruta dinámicamente desde el exterior, sincronizamos el filtro
  useEffect(() => {
    if (
      params.filter &&
      params.filter !== lastParamFilter.current &&
      VALID_FILTERS.includes(params.filter as LoanFilterScope)
    ) {
      lastParamFilter.current = params.filter;
      setSelectedFilter(params.filter as LoanFilterScope);
    }
  }, [params.filter]);

  const handleSelectFilter = (filter: LoanFilterScope) => {
    lastParamFilter.current = filter;
    setSelectedFilter(filter);
  };

  // Consulta TanStack Query
  const {
    data: loans,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useLoans({
    filter: selectedFilter,
    search,
  });

  const handleLoanPress = (item: LoanListItem) => {
    router.push({
      pathname: '/(app)/loan/[id]',
      params: { id: item.id, clientPhone: item.client.phone },
    });
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      {/* ─── Encabezado Superior (Header) ─── */}
      <View className="flex-row items-center justify-between px-4 py-2.5 border-b border-border bg-background">
        <View className="flex-row items-center gap-1.5 flex-1">
          <Pressable
            onPress={() => router.back()}
            hitSlop={8}
            className="h-10 w-10 items-center justify-center -ml-2 rounded-full active:bg-muted"
          >
            <ArrowLeft size={22} color={colors.foreground} />
          </Pressable>
          <View className="flex-row items-center gap-2">
            <Text className="font-bold text-lg text-foreground">
              Cartera de Préstamos
            </Text>
            {loans && !isLoading && (
              <View className="bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                <Text className="text-secondary font-bold text-xs">
                  {loans.length}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* ─── Barra de Búsqueda ─── */}
      <LoanSearchBar value={search} onSearch={setSearch} />

      {/* ─── Tabs de Filtro ─── */}
      <LoanFilterChips
        selectedFilter={selectedFilter}
        onSelectFilter={handleSelectFilter}
      />

      {/* ─── Estado de Carga Inicial ─── */}
      {isLoading && !isRefetching && (
        <View className="flex-1 items-center justify-center py-20 gap-3">
          <ActivityIndicator size="large" color={palette.azul} />
          <Text className="text-muted-foreground text-sm font-medium">
            Cargando préstamos…
          </Text>
        </View>
      )}

      {/* ─── Estado de Error ─── */}
      {isError && !isLoading && (
        <View className="mx-4 my-8 border border-destructive/30 bg-destructive/5 rounded-2xl p-5 items-center gap-3">
          <AlertCircle size={30} className="text-destructive" />
          <Text className="text-destructive font-bold text-base text-center">
            No se pudieron cargar los préstamos
          </Text>
          <Text className="text-muted-foreground text-xs text-center font-medium">
            Verifica tu conexión a internet e inténtalo de nuevo.
          </Text>
          <Pressable
            onPress={() => refetch()}
            className="mt-2 h-10 px-5 rounded-xl border border-secondary/40 bg-card flex-row items-center gap-2"
          >
            <RefreshCw size={14} color={palette.azul} />
            <Text className="text-secondary font-bold text-sm">
              Reintentar
            </Text>
          </Pressable>
        </View>
      )}

      {/* ─── Lista de Préstamos ─── */}
      {!isLoading && !isError && (
        <FlatList
          data={loans ?? []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <LoanCard item={item} onPress={handleLoanPress} />
          )}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 4,
            paddingBottom: insets.bottom + 24,
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={() => refetch()}
              tintColor={palette.azul}
              colors={[palette.azul]}
            />
          }
          ListEmptyComponent={
            <LoanListEmpty
              filter={selectedFilter}
              search={search}
              onClearSearch={() => setSearch('')}
            />
          }
        />
      )}
    </View>
  );
}

