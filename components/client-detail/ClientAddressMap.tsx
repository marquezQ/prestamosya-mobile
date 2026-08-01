import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { MapPin } from 'lucide-react-native';
import MapView, { Marker } from 'react-native-maps';

interface ClientAddressMapProps {
  address: string | null;
  latitude: number | null;
  longitude: number | null;
}

export function ClientAddressMap({ address, latitude, longitude }: ClientAddressMapProps) {
  // Coordenadas hardcodeadas por defecto (Cochabamba)
  const lat = latitude ?? -17.385381;
  const lng = longitude ?? -66.147229;
  const hasCoordinates = true; // Forzamos a true porque siempre usaremos lat/lng hardcodeados

  return (
    <View className="px-4 mb-6">
      <View className="flex-row items-center gap-2 mb-3">
        <MapPin size={18} className="text-foreground" />
        <Text className="font-bold text-foreground text-base">Dirección de Cobro</Text>
      </View>

      <View className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        {hasCoordinates ? (
          <View className="h-56 w-full bg-muted">
            <MapView
              style={{ flex: 1 }}
              initialRegion={{
                latitude: lat,
                longitude: lng,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              scrollEnabled={true}
              zoomEnabled={true}
              pitchEnabled={true}
              rotateEnabled={true}
            >
              <Marker
                coordinate={{ latitude: lat, longitude: lng }}
              />
            </MapView>
          </View>
        ) : (
          <View className="h-56 w-full bg-muted items-center justify-center">
            <MapPin size={32} className="text-muted-foreground mb-2" />
          </View>
        )}
        
        <View className="p-4 bg-card">
          <Text className="text-foreground text-center font-medium">
            {address || 'Sin dirección registrada'}
          </Text>
        </View>
      </View>
    </View>
  );
}
