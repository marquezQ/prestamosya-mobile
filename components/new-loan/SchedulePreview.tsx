import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { CalendarDays } from 'lucide-react-native';
import type { SimulatedInstallment } from '@/types/loan';
import { format, isValid, parse } from 'date-fns';
import { es } from 'date-fns/locale';

interface SchedulePreviewProps {
  schedule: SimulatedInstallment[];
}

export function SchedulePreview({ schedule }: SchedulePreviewProps) {
  if (schedule.length === 0) return null;

  const totalAmountSum = schedule.reduce(
    (sum, item) => sum + (Number(item.totalAmount) || 0),
    0,
  );
  const totalInterestSum = schedule.reduce(
    (sum, item) => sum + (Number(item.interestAmount) || 0),
    0,
  );

  return (
    <View className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-border bg-muted/50">
        <View className="flex-row items-center gap-2">
          <CalendarDays size={20} className="text-primary" />
          <Text className="text-foreground font-bold text-base">
            Cronograma de Pagos
          </Text>
        </View>
        <View className="bg-primary/10 px-2.5 py-0.5 rounded-full">
          <Text className="text-primary text-sm font-bold">
            {schedule.length} cuotas
          </Text>
        </View>
      </View>

      {/* Column Headers */}
      <View className="flex-row px-4 py-2 border-b border-border bg-muted/30">
        <Text className="text-muted-foreground text-xs font-bold uppercase tracking-wider w-8">
          #
        </Text>
        <Text className="text-muted-foreground text-xs font-bold uppercase tracking-wider flex-1">
          Fecha
        </Text>
        <Text className="text-muted-foreground text-xs font-bold uppercase tracking-wider text-right w-28">
          Monto
        </Text>
      </View>

      {/* Cuotas List */}
      <View>
        {schedule.map((item, index) => {
          const isLast = index === schedule.length - 1;
          let formattedDate = item.dueDate || 'Sin fecha';
          if (item.dueDate) {
            const parsedDate = parse(item.dueDate, 'yyyy-MM-dd', new Date());
            if (isValid(parsedDate)) {
              formattedDate = format(parsedDate, 'dd MMM yyyy', { locale: es });
            }
          }

          return (
            <View
              key={item.installmentNumber || index}
              className={`flex-row items-center px-4 py-3 ${
                !isLast ? 'border-b border-border/50' : ''
              }`}
            >
              <Text className="text-muted-foreground text-base font-medium w-8">
                {item.installmentNumber}
              </Text>
              <Text className="text-foreground text-base flex-1">
                {formattedDate}
              </Text>
              <Text className="text-foreground text-base font-bold text-right w-28">
                {Number(item.totalAmount || 0).toFixed(2)} Bs
              </Text>
            </View>
          );
        })}
      </View>

      {/* Totals */}
      <View className="border-t border-border px-4 py-4 bg-muted/30">
        <View className="flex-row justify-between mb-1">
          <Text className="text-muted-foreground text-sm">Total intereses:</Text>
          <Text className="text-muted-foreground text-sm font-bold">
            {totalInterestSum.toFixed(2)} Bs
          </Text>
        </View>
        <View className="flex-row justify-between mt-1">
          <Text className="text-foreground text-base font-bold">
            Total a pagar:
          </Text>
          <Text className="text-primary text-xl font-bold">
            {totalAmountSum.toFixed(2)} Bs
          </Text>
        </View>
      </View>
    </View>
  );
}
