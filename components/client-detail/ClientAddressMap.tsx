import React from 'react';
import { View, Linking, Share } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { MapPin, ExternalLink, Share2, Compass } from 'lucide-react-native';
import { palette } from '@/lib/theme/colors';
import { AppMapView } from '@/components/ui/AppMapView';

interface ClientAddressMapProps {
  address: string | null;
  latitude: number | null;
  longitude: number | null;
}

export function ClientAddressMap({ address, latitude, longitude }: ClientAddressMapProps) {
  const lat = latitude ?? -17.385381;
  const lng = longitude ?? -66.147229;
  const hasCoordinates = latitude !== null && longitude !== null;
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  const handleOpenMaps = () => {
    Linking.openURL(mapUrl).catch((err) =>
      console.error('Error al abrir maps:', err)
    );
  };

  const handleShareLocation = async () => {
    try {
      const shareMessage = address
        ? `Ubicación de cobro:\n${address}\n${mapUrl}`
        : `Ubicación de cobro:\n${mapUrl}`;

      await Share.share({
        title: 'Ubicación de cobro',
        message: shareMessage,
        url: mapUrl,
      });
    } catch (error) {
      console.error('Error al compartir ubicación:', error);
    }
  };

  return (
    <View className="px-4 mb-6">
      <View className="flex-row items-center gap-2 mb-3">
        <MapPin size={20} color={palette.azul} />
        <Text className="font-bold text-foreground text-xl">Dirección de Cobro</Text>
      </View>

      <View className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        {/* Panel de Dirección */}
        <View className="p-4 bg-card border-b border-border/50 flex-row items-center gap-3">
          <View className="bg-primary/10 p-3 rounded-full">
            <MapPin size={22} color={palette.azul} />
          </View>
          <View className="flex-1">
            <Text className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-0.5">
              Dirección registrada
            </Text>
            <Text className="text-foreground text-base font-semibold">
              {address || 'Sin dirección de texto registrada'}
            </Text>
          </View>
        </View>

        {/* Mapa read-only */}
        <AppMapView
          latitude={latitude}
          longitude={longitude}
          interactive={true}
          showMarker={hasCoordinates}
          className="h-96 w-full"
        />

        {/* Tarjeta de Coordenadas GPS */}
        <View className="px-4 py-3 bg-muted/40 flex-row items-center gap-3 border-t border-border/50">
          <Compass size={20} color={palette.celeste} />
          <View className="flex-1">
            <Text className="text-muted-foreground text-xs font-semibold">
              Coordenadas GPS
            </Text>
            <Text className="text-foreground text-sm font-mono font-bold">
              {hasCoordinates
                ? `${lat.toFixed(6)}, ${lng.toFixed(6)}`
                : 'Sin coordenadas registradas'}
            </Text>
          </View>
        </View>

        {/* Botones de Acción */}
        <View className="p-4 bg-card flex-row gap-3">
          <Button
            variant="outline"
            className="flex-1 flex-row items-center justify-center gap-2 h-12 rounded-xl border-secondary/40 active:bg-secondary/10"
            onPress={handleOpenMaps}
          >
            <ExternalLink size={18} color={palette.azul} />
            <Text className="font-bold text-secondary text-sm">Abrir en Maps</Text>
          </Button>

          <Button
            className="flex-1 flex-row items-center justify-center gap-2 bg-secondary active:bg-secondary/90 h-12 rounded-xl"
            onPress={handleShareLocation}
          >
            <Share2 size={18} color="#ffffff" />
            <Text className="font-bold text-white text-sm">Compartir</Text>
          </Button>
        </View>
      </View>
    </View>
  );
}
