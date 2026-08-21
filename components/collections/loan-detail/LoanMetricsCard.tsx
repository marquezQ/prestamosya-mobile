import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { LoanProgressBar } from '@/components/client-detail/LoanProgressBar';
import { formatBs } from '@/lib/format';

interface LoanMetricsCardProps {
  totalPaid: number;
  totalAmount: number;
  outstandingBalance: number;
}

export function LoanMetricsCard({
  totalPaid,
  totalAmount,
  outstandingBalance,
}: LoanMetricsCardProps) {
  const progressPercent = Math.min(
    100,
    Math.round((totalPaid / (totalAmount > 0 ? totalAmount : 1)) * 100)
  );

  return (
    <View className="mx-4 mt-3 bg-secondary/5 border border-secondary/15 rounded-2xl p-4 shadow-sm">
      <Text className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-1">
        Deuda Total
      </Text>
      <View className="flex-row items-baseline gap-1.5 mb-2.5">
        <Text className="text-3xl font-bold text-secondary">
          {formatBs(totalPaid)}
        </Text>
        <Text className="text-muted-foreground text-base font-medium">
          / {formatBs(totalAmount)}
        </Text>
      </View>

      <LoanProgressBar paid={totalPaid} total={totalAmount} className="mb-2" />

      <View className="flex-row justify-between items-center mt-1">
        <Text className="text-muted-foreground text-xs font-medium">
          Progreso de pago ({progressPercent}%)
        </Text>
        <Text className="text-secondary font-bold text-xs">
          Saldo Restante: {formatBs(outstandingBalance)}
        </Text>
      </View>
    </View>
  );
}
