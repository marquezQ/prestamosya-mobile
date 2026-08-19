import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Shield } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { palette } from '@/lib/theme/colors';

/**
 * GuaranteesTab
 * Placeholder — se conectará al backend de garantías cuando esté listo.
 * Por ahora muestra un estado vacío con un call-to-action descriptivo.
 */
export function GuaranteesTab() {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 bg-background items-center justify-center px-8"
      style={{ paddingBottom: insets.bottom + 24 }}
    >
      <View className="bg-card border border-border rounded-2xl p-8 items-center w-full shadow-sm">
        <View className="bg-primary/10 rounded-full p-5 mb-5">
          <Shield size={40} color={palette.azul} />
        </View>

        <Text className="text-foreground font-bold text-xl text-center mb-2">
          Sin Garantías Registradas
        </Text>
        <Text className="text-muted-foreground text-base text-center leading-6">
          Las garantías asociadas a este cliente aparecerán aquí una vez que sean registradas en el sistema.
        </Text>
      </View>
    </View>
  );
}
