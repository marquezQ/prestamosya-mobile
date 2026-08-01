import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { MapPin } from 'lucide-react-native';

interface LocationPickerProps {
  latitude: number | null;
  longitude: number | null;
  onLocationSelect: (lat: number, lng: number) => void;
  error?: string;
}

export function LocationPicker({ latitude, longitude, onLocationSelect, error }: LocationPickerProps) {
  const hasSelected = latitude !== null && longitude !== null;

  return (
    <View className="mb-4">
      <Text className="text-sm font-medium text-foreground mb-2">
        Ubicación en el Mapa
      </Text>
      
      <View className={`bg-card border rounded-2xl overflow-hidden shadow-sm ${error ? 'border-destructive' : 'border-border'}`}>
        <View className="h-56 w-full bg-muted items-center justify-center p-4">
          <MapPin size={32} className="text-muted-foreground mb-2" />
          <Text className="text-muted-foreground text-xs text-center">
            (La selección de mapa interactivo solo está disponible en la app móvil. Actualmente en la web no se puede seleccionar ubicación gráfica.)
          </Text>
        </View>
      </View>

      {error ? (
        <Text className="text-xs text-destructive mt-1.5">{error}</Text>
      ) : (
        <Text className="text-xs text-muted-foreground mt-1.5">
          {hasSelected 
            ? `Seleccionado (Web): ${latitude.toFixed(4)}, ${longitude.toFixed(4)}` 
            : 'Ninguna ubicación seleccionada'}
        </Text>
      )}
    </View>
  );
}
