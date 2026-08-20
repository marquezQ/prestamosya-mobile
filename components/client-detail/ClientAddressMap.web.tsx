import React from 'react';
import { View, Linking } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { MapPin, ExternalLink, Share2 } from 'lucide-react-native';
import { palette } from '@/lib/theme/colors';

interface ClientAddressMapProps {
  address: string | null;
  latitude: number | null;
  longitude: number | null;
}

export function ClientAddressMap({ address, latitude, longitude }: ClientAddressMapProps) {
  const lat = latitude ?? -17.385381;
  const lng = longitude ?? -66.147229;
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  const handleOpenGoogleMaps = () => {
    Linking.openURL(mapUrl);
  };

  const handleShareLocation = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(mapUrl);
      alert('Enlace de ubicación copiado al portapapeles');
    }
  };

  return (
    <View className="px-4 mb-6">
      <View className="flex-row items-center gap-2 mb-3">
        <MapPin size={20} color={palette.azul} />
        <Text className="font-bold text-foreground text-xl">Dirección de Cobro</Text>
      </View>

      <View className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <View className="h-96 w-full bg-muted items-center justify-center p-4">
          <MapPin size={36} color={palette.azul} className="mb-2" />
          <Text className="text-muted-foreground text-sm font-semibold text-center mb-1">
            Mapa de ubicación
          </Text>
          <Text className="text-muted-foreground text-xs text-center">
            (El mapa interactivo nativo está optimizado para dispositivos móviles)
          </Text>
        </View>

        <View className="p-4 bg-card border-b border-border/50 flex-row items-center gap-3">
          <View className="bg-primary/10 p-2.5 rounded-full">
            <MapPin size={20} color={palette.azul} />
          </View>
          <View className="flex-1">
            <Text className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-0.5">
              Dirección exacta
            </Text>
            <Text className="text-foreground text-base font-semibold">
              {address || 'Sin dirección registrada'}
            </Text>
          </View>
        </View>

        <View className="p-4 bg-card flex-row gap-3">
          <Button
            variant="outline"
            className="flex-1 flex-row items-center justify-center gap-2 h-12 rounded-xl border-secondary/40 active:bg-secondary/10"
            onPress={handleOpenGoogleMaps}
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
