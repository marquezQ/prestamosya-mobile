import React from 'react';
import { View } from 'react-native';

interface DatePickerProps {
  value: string | null;
  onChange: (date: string) => void;
  className?: string;
}

export function DatePicker({ value, onChange, className }: DatePickerProps) {
  // Use a native HTML date input on web to avoid native module crashes.
  // Mismo contrato que nativo: 'yyyy-MM-dd' (fecha de calendario).
  return (
    <View className={className}>
      <input
        type="date"
        value={value || ''}
        onChange={(e) => {
          if (e.target.value) {
            onChange(e.target.value);
          }
        }}
        style={{
          height: 48,
          width: '100%',
          borderWidth: 1,
          borderColor: 'hsl(var(--border))',
          borderRadius: 6,
          paddingLeft: 12,
          paddingRight: 12,
          backgroundColor: 'hsl(var(--background))',
          color: 'hsl(var(--foreground))',
          fontSize: 16,
          outline: 'none',
        }}
      />
    </View>
  );
}