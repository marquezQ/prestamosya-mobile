import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { getInitials } from '@/lib/format';

interface LoanClientHeaderCardProps {
  clientName: string;
  clientPhone: string;
  clientIdNumber?: string;
}

export function LoanClientHeaderCard({
  clientName,
  clientPhone,
  clientIdNumber,
}: LoanClientHeaderCardProps) {
  const initials = getInitials(clientName);

  return (
    <View className="mx-4 mt-4 bg-card border border-border rounded-2xl p-4 flex-row items-center gap-3.5 shadow-sm">
      <View className="w-14 h-14 rounded-full bg-primary/20 items-center justify-center border border-primary/30">
        <Text className="text-secondary dark:text-primary font-bold text-lg">
          {initials}
        </Text>
      </View>
      <View className="flex-1">
        <Text className="text-foreground font-bold text-lg leading-snug">
          {clientName}
        </Text>
        <Text className="text-muted-foreground text-sm font-medium mt-0.5">
          Tel: {clientPhone} • CI: {clientIdNumber || '—'}
        </Text>
      </View>
    </View>
  );
}
