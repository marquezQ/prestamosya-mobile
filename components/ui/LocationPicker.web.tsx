import React, { useState } from 'react';
import { View, Alert, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { MapPin, LocateFixed } from 'lucide-react-native';
import * as Location from 'expo-location';

interface LocationPickerProps {
  latitude: number | null;
  longitude: number | null;
  onLocationSelect: (lat: number, lng: number) => void;
  onAddressFound?: (address: string) => void;
  error?: string;
}

const ROUND_DECIMALS = 6;

const roundCoord = (value: number) => Number(value.toFixed(ROUND_DECIMALS));

export function LocationPicker({ latitude, longitude, onLocationSelect, error }: LocationPickerProps) {
  const hasSelected = latitude !== null && longitude !== null;
  const [locating, setLocating] = useState(false);

  const goToMyLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Necesitamos acceso a tu ubicación.');
        return;
      }

      setLocating(true);
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      onLocationSelect(roundCoord(location.coords.latitude), roundCoord(location.coords.longitude));
    } catch (err) {
      Alert.alert('Error', 'No se pudo obtener tu ubicación. Inténtalo de nuevo.');
    } finally {
      setLocating(false);
    }
  };

  return (
    <View className="mb-4">
      <Text className="text-sm font-medium text-foreground mb-2">
        Ubicación en el Mapa
      </Text>
      
      <View className={`bg-card border rounded-2xl overflow-hidden shadow-sm ${error ? 'border-destructive' : 'border-border'}`}>
        <View className="h-80 w-full bg-muted items-center justify-center p-4">
          <MapPin size={32} className="text-muted-foreground mb-2" />
          <Text className="text-muted-foreground text-xs text-center">
            (La selección de mapa interactivo solo está disponible en la app móvil. Actualmente en la web no se puede seleccionar ubicación gráfica.)
          </Text>
        </View>

        <View className="p-2 border-t border-border">
          <Button
            variant="secondary"
            onPress={goToMyLocation}
            disabled={locating}
            className="w-full"
          >
            {locating ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <LocateFixed size={18} color="#ffffff" />
            )}
            <Text className="font-semibold">
              Ir a mi ubicación
            </Text>
          </Button>
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
