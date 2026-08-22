import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { LoanInstallmentItem } from '@/types/loan';
import { formatDateBO, formatBs } from '@/lib/format';
import { getInstallmentStatusConfig } from '../installmentStatus';

interface PendingInstallmentsSummaryProps {
  installments: LoanInstallmentItem[];
}

export function PendingInstallmentsSummary({
  installments,
}: PendingInstallmentsSummaryProps) {
  const pendingItems = installments.filter(
    (ins) => ins.status === 'PENDING' || ins.status === 'OVERDUE' || ins.status === 'PARTIAL'
  );

  if (pendingItems.length === 0) return null;

  return (
    <View>
      <Text className="text-foreground font-bold text-sm mb-2">
        Cuotas pendientes
      </Text>
      {pendingItems.slice(0, 2).map((inst) => {
        const badge = getInstallmentStatusConfig(inst.status);
        return (
          <View
            key={inst.id}
            className="flex-row items-center justify-between bg-background border border-border rounded-xl p-3 mb-2"
          >
            <View className="flex-1 mr-2">
              <View className="flex-row items-center gap-2 mb-0.5">
                <Text className="text-foreground font-bold text-sm">
                  Cuota #{inst.installmentNumber}
                </Text>
                <View className={`px-2 py-0.5 rounded-full ${badge.bg}`}>
                  <Text className={`text-xs font-bold ${badge.textColor}`}>
                    {badge.label}
                  </Text>
                </View>
              </View>
              <Text className="text-muted-foreground text-xs">
                Vence: {formatDateBO(inst.dueDate)}
              </Text>
            </View>
            <Text className="text-foreground font-bold text-base">
              {formatBs(inst.remainingAmount > 0 ? inst.remainingAmount : inst.totalAmount)}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
