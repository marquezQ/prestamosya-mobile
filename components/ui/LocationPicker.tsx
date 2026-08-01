import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import MapView, { Marker, MapPressEvent } from 'react-native-maps';
import { MapPin } from 'lucide-react-native';

interface LocationPickerProps {
  latitude: number | null;
  longitude: number | null;
  onLocationSelect: (lat: number, lng: number) => void;
  error?: string;
}

export function LocationPicker({ latitude, longitude, onLocationSelect, error }: LocationPickerProps) {
  // Coordenadas por defecto (Cochabamba) si no hay lat/lng
  const initialLat = -17.385381;
  const initialLng = -66.147229;

  const handlePress = (e: MapPressEvent) => {
    const { coordinate } = e.nativeEvent;
    onLocationSelect(coordinate.latitude, coordinate.longitude);
  };

  const currentLat = latitude ?? initialLat;
  const currentLng = longitude ?? initialLng;
  const hasSelected = latitude !== null && longitude !== null;

  return (
    <View className="mb-4">
      <View className="flex-row justify-between items-end mb-2">
        <Text className="text-sm font-medium text-foreground">
          Ubicación en el Mapa
        </Text>
        <Text className="text-xs text-muted-foreground">
          Toca para fijar el marcador
        </Text>
      </View>
      
      <View className={`bg-card border rounded-2xl overflow-hidden shadow-sm ${error ? 'border-destructive' : 'border-border'}`}>
        <View className="h-56 w-full bg-muted">
          <MapView
            style={{ flex: 1 }}
            initialRegion={{
              latitude: currentLat,
              longitude: currentLng,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
            onPress={handlePress}
          >
            {hasSelected && (
              <Marker
                coordinate={{ latitude, longitude }}
              />
            )}
          </MapView>
        </View>

        {!hasSelected && (
          <View className="absolute inset-0 items-center justify-center pointer-events-none">
            <MapPin size={32} className="text-muted-foreground opacity-50 mb-4" />
          </View>
        )}
      </View>

      {error ? (
        <Text className="text-xs text-destructive mt-1.5">{error}</Text>
      ) : (
        <Text className="text-xs text-muted-foreground mt-1.5">
          {hasSelected 
            ? `Seleccionado: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}` 
            : 'Ninguna ubicación seleccionada'}
        </Text>
      )}
    </View>
  );
}
