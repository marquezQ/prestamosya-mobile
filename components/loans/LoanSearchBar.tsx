import React, { useEffect, useState } from 'react';
import { View, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import { Text } from '@/components/ui/text';
import { Search, X } from 'lucide-react-native';

interface LoanSearchBarProps {
  value: string;
  onSearch: (text: string) => void;
  placeholder?: string;
}

export function LoanSearchBar({
  value,
  onSearch,
  placeholder = 'Buscar por cliente o C.I...',
}: LoanSearchBarProps) {
  const [localText, setLocalText] = useState(value);

  // Sincroniza si el padre cambia o resetea el valor externamente
  useEffect(() => {
    setLocalText(value);
  }, [value]);

  const handleSearch = () => {
    Keyboard.dismiss();
    onSearch(localText.trim());
  };

  const handleClear = () => {
    Keyboard.dismiss();
    setLocalText('');
    onSearch('');
  };

  const hasQuery = localText.trim().length > 0;

  return (
    <View className="px-4 pt-1 pb-2">
      <View className="flex-row items-center bg-card border border-border rounded-xl px-3 h-11 shadow-sm">
        <Search size={18} color="#64748b" className="mr-2 shrink-0" />
        <TextInput
          value={localText}
          onChangeText={setLocalText}
          placeholder={placeholder}
          placeholderTextColor="#94a3b8"
          returnKeyType="search"
          onSubmitEditing={handleSearch}
          autoCapitalize="none"
          autoCorrect={false}
          className="flex-1 text-foreground text-sm font-medium h-full py-0"
        />

        {/* Botón de limpiar texto */}
        {localText.length > 0 && (
          <TouchableOpacity
            onPress={handleClear}
            hitSlop={8}
            activeOpacity={0.7}
            className="w-6 h-6 rounded-full bg-muted items-center justify-center mr-1.5"
          >
            <X size={12} color="#64748b" />
          </TouchableOpacity>
        )}

        {/* Botón explícito para disparar la búsqueda */}
        <TouchableOpacity
          onPress={handleSearch}
          activeOpacity={0.7}
          className={`h-8 px-3 rounded-lg flex-row items-center justify-center ${
            hasQuery ? 'bg-primary' : 'bg-muted'
          }`}
        >
          <Text
            className={`text-xs font-bold ${
              hasQuery ? 'text-white' : 'text-muted-foreground'
            }`}
          >
            Buscar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
