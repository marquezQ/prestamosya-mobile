import React, { useState } from 'react';
import { Platform, Pressable, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Text } from '@/components/ui/text';
import { format } from 'date-fns';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  className?: string;
}

export function DatePicker({ value, onChange, className }: DatePickerProps) {
  const [show, setShow] = useState(false);
  const dateValue = value ? new Date(value) : new Date();

  const handleDateChange = (event: any, selectedDate?: Date) => {
    // En Android, ocultamos el modal inmediatamente
    if (Platform.OS !== 'ios') {
      setShow(false);
    }
    
    // event.type === 'set' ocurre al presionar OK en Android
    if (selectedDate && (Platform.OS === 'ios' || event.type === 'set')) {
      onChange(selectedDate.toISOString());
    }
  };

  const formatted = value ? format(dateValue, 'dd/MM/yyyy') : 'Fecha';

  if (Platform.OS === 'ios') {
    return (
      <View className={`h-12 justify-center border border-input rounded-md bg-background px-1 ${className || ''}`}>
        <DateTimePicker
          value={dateValue}
          mode="date"
          display="compact"
          onChange={handleDateChange}
          style={{ height: 46 }}
        />
      </View>
    );
  }

  // Android
  return (
    <View className={className}>
      <Pressable
        onPress={() => setShow(true)}
        className="h-12 border border-input bg-background rounded-md px-3 justify-center"
      >
        <Text className={value ? 'text-foreground text-base' : 'text-muted-foreground text-base'}>
          {formatted}
        </Text>
      </Pressable>
      
      {show && (
        <DateTimePicker
          value={dateValue}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </View>
  );
}
