import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  /** Contenido opcional alineado a la derecha (badge, contador, etc.). */
  right?: React.ReactNode;
}

export function SectionHeader({ icon, title, subtitle, right }: SectionHeaderProps) {
  return (
    <View className="flex-row items-center justify-between mb-3">
      <View className="flex-row items-center gap-2 flex-1">
        <View className="w-8 h-8 rounded-xl bg-primary/10 items-center justify-center shrink-0">
          {icon}
        </View>
        <View className="flex-1">
          <Text className="text-foreground font-bold text-base leading-snug">{title}</Text>
          {subtitle ? (
            <Text className="text-muted-foreground text-xs font-medium mt-0.5">{subtitle}</Text>
          ) : null}
        </View>
      </View>
      {right}
    </View>
  );
}