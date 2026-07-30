import React from 'react';
import { FlatList, View, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';
import { Client } from '@/types/client';
import { ClientCard } from './ClientCard';
import { Users } from 'lucide-react-native';

interface ClientListProps {
  data: Client[] | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  isRefetching: boolean;
}

export function ClientList({
  data,
  isLoading,
  isError,
  refetch,
  isRefetching,
}: ClientListProps) {
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <ActivityIndicator size="large" className="text-primary" />
        <Text className="text-muted-foreground mt-4 font-medium">
          Cargando clientes...
        </Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-destructive font-bold text-lg mb-2">
          Error al cargar
        </Text>
        <Text className="text-muted-foreground text-center">
          Ocurrió un problema al obtener los clientes. Por favor intenta
          nuevamente.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      contentContainerClassName="p-4"
      renderItem={({ item }) => <ClientCard client={item} />}
      showsVerticalScrollIndicator={false}
      onRefresh={refetch}
      refreshing={isRefetching}
      ListEmptyComponent={
        <View className="flex-1 items-center justify-center py-10 mt-10">
          <View className="h-16 w-16 bg-muted rounded-full items-center justify-center mb-4">
            <Users size={32} className="text-muted-foreground" />
          </View>
          <Text className="text-foreground font-bold text-lg">
            No hay clientes
          </Text>
          <Text className="text-muted-foreground text-center mt-2">
            Aún no tienes clientes registrados.
          </Text>
        </View>
      }
    />
  );
}
