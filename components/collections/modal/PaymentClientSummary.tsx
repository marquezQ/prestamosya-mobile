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
    <View className="flex-row items-center gap-2.5 bg-muted/40 border border-border/60 rounded-xl p-2.5">
      <View className="w-9 h-9 rounded-full bg-primary/20 items-center justify-center shrink-0">
        <Text className="text-secondary font-bold text-sm">{initials}</Text>
      </View>
      <View className="flex-1 justify-center">
        <Text className="text-foreground font-bold text-sm leading-snug" numberOfLines={1}>
          {clientName}
        </Text>
        {clientPhone ? (
          <Text className="text-muted-foreground text-xs font-medium">
            Tel: {clientPhone}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
