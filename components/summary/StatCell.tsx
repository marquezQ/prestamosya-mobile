import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';

interface StatCellProps {
  label: string;
  value: number;
  valueClassName?: string;
}

/** Celda pequeña de KPI numérico (label + valor) usada en grillas de tarjetas. */
export function StatCell({ label, value, valueClassName = 'text-foreground' }: StatCellProps) {
  return (
    <View className="flex-1 bg-muted/40 rounded-xl p-2.5 items-center border border-border/50">
      <Text className="text-muted-foreground text-xs font-bold uppercase tracking-wider text-center">
        {label}
      </Text>
      <Text className={`font-bold text-base mt-0.5 ${valueClassName}`}>{value ?? 0}</Text>
    </View>
  );
}