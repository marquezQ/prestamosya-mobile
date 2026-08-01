import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { ActiveLoanSummary } from '@/types/client';

interface OtherActiveLoansSectionProps {
  loans: ActiveLoanSummary[];
}

export function OtherActiveLoansSection({ loans }: OtherActiveLoansSectionProps) {
  if (!loans || loans.length === 0) return null;

  return (
    <View className="px-4 mb-6">
      <Text className="font-bold text-foreground text-base mb-3">
        Otros Préstamos Activos
      </Text>
      
      {loans.map((loan) => (
        <View 
          key={loan.id} 
          className="bg-card border border-border rounded-xl p-4 mb-3 flex-row justify-between items-center shadow-sm"
        >
          <View>
            <Text className="font-bold text-foreground text-lg mb-1">
              {loan.totalAmount} Bs
            </Text>
            <Text className="text-muted-foreground text-xs">
              {loan.paidInstallments}/{loan.totalInstallments} cuotas
            </Text>
          </View>
          
          <Text className="text-muted-foreground text-xs">
            {new Date(loan.nextPaymentDate).toLocaleDateString('es-BO', { day: 'numeric', month: 'long' })}
          </Text>
        </View>
      ))}
    </View>
  );
}
