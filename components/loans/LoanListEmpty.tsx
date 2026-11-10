import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { LoanFilterScope } from '@/types/loan';
import { SearchX, CheckCircle2, Archive, Banknote, Plus } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface LoanListEmptyProps {
  filter: LoanFilterScope;
  search?: string;
  onClearSearch?: () => void;
}

export function LoanListEmpty({
  filter,
  search,
  onClearSearch,
}: LoanListEmptyProps) {
  const router = useRouter();

  if (search && search.trim().length > 0) {
    return (
      <View className="items-center justify-center py-16 px-6 gap-3">
        <View className="w-16 h-16 rounded-full bg-muted/60 items-center justify-center mb-1">
          <SearchX size={32} color="#64748b" />
        </View>
        <Text className="text-foreground font-bold text-base text-center">
          Sin resultados de búsqueda
        </Text>
        <Text className="text-muted-foreground text-xs text-center font-medium leading-relaxed max-w-xs">
          No encontramos ningún préstamo que coincida con "{search}".
        </Text>
        {onClearSearch && (
          <Button
            variant="outline"
            onPress={onClearSearch}
            className="mt-2 h-10 px-4 rounded-xl border-border"
          >
            <Text className="text-foreground font-semibold text-xs">
              Limpiar búsqueda
            </Text>
          </Button>
        )}
      </View>
    );
  }

  switch (filter) {
    case 'overdue':
      return (
        <View className="items-center justify-center py-16 px-6 gap-3">
          <View className="w-16 h-16 rounded-full bg-green-500/10 items-center justify-center mb-1">
            <CheckCircle2 size={34} color="#22c55e" />
          </View>
          <Text className="text-foreground font-bold text-base text-center">
            ¡Excelente! Sin préstamos en mora
          </Text>
          <Text className="text-muted-foreground text-xs text-center font-medium leading-relaxed max-w-xs">
            Todos tus clientes con préstamos activos se encuentran actualmente al día con sus pagos.
          </Text>
        </View>
      );

    case 'completed':
      return (
        <View className="items-center justify-center py-16 px-6 gap-3">
          <View className="w-16 h-16 rounded-full bg-muted/60 items-center justify-center mb-1">
            <Archive size={32} color="#64748b" />
          </View>
          <Text className="text-foreground font-bold text-base text-center">
            Sin préstamos finalizados
          </Text>
          <Text className="text-muted-foreground text-xs text-center font-medium leading-relaxed max-w-xs">
            Los préstamos que sean completamente cancelados o liquidados aparecerán en este historial.
          </Text>
        </View>
      );

    case 'up_to_date':
      return (
        <View className="items-center justify-center py-16 px-6 gap-3">
          <View className="w-16 h-16 rounded-full bg-muted/60 items-center justify-center mb-1">
            <Banknote size={32} color="#64748b" />
          </View>
          <Text className="text-foreground font-bold text-base text-center">
            No hay préstamos al día
          </Text>
          <Text className="text-muted-foreground text-xs text-center font-medium leading-relaxed max-w-xs">
            Actualmente no hay préstamos activos al día registrados en el sistema.
          </Text>
        </View>
      );

    case 'active':
    default:
      return (
        <View className="items-center justify-center py-16 px-6 gap-3">
          <View className="w-16 h-16 rounded-full bg-primary/10 items-center justify-center mb-1">
            <Banknote size={32} color="#206ba5" />
          </View>
          <Text className="text-foreground font-bold text-base text-center">
            No tienes préstamos activos
          </Text>
          <Text className="text-muted-foreground text-xs text-center font-medium leading-relaxed max-w-xs">
            Comienza registrando un nuevo préstamo para ver aquí toda tu cartera de créditos.
          </Text>
          <Button
            onPress={() => router.push('/(app)/loan/new')}
            className="mt-2 h-11 px-5 rounded-xl bg-primary flex-row items-center gap-2"
          >
            <Plus size={16} color="#ffffff" />
            <Text className="text-white font-bold text-sm">
              Nuevo Préstamo
            </Text>
          </Button>
        </View>
      );
  }
}

