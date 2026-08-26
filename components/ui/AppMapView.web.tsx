import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { MapPin } from 'lucide-react-native';
import { palette } from '@/lib/theme/colors';
import {
  DEFAULT_MAP_COORDS,
  DEFAULT_MAP_ZOOM,
} from '@/lib/maps/config';

interface AppMapViewProps {
  latitude?: number | null;
  longitude?: number | null;
  zoom?: number;
  interactive?: boolean;
  showMarker?: boolean;
  onPress?: (latitude: number, longitude: number) => void;
  className?: string;
}

export function AppMapView({
  latitude,
  longitude,
  className = 'h-80 w-full',
}: AppMapViewProps) {
  const lat = latitude ?? DEFAULT_MAP_COORDS.latitude;
  const lng = longitude ?? DEFAULT_MAP_COORDS.longitude;

  return (
    <View
      className={`bg-muted items-center justify-center p-4 ${className}`}
    >
      <View className="bg-card rounded-full p-3 mb-2 border border-border">
        <MapPin size={32} color={palette.azul} />
      </View>
      <Text className="text-muted-foreground text-xs text-center font-medium mb-1">
        El mapa interactivo está disponible en la app móvil.
      </Text>
      <Text className="text-muted-foreground/60 text-[10px] text-center font-mono">
        {lat.toFixed(6)}, {lng.toFixed(6)}
      </Text>
    </View>
  );
}
