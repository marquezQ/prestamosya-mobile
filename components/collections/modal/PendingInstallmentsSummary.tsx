import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { LoanInstallmentItem, Currency } from '@/types/loan';
import { formatDateBO, formatCurrency } from '@/lib/format';
import { getInstallmentStatusConfig } from '../installmentStatus';

interface PendingInstallmentsSummaryProps {
  installments: LoanInstallmentItem[];
  currency?: Currency;
}

export function PendingInstallmentsSummary({
  installments,
  currency = 'BOB',
}: PendingInstallmentsSummaryProps) {
  const pendingItems = installments.filter(
    (ins) => ins.status === 'PENDING' || ins.status === 'OVERDUE' || ins.status === 'PARTIAL'
  );

  if (pendingItems.length === 0) return null;

  return (
    <View>
      <Text className="text-foreground text-xs font-bold uppercase tracking-wider mb-1.5">
        Cuotas Pendientes Referenciales
      </Text>
      {pendingItems.slice(0, 2).map((inst) => {
        const badge = getInstallmentStatusConfig(inst.status);
        const amountToPay = inst.remainingAmount > 0 ? inst.remainingAmount : inst.totalAmount;
        return (
          <View
            key={inst.id}
            className="flex-row items-center justify-between bg-muted/20 border border-border/60 rounded-xl px-3 py-2 mb-1.5"
          >
            <View className="flex-1 mr-2 flex-row items-center gap-2">
              <Text className="text-foreground font-bold text-xs">
                Cuota #{inst.installmentNumber}
              </Text>
              <View className={`px-2 py-0.5 rounded-full ${badge.bg}`}>
                <Text className={`text-xs font-bold ${badge.textColor}`}>
                  {badge.label}
                </Text>
              </View>
              <Text className="text-muted-foreground text-xs font-medium">
                ({formatDateBO(inst.dueDate)})
              </Text>
            </View>
            <Text className="text-foreground font-bold text-sm">
              {formatCurrency(amountToPay, currency)}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
