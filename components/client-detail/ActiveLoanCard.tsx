import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react-native';
import { ActiveLoanSummary } from '@/types/client';
import { LoanProgressBar } from './LoanProgressBar';

interface ActiveLoanCardProps {
  loan: ActiveLoanSummary;
}

export function ActiveLoanCard({ loan }: ActiveLoanCardProps) {
  const remaining = loan.totalDebt - (loan.paidInstallments * loan.installmentAmount);

  const getNextPaymentLabel = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);
    
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Mañana';
    if (diffDays < 0) return `Hace ${Math.abs(diffDays)} días`;
    return `En ${diffDays} días`;
  };

  return (
    <View className="bg-card border border-border rounded-2xl overflow-hidden mx-4 mb-6 shadow-sm">
      {/* Header */}
      <View className="bg-primary/5 p-4 border-b border-border">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="font-bold text-foreground text-lg">Préstamo Activo</Text>
          <View className="bg-primary/20 px-3 py-1 rounded-full">
            <Text className="text-primary font-bold text-xs uppercase tracking-wider">
              En curso
            </Text>
          </View>
        </View>
        <Text className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">
          {loan.type}
        </Text>
      </View>

      {/* Body */}
      <View className="p-4">
        {/* Progress Section */}
        <View className="flex-row justify-between items-end mb-2">
          <Text className="text-muted-foreground text-sm">Deuda Total</Text>
          <Text className="text-muted-foreground text-xs">
            {loan.paidInstallments}/{loan.totalInstallments} cuotas pagadas
          </Text>
        </View>

        <View className="flex-row items-baseline mb-4 gap-1">
          <Text className="text-3xl font-bold text-secondary">
            {(loan.paidInstallments * loan.installmentAmount).toFixed(0)} Bs
          </Text>
          <Text className="text-muted-foreground text-base">
            / {loan.totalAmount} Bs
          </Text>
        </View>

        <LoanProgressBar 
          paid={loan.paidInstallments} 
          total={loan.totalInstallments}
          className="mb-2"
        />
        
        <Text className="text-right text-xs font-semibold text-foreground mb-6">
          {remaining > 0 ? `${remaining.toFixed(0)} Bs restante` : '0 Bs restante'}
        </Text>

        {/* Grid info */}
        <View className="flex-row border-b border-border pb-4 mb-4">
          <View className="flex-1">
            <Text className="text-muted-foreground text-xs mb-1">Próximo Pago</Text>
            <Text className="text-foreground font-bold text-base mb-0.5">
              {getNextPaymentLabel(loan.nextPaymentDate)}
            </Text>
            <Text className="text-foreground text-xs">
              {new Date(loan.nextPaymentDate).toLocaleDateString('es-BO', { day: 'numeric', month: 'short' })}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-muted-foreground text-xs mb-1">Cuota {loan.frequency}</Text>
            <Text className="text-foreground font-bold text-base mb-0.5">
              Bs. {loan.installmentAmount}
            </Text>
            <Text className="text-muted-foreground text-xs">
              Faltan {loan.totalInstallments - loan.paidInstallments} cuotas
            </Text>
          </View>
        </View>

        {/* Action Button */}
        <Button className="w-full bg-secondary active:bg-secondary/80 flex-row gap-2">
          <Plus size={18} color="#ffffff" className="text-white" />
          <Text className="text-white font-semibold">Registrar pago</Text>
        </Button>
      </View>
    </View>
  );
}
