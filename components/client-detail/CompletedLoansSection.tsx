import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { CheckCircle2 } from 'lucide-react-native';
import { CompletedLoanSummary } from '@/types/client';

interface CompletedLoansSectionProps {
  loans: CompletedLoanSummary[];
}

export function CompletedLoansSection({ loans }: CompletedLoansSectionProps) {
  if (!loans || loans.length === 0) return null;

  return (
    <View className="px-4 mb-8">
      <Text className="font-bold text-foreground text-base mb-3">
        Préstamos Completados
      </Text>
      
      {loans.map((loan) => (
        <View 
          key={loan.id} 
          className="bg-muted border border-border rounded-xl p-4 mb-3 flex-row justify-between items-center opacity-80"
        >
          <Text className="font-bold text-foreground text-lg">
            {loan.totalAmount} Bs
          </Text>
          
          <View className="flex-row items-center gap-1.5">
            <CheckCircle2 size={16} color="#22c55e" />
            <Text className="font-bold text-green-500 dark:text-green-400 text-xs uppercase tracking-wider">
              Completado
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}
