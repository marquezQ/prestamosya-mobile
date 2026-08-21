import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { formatBs } from '@/lib/format';

interface DailyProgressCardProps {
  collectedAmount: number;
  totalTargetAmount: number;
}

export function DailyProgressCard({
  collectedAmount,
  totalTargetAmount,
}: DailyProgressCardProps) {
  const percentage =
    totalTargetAmount > 0
      ? Math.min(100, Math.round((collectedAmount / totalTargetAmount) * 100))
      : 0;

  return (
    <View className="mx-4 my-3 bg-card border border-border rounded-2xl p-4 shadow-sm">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-muted-foreground text-xs font-bold uppercase tracking-wider">
          Progreso del día
        </Text>
        <Text className="text-green-600 dark:text-green-400 font-bold text-base">
          {percentage}%
        </Text>
      </View>

      <View className="flex-row items-baseline mb-3 gap-1.5">
        <Text className="text-foreground font-bold text-xl">
          {formatBs(collectedAmount)}
        </Text>
        <Text className="text-muted-foreground text-sm font-medium">
          de {formatBs(totalTargetAmount)}
        </Text>
      </View>

      {/* Progress Bar Track */}
      <View className="h-3 w-full bg-muted rounded-full overflow-hidden">
        <View
          className="h-full bg-green-500 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </View>
    </View>
  );
}
