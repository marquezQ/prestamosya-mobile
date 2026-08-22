import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LoanDetailPaymentView } from '@/components/collections/LoanDetailPaymentView';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react-native';
import { palette } from '@/lib/theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLoanById } from '@/hooks/useLoanById';

export default function LoanDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id, clientPhone } = useLocalSearchParams<{
    id: string;
    clientPhone?: string;
  }>();

  const loanId = Array.isArray(id) ? id[0] : id;
  const {
    data: loanDetail,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useLoanById(loanId ?? '', !!loanId);

  if (isLoading) {
    return (
      <View
        className="flex-1 bg-background items-center justify-center gap-3"
        style={{ paddingTop: insets.top }}
      >
        <ActivityIndicator size="large" color={palette.azul} />
        <Text className="text-muted-foreground text-sm font-medium">
          Cargando préstamo…
        </Text>
      </View>
    );
  }

  if (isError || !loanDetail) {
    return (
      <View
        className="flex-1 bg-background items-center justify-center gap-4 px-6"
        style={{ paddingTop: insets.top }}
      >
        <Text className="text-destructive text-sm font-semibold text-center">
          No se pudo cargar el detalle del préstamo
        </Text>
        <View className="flex-row gap-3">
          <Button
            variant="outline"
            onPress={() => router.back()}
            className="h-12 px-6 rounded-xl"
          >
            <Text className="font-bold text-foreground text-base">Volver</Text>
          </Button>
          <Button
            onPress={() => refetch()}
            disabled={isRefetching}
            className="h-12 px-6 rounded-xl bg-secondary active:bg-secondary/90 flex-row items-center gap-2"
          >
            <RefreshCw size={16} color="#ffffff" />
            <Text className="font-bold text-white text-base">Reintentar</Text>
          </Button>
        </View>
      </View>
    );
  }

  return (
    <LoanDetailPaymentView
      loanDetail={loanDetail}
      clientPhone={Array.isArray(clientPhone) ? clientPhone[0] : clientPhone}
    />
  );
}
