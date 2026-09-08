import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { addMonths, format, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { palette } from '@/lib/theme/colors';

interface MonthNavigatorProps {
  year: number;
  month: number;
  onMonthChange: (year: number, month: number) => void;
}

function toDate(year: number, month: number): Date {
  return new Date(year, month - 1, 1);
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function MonthNavigator({ year, month, onMonthChange }: MonthNavigatorProps) {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const isCurrentMonth = year === currentYear && month === currentMonth;

  const label = capitalize(format(toDate(year, month), 'MMMM yyyy', { locale: es }));

  const handlePrev = () => {
    const prev = subMonths(toDate(year, month), 1);
    onMonthChange(prev.getFullYear(), prev.getMonth() + 1);
  };

  const handleNext = () => {
    if (isCurrentMonth) return;
    const next = addMonths(toDate(year, month), 1);
    onMonthChange(next.getFullYear(), next.getMonth() + 1);
  };

  return (
    <View className="flex-row items-center justify-between px-4 py-3 border-b border-border bg-background">
      <View className="flex-1">
        <Text className="font-bold text-lg text-foreground">Resumen Mensual</Text>
        <Text className="text-muted-foreground text-xs font-semibold mt-0.5">{label}</Text>
      </View>

      <View className="flex-row items-center gap-2">
        {!isCurrentMonth && (
          <Pressable
            onPress={() => onMonthChange(currentYear, currentMonth)}
            className="h-9 px-3 rounded-xl bg-secondary active:bg-secondary/80 flex-row items-center"
          >
            <Text className="text-white text-xs font-bold">Actual</Text>
          </Pressable>
        )}

        <View className="flex-row items-center gap-1">
          <Pressable
            onPress={handlePrev}
            className="w-9 h-9 rounded-xl bg-card border border-border items-center justify-center active:bg-muted"
          >
            <ChevronLeft size={18} color={palette.azul} />
          </Pressable>
          <Pressable
            onPress={handleNext}
            disabled={isCurrentMonth}
            className="w-9 h-9 rounded-xl bg-card border border-border items-center justify-center active:bg-muted opacity-90 disabled:opacity-30"
          >
            <ChevronRight size={18} color={palette.azul} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}