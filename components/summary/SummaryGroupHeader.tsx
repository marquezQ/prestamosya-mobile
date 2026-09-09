import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';

interface SummaryGroupHeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function SummaryGroupHeader({ icon, title, subtitle }: SummaryGroupHeaderProps) {
  return (
    <View className="mx-4 mt-5 mb-2">
      <View className="flex-row items-center gap-2.5">
        <View className="w-9 h-9 rounded-2xl bg-secondary/10 items-center justify-center shrink-0">
          {icon}
        </View>
        <Text className="text-foreground font-bold text-lg">{title}</Text>
      </View>
      {subtitle ? (
        <Text className="text-muted-foreground text-xs font-medium mt-1.5 leading-4">
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}