import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Banknote } from 'lucide-react-native';
import { LoanPaymentItem } from '@/types/loan';
import { formatDateBO, formatBs } from '@/lib/format';

interface LoanPaymentHistoryListProps {
  payments: LoanPaymentItem[];
}

export function LoanPaymentHistoryList({ payments }: LoanPaymentHistoryListProps) {
  if (!payments || payments.length === 0) return null;

  return (
    <View className="mt-2">
      <View className="mx-4 mb-3">
        <Text className="text-foreground font-bold text-xl tracking-tight">
          Historial de Pagos
        </Text>
      </View>

      {payments.map((pay) => (
        <View
          key={pay.id}
          className="mx-4 mb-3 rounded-2xl bg-card border border-border p-4 shadow-sm flex-row items-center justify-between"
        >
          <View className="flex-row items-center gap-3">
            <View className="bg-green-500/10 p-2.5 rounded-xl">
              <Banknote size={20} color="#22c55e" />
            </View>
            <View>
              <Text className="text-foreground font-bold text-base">
                Pago registrado ({pay.method.toUpperCase()})
              </Text>
              <Text className="text-muted-foreground text-xs font-medium mt-0.5">
                {formatDateBO(pay.paymentDate)} • {pay.notes || 'Sin notas'}
              </Text>
            </View>
          </View>

          <Text className="text-green-600 dark:text-green-400 font-bold text-base">
            + {formatBs(pay.amount)}
          </Text>
        </View>
      ))}
    </View>
  );
}
