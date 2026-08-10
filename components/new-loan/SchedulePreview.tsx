import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import type { ScheduleInstallment } from '@/types/loan';
import { CalendarDays } from 'lucide-react-native';

interface SchedulePreviewProps {
  schedule: ScheduleInstallment[];
}

export function SchedulePreview({ schedule }: SchedulePreviewProps) {
  if (schedule.length === 0) return null;

  const totalAmount = schedule.reduce((sum, item) => sum + item.totalAmount, 0);
  const totalInterest = schedule.reduce((sum, item) => sum + item.interestAmount, 0);

  return (
    <View className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-border bg-muted/50">
        <View className="flex-row items-center gap-2">
          <CalendarDays size={20} className="text-primary" />
          <Text className="text-foreground font-bold text-base">Cronograma de Pagos</Text>
        </View>
        <View className="bg-primary/10 px-2.5 py-0.5 rounded-full">
          <Text className="text-primary text-sm font-bold">{schedule.length} cuotas</Text>
        </View>
      </View>

      {/* Encabezado de columnas */}
      <View className="flex-row px-4 py-2 border-b border-border bg-muted/30">
        <Text className="text-muted-foreground text-xs font-bold uppercase tracking-wider w-10">#</Text>
        <Text className="text-muted-foreground text-xs font-bold uppercase tracking-wider flex-1">Fecha</Text>
        <Text className="text-muted-foreground text-xs font-bold uppercase tracking-wider text-right w-24">Monto</Text>
      </View>

      {/* Lista de cuotas */}
      <View>
        {schedule.map((item, index) => {
          const isLast = index === schedule.length - 1;
          let formattedDate: string;
          try {
            formattedDate = format(parseISO(item.dueDate), 'dd MMM yyyy', { locale: es });
          } catch {
            formattedDate = item.dueDate;
          }

          return (
            <View
              key={item.number}
              className={`flex-row items-center px-4 py-3 ${!isLast ? 'border-b border-border/50' : ''}`}
            >
              <Text className="text-muted-foreground text-base font-medium w-10">{item.number}</Text>
              <Text className="text-foreground text-base flex-1">{formattedDate}</Text>
              <Text className="text-foreground text-base font-bold text-right w-24">
                {item.totalAmount.toFixed(2)} Bs
              </Text>
            </View>
          );
        })}
      </View>

      {/* Totales */}
      <View className="border-t border-border px-4 py-4 bg-muted/30">
        <View className="flex-row justify-between mb-1">
          <Text className="text-muted-foreground text-sm">Total intereses:</Text>
          <Text className="text-muted-foreground text-sm font-bold">{totalInterest.toFixed(2)} Bs</Text>
        </View>
        <View className="flex-row justify-between mt-1">
          <Text className="text-foreground text-base font-bold">Total a pagar:</Text>
          <Text className="text-primary text-xl font-bold">{totalAmount.toFixed(2)} Bs</Text>
        </View>
      </View>
    </View>
  );
}
