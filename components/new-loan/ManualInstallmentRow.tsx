import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/DatePicker';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import type { LoanFormValues } from '@/lib/schemas/loanForm';
import { Trash2 } from 'lucide-react-native';

interface ManualInstallmentRowProps {
  index: number;
  control: Control<LoanFormValues>;
  errors: FieldErrors<LoanFormValues>;
  onRemove: () => void;
  canRemove: boolean;
}

export function ManualInstallmentRow({
  index,
  control,
  errors,
  onRemove,
  canRemove,
}: ManualInstallmentRowProps) {
  const rowError = (errors.installments as any)?.[index];

  return (
    <View className="flex-row items-center gap-2 mb-3 bg-card border border-border rounded-xl p-3">
      <Text className="text-muted-foreground font-bold text-sm w-6">
        #{index + 1}
      </Text>

      <View className="flex-1">
        <Controller
          control={control}
          name={`installments.${index}.dueDate` as const}
          render={({ field: { onChange, value } }) => (
            <DatePicker value={value || null} onChange={onChange} />
          )}
        />
        {rowError?.dueDate && (
          <Text className="text-destructive text-xs mt-1">
            {rowError.dueDate.message}
          </Text>
        )}
      </View>

      <View className="w-28">
        <Controller
          control={control}
          name={`installments.${index}.totalAmount` as const}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="0.00"
              keyboardType="numeric"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value || ''}
              className="h-10 text-sm text-right font-bold"
            />
          )}
        />
        {rowError?.totalAmount && (
          <Text className="text-destructive text-xs mt-1 text-right">
            {rowError.totalAmount.message}
          </Text>
        )}
      </View>

      {canRemove && (
        <Pressable
          onPress={onRemove}
          className="w-10 h-10 items-center justify-center bg-destructive/10 rounded-lg"
        >
          <Trash2 size={18} className="text-destructive" />
        </Pressable>
      )}
    </View>
  );
}
