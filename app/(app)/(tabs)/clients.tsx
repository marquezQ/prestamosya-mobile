import { View, Pressable } from "react-native";
import { useState, useMemo } from "react";
import { useRouter } from "expo-router";
import { useClients } from "@/hooks/useClients";
import { ClientFilters } from "@/components/clients/ClientFilters";
import { ClientList } from "@/components/clients/ClientList";
import { Text } from "@/components/ui/text";
import { Plus } from "lucide-react-native";

export default function ClientsScreen() {
  const router = useRouter();
  const { data, isLoading, isError, refetch, isRefetching } = useClients();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'UP_TO_DATE' | 'OVERDUE'>('ALL');

  const filteredData = useMemo(() => {
    if (!data) return [];
    
    return data.filter(client => {
      // 1. Filtrado por estado
      if (activeFilter === 'UP_TO_DATE' && client.status === 'OVERDUE') return false;
      if (activeFilter === 'OVERDUE' && client.status !== 'OVERDUE') return false;
      
      // 2. Filtrado por búsqueda (nombre o CI)
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = client.fullName.toLowerCase().includes(query);
        const matchesId = client.idNumber.toLowerCase().includes(query);
        if (!matchesName && !matchesId) return false;
      }
      
      return true;
    });
  }, [data, activeFilter, searchQuery]);

  return (
    <View className="flex-1 bg-background relative">
      <ClientFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />
      
      <View className="flex-1">
        <View className="flex-row items-center justify-between px-4 py-3">
          <Text className="font-bold text-lg text-foreground">
            Directorio de Clientes
          </Text>
          <Pressable
            onPress={() => router.push('/(app)/client/new')}
            className="bg-secondary active:bg-secondary/90 h-9 px-3.5 rounded-xl flex-row items-center gap-1.5"
          >
            <Plus size={16} color="#ffffff" />
            <Text className="text-white text-xs font-bold">Nuevo Cliente</Text>
          </Pressable>
        </View>
        <ClientList 
          data={filteredData}
          isLoading={isLoading}
          isError={isError}
          refetch={refetch}
          isRefetching={isRefetching}
        />
      </View>
    </View>
  );
}
