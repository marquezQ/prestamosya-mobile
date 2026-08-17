import React, { useState, useMemo } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Search, Users } from 'lucide-react-native';
import { useClients } from '@/hooks/useClients';
import { useNewLoanStore } from '@/stores/newLoanStore';
import { ClientPickerCard } from './ClientPickerCard';

export function StepSelectClient() {
  const { data, isLoading, isError } = useClients();
  const { selectedClient, selectClient } = useNewLoanStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClients = useMemo(() => {
    if (!data) return [];

    if (searchQuery.trim() === '') return data;

    const query = searchQuery.toLowerCase().trim();
    return data.filter((client) => {
      const matchesName = client.fullName.toLowerCase().includes(query);
      const matchesId = client.idNumber.toLowerCase().includes(query);
      return matchesName || matchesId;
    });
  }, [data, searchQuery]);

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
          No se pudieron obtener los clientes.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      {/* Título */}
      <View className="px-4 pt-2 pb-1">
        <Text className="text-foreground font-bold text-xl">
          Seleccionar Cliente
        </Text>
        <Text className="text-muted-foreground text-base mt-0.5">
          Elige el cliente al que deseas otorgar el préstamo
        </Text>
      </View>

      {/* Buscador */}
      <View className="px-4 py-3">
        <View className="relative">
          <View className="absolute left-3 top-0 bottom-0 justify-center z-10">
            <Search size={20} className="text-muted-foreground" />
          </View>
          <Input
            className="pl-10 h-12 bg-card border-border rounded-xl"
            placeholder="Buscar por nombre o CI..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderClassName="text-muted-foreground"
          />
        </View>
      </View>

      {/* Lista de clientes */}
      <FlatList
        data={filteredClients}
        keyExtractor={(item) => item.id}
        contentContainerClassName="px-4 pb-4"
        renderItem={({ item }) => (
          <ClientPickerCard
            fullName={item.fullName}
            idNumber={item.idNumber}
            isSelected={selectedClient?.id === item.id}
            onPress={() =>
              selectClient({
                id: item.id,
                fullName: item.fullName,
                idNumber: item.idNumber,
              })
            }
          />
        )}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="items-center justify-center py-10 mt-6">
            <View className="h-20 w-20 bg-muted rounded-full items-center justify-center mb-4">
              <Users size={36} className="text-muted-foreground" />
            </View>
            <Text className="text-foreground font-bold text-xl">
              No se encontraron clientes
            </Text>
            <Text className="text-muted-foreground text-center text-base mt-2">
              {searchQuery
                ? 'Intenta con otro término de búsqueda.'
                : 'Aún no tienes clientes registrados.'}
            </Text>
          </View>
        }
      />
    </View>
  );
}
