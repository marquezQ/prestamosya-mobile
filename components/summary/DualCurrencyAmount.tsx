import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { formatCurrency } from '@/lib/format';
import { CurrencyAmount } from '@/types/stats';

interface DualCurrencyAmountProps {
  amount: CurrencyAmount;
  /** Clase de tamaño/color del monto principal (BOB). */
  textClassName?: string;
}

/**
 * Renderiza un monto multicurrency ({ BOB, USD }) como texto.
 * El monto USD solo se muestra cuando es mayor a 0.
 */
export function DualCurrencyAmount({
  amount,
  textClassName = 'text-foreground font-extrabold text-base',
}: DualCurrencyAmountProps) {
  const bob = amount?.BOB ?? 0;
  const usd = amount?.USD ?? 0;

  return (
    <View className="items-end">
      <Text numberOfLines={1} className={textClassName}>
        {formatCurrency(bob, 'BOB')}
      </Text>
      {usd > 0 && (
        <Text numberOfLines={1} className="text-muted-foreground text-xs font-semibold">
          {formatCurrency(usd, 'USD')}
        </Text>
      )}
    </View>
  );
}