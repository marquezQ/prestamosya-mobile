import { View, Pressable } from "react-native";
import { useState, useMemo } from "react";
import { useClients } from "@/hooks/useClients";
import { ClientFilters } from "@/components/clients/ClientFilters";
import { ClientList } from "@/components/clients/ClientList";
import { Text } from "@/components/ui/text";
import { Plus } from "lucide-react-native";

export default function ClientsScreen() {
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
        <Text className="font-bold text-lg text-foreground px-4 py-3">
          Directorio de Clientes
        </Text>
        <ClientList 
          data={filteredData}
          isLoading={isLoading}
          isError={isError}
          refetch={refetch}
          isRefetching={isRefetching}
        />
      </View>

      {/* Floating Action Button */}
      <Pressable 
        className="absolute bottom-6 right-6 w-14 h-14 bg-primary rounded-2xl items-center justify-center shadow-lg active:scale-95"
      >
        <Plus size={28} className="text-primary-foreground" />
      </Pressable>
    </View>
  );
}
