import React from 'react';
import { View } from 'react-native';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  className?: string;
}

export function DatePicker({ value, onChange, className }: DatePickerProps) {
  // Use a native HTML date input on web to avoid native module crashes
  return (
    <View className={className}>
      <input
        type="date"
        value={value ? value.split('T')[0] : ''}
        onChange={(e) => {
          if (e.target.value) {
            // Convierte el valor local 'YYYY-MM-DD' a un ISO Date
            onChange(new Date(e.target.value + 'T00:00:00').toISOString());
          }
        }}
        style={{
          height: 40,
          width: '100%',
          borderWidth: 1,
          borderColor: 'hsl(var(--border))',
          borderRadius: 6,
          paddingLeft: 12,
          paddingRight: 12,
          backgroundColor: 'hsl(var(--background))',
          color: 'hsl(var(--foreground))',
          fontSize: 14,
          outline: 'none',
        }}
      />
    </View>
  );
}
