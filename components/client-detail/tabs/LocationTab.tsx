import React from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ClientAddressMap } from '../ClientAddressMap';

interface LocationTabProps {
  address: string | null;
  latitude: number | null;
  longitude: number | null;
}

export function LocationTab({ address, latitude, longitude }: LocationTabProps) {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingBottom: insets.bottom + 24, paddingTop: 16 }}
      showsVerticalScrollIndicator={false}
    >
      <ClientAddressMap
        address={address}
        latitude={latitude}
        longitude={longitude}
      />
    </ScrollView>
  );
}
