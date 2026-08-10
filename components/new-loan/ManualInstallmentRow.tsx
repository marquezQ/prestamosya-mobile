import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/DatePicker';
import { Trash2 } from 'lucide-react-native';

interface ManualInstallmentRowProps {
  index: number;
  dueDate: string;
  totalAmount: string;
  onDateChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  onRemove: () => void;
  canRemove: boolean;
}

export function ManualInstallmentRow({
  index,
  dueDate,
  totalAmount,
  onDateChange,
  onAmountChange,
  onRemove,
  canRemove,
}: ManualInstallmentRowProps) {
  return (
    <View className="flex-row items-center gap-2 mb-3">
      {/* Número de cuota */}
      <View className="w-8 h-12 items-center justify-center bg-muted rounded-md">
        <Text className="text-muted-foreground text-xs font-bold">{index + 1}</Text>
      </View>

      {/* Fecha de pago */}
      <DatePicker
        value={dueDate}
        onChange={onDateChange}
        className="flex-1"
      />

      {/* Monto */}
      <Input
        placeholder="Monto Bs"
        value={totalAmount}
        onChangeText={onAmountChange}
        keyboardType="numeric"
        className="w-28 h-10"
      />

      {/* Botón eliminar */}
      <Pressable
        onPress={onRemove}
        disabled={!canRemove}
        className={`w-9 h-9 items-center justify-center rounded-lg ${
          canRemove ? 'bg-destructive/10 active:bg-destructive/20' : 'opacity-30'
        }`}
      >
        <Trash2
          size={16}
          className={canRemove ? 'text-destructive' : 'text-muted-foreground'}
        />
      </Pressable>
    </View>
  );
}
