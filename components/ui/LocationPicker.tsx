import React, { useRef, useState } from 'react';
import { View, Alert, ActivityIndicator, Linking } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import MapView, { Marker, MapPressEvent } from 'react-native-maps';
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

export function LocationPicker({ latitude, longitude, onLocationSelect, onAddressFound, error }: LocationPickerProps) {
  // Coordenadas por defecto (Cochabamba) si no hay lat/lng
  const initialLat = -17.385381;
  const initialLng = -66.147229;
  const mapRef = useRef<MapView>(null);
  const [locating, setLocating] = useState(false);

  const handlePress = (e: MapPressEvent) => {
    const { coordinate } = e.nativeEvent;
    onLocationSelect(roundCoord(coordinate.latitude), roundCoord(coordinate.longitude));
  };

  const fillAddress = async (lat: number, lng: number) => {
    if (!onAddressFound) return;
    try {
      const [place] = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
      if (!place) return;
      const parts = [place.street, place.streetNumber, place.city, place.district].filter(Boolean);
      const address = parts.join(', ');
      if (address) onAddressFound(address);
    } catch {
      // El geocoding inverso es opcional: si falla, no bloqueamos la selección.
    }
  };

  const goToMyLocation = async () => {
    try {
      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        Alert.alert(
          'Ubicación desactivada',
          'Activa la ubicación desde los ajustes del dispositivo para poder usar esta función.'
        );
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permiso denegado',
          'Necesitamos acceso a tu ubicación para fijar la dirección de cobro.',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Abrir ajustes', onPress: () => Linking.openSettings() },
          ]
        );
        return;
      }

      setLocating(true);
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const lat = roundCoord(location.coords.latitude);
      const lng = roundCoord(location.coords.longitude);

      onLocationSelect(lat, lng);
      fillAddress(lat, lng);
      mapRef.current?.animateToRegion({
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } catch (err) {
      Alert.alert('Error', 'No se pudo obtener tu ubicación. Inténtalo de nuevo.');
    } finally {
      setLocating(false);
    }
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
        <View className="h-80 w-full bg-muted">
          <MapView
            ref={mapRef}
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
            ? `Seleccionado: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}` 
            : 'Ninguna ubicación seleccionada'}
        </Text>
      )}
    </View>
  );
}
