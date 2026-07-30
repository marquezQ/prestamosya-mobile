import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react-native';

interface ClientFiltersProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  activeFilter: 'ALL' | 'UP_TO_DATE' | 'OVERDUE';
  onFilterChange: (filter: 'ALL' | 'UP_TO_DATE' | 'OVERDUE') => void;
}

export function ClientFilters({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
}: ClientFiltersProps) {
  return (
    <View className="px-4 py-3 bg-background border-b border-border">
      <View className="relative mb-4">
        <View className="absolute left-3 top-0 bottom-0 justify-center z-10">
          <Search size={20} className="text-muted-foreground" />
        </View>
        <Input
          className="pl-10 h-12 bg-card border-border rounded-xl"
          placeholder="Buscar por nombre o CI..."
          value={searchQuery}
          onChangeText={onSearchChange}
          placeholderClassName="text-muted-foreground"
        />
      </View>

      <View className="flex-row gap-2">
        <FilterChip
          label="Todos"
          isActive={activeFilter === 'ALL'}
          onPress={() => onFilterChange('ALL')}
        />
        <FilterChip
          label="Al día"
          isActive={activeFilter === 'UP_TO_DATE'}
          onPress={() => onFilterChange('UP_TO_DATE')}
        />
        <FilterChip
          label="En mora"
          isActive={activeFilter === 'OVERDUE'}
          onPress={() => onFilterChange('OVERDUE')}
        />
      </View>
    </View>
  );
}

function FilterChip({
  label,
  isActive,
  onPress,
}: {
  label: string;
  isActive: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`px-4 py-2 rounded-full ${
        isActive ? 'bg-primary' : 'bg-muted'
      }`}
    >
      <Text
        className={`font-medium text-sm ${
          isActive ? 'text-primary-foreground' : 'text-muted-foreground'
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
