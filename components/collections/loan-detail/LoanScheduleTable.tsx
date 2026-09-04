import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { CalendarDays } from 'lucide-react-native';
import { LoanInstallmentItem, Currency } from '@/types/loan';
import { palette } from '@/lib/theme/colors';
import { formatDateBO, formatCurrency } from '@/lib/format';
import { getInstallmentStatusConfig } from '../installmentStatus';

interface LoanScheduleTableProps {
  installments: LoanInstallmentItem[];
  currency?: Currency;
}

export function LoanScheduleTable({ installments, currency = 'BOB' }: LoanScheduleTableProps) {
  return (
    <View className="mx-4 rounded-2xl overflow-hidden border border-border bg-card shadow-sm mb-4">
      {/* Table Header */}
      <View className="flex-row items-center px-4 py-3 bg-muted/80 border-b border-border">
        <View className="w-10 items-center">
          <Text className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            #
          </Text>
        </View>
        <View className="flex-1 flex-row items-center gap-1.5">
          <CalendarDays size={13} color={palette.azul} />
          <Text className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Fecha
          </Text>
        </View>
        <View className="w-24 items-end">
          <Text className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Monto
          </Text>
        </View>
        <View className="w-24 items-end">
          <Text className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Estado
          </Text>
        </View>
      </View>

      {/* Table Rows */}
      {installments.map((inst, index) => {
        const badge = getInstallmentStatusConfig(inst.status);
        const isLast = index === installments.length - 1;

        return (
          <View
            key={inst.id}
            className={`flex-row items-center px-4 py-3.5 ${
              !isLast ? 'border-b border-border/50' : ''
            }`}
          >
            {/* Cuota # */}
            <View className="w-10 items-center">
              <Text className="text-xs font-bold text-muted-foreground">
                #{inst.installmentNumber}
              </Text>
            </View>

            {/* Fecha */}
            <View className="flex-1">
              <Text className="text-foreground font-bold text-sm">
                {formatDateBO(inst.dueDate)}
              </Text>
            </View>

            {/* Monto */}
            <View className="w-24 items-end">
              <Text className="text-foreground font-bold text-sm">
                {formatCurrency(inst.totalAmount, currency)}
              </Text>
            </View>

            {/* Estado */}
            <View className="w-24 items-end">
              <View className={`px-2 py-0.5 rounded-full ${badge.bg}`}>
                <Text className={`text-xs font-bold ${badge.textColor}`}>
                  {badge.label}
                </Text>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}
