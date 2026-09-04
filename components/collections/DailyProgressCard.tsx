import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { formatCurrency } from '@/lib/format';
import { Currency } from '@/types/loan';

export interface CurrencyProgress {
  currency: Currency;
  collectedAmount: number;
  totalTargetAmount: number;
}

interface DailyProgressCardProps {
  progressItems: CurrencyProgress[];
}

export function DailyProgressCard({ progressItems }: DailyProgressCardProps) {
  if (!progressItems || progressItems.length === 0) return null;

  return (
    <View className="mx-4 my-3 bg-card border border-border rounded-2xl p-4 shadow-sm">
      <Text className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-3">
        Progreso del día
      </Text>

      {progressItems.map((item, index) => {
        const percentage =
          item.totalTargetAmount > 0
            ? Math.min(100, Math.round((item.collectedAmount / item.totalTargetAmount) * 100))
            : 0;
        const isUSD = item.currency === 'USD';

        return (
          <View
            key={item.currency}
            className={index > 0 ? 'mt-3.5 pt-3.5 border-t border-border/60' : ''}
          >
            <View className="flex-row items-center justify-between mb-1.5">
              <View className="flex-row items-center gap-2">
                <View
                  className={`px-2 py-0.5 rounded-full ${
                    isUSD
                      ? 'bg-amber-500/15 border border-amber-500/30'
                      : 'bg-primary/10 border border-primary/20'
                  }`}
                >
                  <Text
                    className={`text-[10px] font-extrabold ${
                      isUSD ? 'text-amber-600 dark:text-amber-400' : 'text-primary'
                    }`}
                  >
                    {item.currency}
                  </Text>
                </View>
                <Text className="text-foreground font-bold text-base">
                  {formatCurrency(item.collectedAmount, item.currency)}
                </Text>
                <Text className="text-muted-foreground text-xs font-medium">
                  de {formatCurrency(item.totalTargetAmount, item.currency)}
                </Text>
              </View>
              <Text className="text-green-600 dark:text-green-400 font-bold text-sm">
                {percentage}%
              </Text>
            </View>

            {/* Progress Bar Track */}
            <View className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
              <View
                className={`h-full rounded-full ${isUSD ? 'bg-amber-500' : 'bg-green-500'}`}
                style={{ width: `${percentage}%` }}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
}
