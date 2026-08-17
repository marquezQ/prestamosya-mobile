import React from 'react';
import { FlatList, View, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';
import { Client } from '@/types/client';
import { ClientCard } from './ClientCard';
import { Users } from 'lucide-react-native';

import { useRouter } from 'expo-router';

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
  const router = useRouter();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <ActivityIndicator size="large" className="text-primary" />
        <Text className="text-muted-foreground mt-4 text-base font-medium">
          Cargando clientes...
        </Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-destructive font-bold text-xl mb-2">
          Error al cargar
        </Text>
        <Text className="text-muted-foreground text-center text-base">
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
      renderItem={({ item }) => (
        <ClientCard
          client={item}
          onPress={(client) => router.push(`/(app)/client/${client.id}`)}
        />
      )}
      showsVerticalScrollIndicator={false}
      onRefresh={refetch}
      refreshing={isRefetching}
      ListEmptyComponent={
        <View className="flex-1 items-center justify-center py-10 mt-10">
          <View className="h-20 w-20 bg-muted rounded-full items-center justify-center mb-4">
            <Users size={36} className="text-muted-foreground" />
          </View>
          <Text className="text-foreground font-bold text-xl">
            No hay clientes
          </Text>
          <Text className="text-muted-foreground text-center text-base mt-2">
            Aún no tienes clientes registrados.
          </Text>
        </View>
      }
    />
  );
}
