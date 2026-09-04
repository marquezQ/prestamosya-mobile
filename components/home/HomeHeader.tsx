import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuthStore } from '@/stores/authStore';

export function HomeHeader() {
  const user = useAuthStore((state) => state.user);
  const userName = user?.name || user?.username || '';
  const dateStr = format(new Date(), "EEEE, d 'de' MMMM", { locale: es });
  const capitalizedDate = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

  return (
    <View className="flex-row items-center justify-between px-4 py-3 border-b border-border bg-background">
      <View>
        <Text className="font-bold text-lg text-foreground">
          Resumen General{userName ? ` - ${userName}` : ''}
        </Text>
        <Text className="text-muted-foreground text-xs font-semibold mt-0.5">
          {capitalizedDate}
        </Text>
      </View>
    </View>
  );
}
