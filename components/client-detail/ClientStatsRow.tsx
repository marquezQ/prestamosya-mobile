import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Clock, TrendingUp } from 'lucide-react-native';
import { ClientStats } from '@/types/client';

interface ClientStatsRowProps {
  stats: ClientStats;
}

export function ClientStatsRow({ stats }: ClientStatsRowProps) {
  return (
    <View className="flex-row gap-4 px-4 mb-6">
      {/* Historial Card */}
      <View className="flex-1 bg-card border border-border rounded-2xl p-4 items-center shadow-sm">
        <Clock size={28} color="#ef4444" className="mb-3" />
        <Text className="text-red-500 dark:text-red-400 text-sm font-bold uppercase tracking-wider mb-2">
          Historial
        </Text>
        <Text className="text-4xl font-extrabold text-foreground mb-1">
          {stats.totalPayments}
        </Text>
        <Text className="text-muted-foreground text-sm">
          Pagos
        </Text>
      </View>

      {/* Puntualidad Card */}
      <View className="flex-1 bg-card border border-border rounded-2xl p-4 items-center shadow-sm">
        <TrendingUp size={28} color="#22c55e" className="mb-3" />
        <Text className="text-green-500 dark:text-green-400 text-sm font-bold uppercase tracking-wider mb-2">
          Puntualidad
        </Text>
        <Text className="text-4xl font-extrabold text-foreground mb-1">
          {stats.punctualityPercentage}%
        </Text>
      </View>
    </View>
  );
}
