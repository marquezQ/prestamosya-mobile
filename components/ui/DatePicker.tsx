import React, { useState } from 'react';
import { Platform, Pressable, View } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Text } from '@/components/ui/text';
import { format, isValid, parse } from 'date-fns';

interface DatePickerProps {
  value: string | null;
  onChange: (date: string) => void;
  className?: string;
}

/**
 * Selector de fecha de calendario.
 *
 * Contrato: el valor emitido/recibido es SIEMPRE una fecha de calendario
 * 'yyyy-MM-dd' (sin hora ni zona horaria). Evita el corrimiento de un día
 * que ocurría al guardar instantes UTC. El backend interpreta la fecha en
 * America/La_Paz (Bolivia).
 */
export function DatePicker({ value, onChange, className }: DatePickerProps) {
  const [show, setShow] = useState(false);

  let parsed = new Date();
  if (value) {
    const d = parse(value, 'yyyy-MM-dd', new Date());
    if (isValid(d)) {
      parsed = d;
    }
  }

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    // En Android, ocultamos el modal inmediatamente
    if (Platform.OS !== 'ios') {
      setShow(false);
    }

    // event.type === 'set' ocurre al presionar OK en Android
    if (selectedDate && (Platform.OS === 'ios' || event.type === 'set')) {
      onChange(format(selectedDate, 'yyyy-MM-dd'));
    }
  };

  const displayValue = value && isValid(parse(value, 'yyyy-MM-dd', new Date()))
    ? format(parse(value, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy')
    : '';

  if (Platform.OS === 'ios') {
    return (
      <View className={`h-12 justify-center border border-input rounded-md bg-background px-1 ${className || ''}`}>
        <DateTimePicker
          value={parsed}
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
          {displayValue || 'Fecha'}
        </Text>
      </Pressable>

      {show && (
        <DateTimePicker
          value={parsed}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </View>
  );
}