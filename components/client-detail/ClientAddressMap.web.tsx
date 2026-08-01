import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { MapPin } from 'lucide-react-native';

interface ClientAddressMapProps {
  address: string | null;
  latitude: number | null;
  longitude: number | null;
}

export function ClientAddressMap({ address, latitude, longitude }: ClientAddressMapProps) {
  // En la web no cargamos react-native-maps para evitar errores del bundler.
  // Mostramos un placeholder.
  return (
    <View className="px-4 mb-6">
      <View className="flex-row items-center gap-2 mb-3">
        <MapPin size={18} className="text-foreground" />
        <Text className="font-bold text-foreground text-base">Dirección de Cobro</Text>
      </View>

      <View className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <View className="h-56 w-full bg-muted items-center justify-center">
          <MapPin size={32} className="text-muted-foreground mb-2" />
          <Text className="text-muted-foreground text-xs text-center px-4">
            (El mapa interactivo solo está disponible en la app móvil)
          </Text>
        </View>
        
        <View className="p-4 bg-card">
          <Text className="text-foreground text-center font-medium">
            {address || 'Sin dirección registrada'}
          </Text>
        </View>
      </View>
    </View>
  );
}
