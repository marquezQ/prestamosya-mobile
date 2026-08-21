import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { getInitials } from '@/lib/format';

interface PaymentClientSummaryProps {
  clientName: string;
  clientPhone: string;
}

export function PaymentClientSummary({
  clientName,
  clientPhone,
}: PaymentClientSummaryProps) {
  const initials = getInitials(clientName);

  return (
    <View className="flex-row items-center gap-3 bg-muted/50 border border-border rounded-2xl p-3.5">
      <View className="w-11 h-11 rounded-full bg-card border border-border items-center justify-center">
        <Text className="text-secondary font-bold text-base">{initials}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-foreground font-bold text-base leading-snug">
          {clientName}
        </Text>
        <Text className="text-muted-foreground text-xs font-medium mt-0.5">
          Tel: {clientPhone}
        </Text>
      </View>
    </View>
  );
}
