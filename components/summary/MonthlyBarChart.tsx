import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { SectionHeader } from './SectionHeader';
import { formatAmountNumber } from '@/lib/format';
import { MonthlyHistoryItem } from '@/types/stats';
import { BarChart3 } from 'lucide-react-native';
import { palette } from '@/lib/theme/colors';

interface MonthlyBarChartProps {
  data: MonthlyHistoryItem[];
}

const MAX_BAR_HEIGHT = 120;

export function MonthlyBarChart({ data }: MonthlyBarChartProps) {
  const items = data ?? [];
  const maxNetProfit = items.reduce(
    (max, item) => Math.max(max, item?.netProfit?.BOB ?? 0),
    0,
  );

  const header = (
    <SectionHeader
      icon={<BarChart3 size={18} color={palette.azul} />}
      title="Historial Mensual"
      subtitle="monthlyHistory · netProfit.BOB"
    />
  );

  if (items.length === 0) {
    return (
      <View className="mx-4 mb-3 bg-card border border-border rounded-2xl p-4 shadow-sm">
        {header}
        <View className="border border-dashed border-border rounded-xl p-4 items-center">
          <Text className="text-muted-foreground text-xs font-semibold">
            Sin datos suficientes para la gráfica.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="mx-4 mb-3 bg-card border border-border rounded-2xl p-4 shadow-sm">
      {header}

      <View className="flex-row items-end gap-2">
        {items.map((item) => {
          const value = item?.netProfit?.BOB ?? 0;
          const isNegative = value < 0;
          const barHeight =
            value > 0 && maxNetProfit > 0
              ? Math.max(6, Math.round((value / maxNetProfit) * MAX_BAR_HEIGHT))
              : 4;

          return (
            <View key={`${item.year}-${item.month}`} className="flex-1 items-center">
              <Text
                numberOfLines={1}
                className={`text-xs font-bold mb-1 ${
                  isNegative
                    ? 'text-red-500'
                    : value > 0
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-muted-foreground'
                }`}
              >
                {formatAmountNumber(value)}
              </Text>

              <View
                className={`w-7 rounded-t-md ${
                  isNegative ? 'bg-red-500' : value > 0 ? 'bg-secondary' : 'bg-muted'
                }`}
                style={{ height: barHeight }}
              />

              <Text numberOfLines={1} className="text-muted-foreground text-xs font-semibold mt-1.5">
                {item.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}