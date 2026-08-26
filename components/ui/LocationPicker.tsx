import React, { useState } from 'react';
import { View, Alert, ActivityIndicator, Linking } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { MapPin, LocateFixed } from 'lucide-react-native';
import * as Location from 'expo-location';
import { AppMapView } from '@/components/ui/AppMapView';
import { roundCoord } from '@/lib/maps/config';

interface LocationPickerProps {
  latitude: number | null;
  longitude: number | null;
  onLocationSelect: (lat: number, lng: number) => void;
  onAddressFound?: (address: string) => void;
  error?: string;
}

export function LocationPicker({
  latitude,
  longitude,
  onLocationSelect,
  onAddressFound,
  error,
}: LocationPickerProps) {
  const [locating, setLocating] = useState(false);

  const fillAddress = async (lat: number, lng: number) => {
    if (!onAddressFound) return;
    try {
      const [place] = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
      if (!place) return;
      const parts = [place.street, place.streetNumber, place.city, place.district].filter(Boolean);
      const address = parts.join(', ');
      if (address) onAddressFound(address);
    } catch {
      // Geocoding inverso opcional
    }
  };

  const handleMapPress = (lat: number, lng: number) => {
    const safeLat = roundCoord(lat);
    const safeLng = roundCoord(lng);
    onLocationSelect(safeLat, safeLng);
    fillAddress(safeLat, safeLng);
  };

  const goToMyLocation = async () => {
    try {
      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        Alert.alert(
          'Ubicación desactivada',
          'Activa la ubicación desde los ajustes del dispositivo para poder capturar las coordenadas.'
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
    } catch {
      Alert.alert('Error', 'No se pudo obtener tu ubicación por GPS. Inténtalo de nuevo.');
    } finally {
      setLocating(false);
    }
  };

  const currentLat = latitude;
  const currentLng = longitude;
  const hasSelected = currentLat !== null && currentLng !== null;

  return (
    <View className="mb-4">
      <Text className="text-sm font-medium text-foreground mb-2">
        Ubicación de Cobro (GPS)
      </Text>

      <View
        className={`bg-card border rounded-2xl overflow-hidden shadow-sm ${
          error ? 'border-destructive' : 'border-border'
        }`}
      >
        {/* Mapa interactivo */}
        <AppMapView
          latitude={currentLat}
          longitude={currentLng}
          interactive
          showMarker={hasSelected}
          onPress={handleMapPress}
          className="h-80 w-full"
        />

        {/* Coordenadas capturadas */}
        <View className="flex-row items-center gap-3 px-4 py-3 bg-muted/40 border-t border-border/50">
          <View className="bg-primary/10 p-2.5 rounded-xl">
            <MapPin size={20} className="text-primary" />
          </View>
          <View className="flex-1">
            <Text className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
              {hasSelected ? 'Ubicación Capturada' : 'Toca el mapa para capturar'}
            </Text>
            <Text className="text-foreground font-bold text-sm font-mono mt-0.5">
              {hasSelected
                ? `${currentLat.toFixed(6)}, ${currentLng.toFixed(6)}`
                : 'Sin coordenadas seleccionadas'}
            </Text>
          </View>
        </View>

        {/* Botones */}
        <View className="p-3 border-t border-border/50 flex-row gap-2">
          <Button
            variant="secondary"
            onPress={goToMyLocation}
            disabled={locating}
            className="flex-1 flex-row items-center justify-center gap-2 h-11"
          >
            {locating ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <LocateFixed size={18} color="#ffffff" />
            )}
            <Text className="font-semibold text-white">
              {locating ? 'Obteniendo GPS...' : 'Usar mi ubicación GPS'}
            </Text>
          </Button>
        </View>
      </View>

      {error ? (
        <Text className="text-xs text-destructive mt-1.5">{error}</Text>
      ) : (
        <Text className="text-xs text-muted-foreground mt-1.5">
          Toca el mapa o usa el GPS para capturar las coordenadas de cobro.
        </Text>
      )}
    </View>
  );
}
