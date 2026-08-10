import React, { useMemo } from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Controller, useFormContext } from 'react-hook-form';
import { useNewLoanStore } from '@/stores/newLoanStore';
import { deriveSchedule } from '@/lib/loanCalculator';
import { automaticLoanSchema, type LoanFormValues } from '@/lib/schemas/loanForm';
import { SchedulePreview } from './SchedulePreview';
import { PERIOD_OPTIONS } from '@/types/loan';
import type { PeriodType } from '@/types/loan';
import { Calculator, DollarSign, Hash, Percent } from 'lucide-react-native';
import { DatePicker } from '@/components/ui/DatePicker';

export function AutomaticLoanForm() {
  const { control, watch, setValue, formState: { errors } } = useFormContext<LoanFormValues>();
  const { schedule, setSchedule, clearSchedule } = useNewLoanStore();
  const values = watch();
  const periodTypeValue = watch('periodType');

  const canCalculate = useMemo(
    () => automaticLoanSchema.safeParse({ ...values, loanMode: 'automatic' }).success,
    [values]
  );

  const handleCalculate = () => {
    if (!canCalculate) return;
    setSchedule(deriveSchedule({ ...values, loanMode: 'automatic' }));
  };

  return (
    <View className="gap-4">
      {/* Monto a prestar */}
      <View>
        <Label nativeID="capitalAmount" className="mb-2">
          Monto a Prestar (Bs) *
        </Label>
        <View className="relative">
          <View className="absolute left-3 top-0 bottom-0 justify-center z-10">
            <DollarSign size={18} className="text-muted-foreground" />
          </View>
          <Controller
            control={control}
            name="capitalAmount"
            render={({ field: { onChange, value } }) => (
              <Input
                id="capitalAmount"
                placeholder="0"
                keyboardType="numeric"
                value={value}
                onChangeText={(v) => {
                  onChange(v);
                  clearSchedule();
                }}
                className={`pl-10 ${errors.capitalAmount ? 'border-destructive' : ''}`}
              />
            )}
          />
        </View>
        {errors.capitalAmount && (
          <Text className="text-destructive text-sm mt-1">{errors.capitalAmount.message}</Text>
        )}
      </View>

      {/* Tasa de interés */}
      <View>
        <Label nativeID="interestRate" className="mb-2">
          Tasa de Interés (%) *
        </Label>
        <View className="relative">
          <View className="absolute left-3 top-0 bottom-0 justify-center z-10">
            <Percent size={18} className="text-muted-foreground" />
          </View>
          <Controller
            control={control}
            name="interestRate"
            render={({ field: { onChange, value } }) => (
              <Input
                id="interestRate"
                placeholder="0"
                keyboardType="numeric"
                value={value}
                onChangeText={(v) => {
                  onChange(v);
                  clearSchedule();
                }}
                className={`pl-10 ${errors.interestRate ? 'border-destructive' : ''}`}
              />
            )}
          />
        </View>
        {errors.interestRate && (
          <Text className="text-destructive text-sm mt-1">{errors.interestRate.message}</Text>
        )}
      </View>

      {/* Tipo de período */}
      <View>
        <Label nativeID="periodType" className="mb-2">
          Tipo de Crédito *
        </Label>
        <View className="flex-row gap-2">
          {PERIOD_OPTIONS.map((opt) => {
            const isActive = periodTypeValue === opt.value;
            return (
              <Pressable
                key={opt.value}
                onPress={() => {
                  setValue('periodType', opt.value as PeriodType, { shouldValidate: true, shouldDirty: true });
                  clearSchedule();
                }}
                className={`flex-1 py-2.5 rounded-lg items-center border ${
                  isActive ? 'bg-primary border-primary' : 'bg-card border-border'
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    isActive ? 'text-primary-foreground' : 'text-foreground'
                  }`}
                >
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Número de cuotas */}
      <View>
        <Label nativeID="totalInstallments" className="mb-2">
          Número de Cuotas *
        </Label>
        <View className="relative">
          <View className="absolute left-3 top-0 bottom-0 justify-center z-10">
            <Hash size={18} className="text-muted-foreground" />
          </View>
          <Controller
            control={control}
            name="totalInstallments"
            render={({ field: { onChange, value } }) => (
              <Input
                id="totalInstallments"
                placeholder="0"
                keyboardType="numeric"
                value={value}
                onChangeText={(v) => {
                  onChange(v);
                  clearSchedule();
                }}
                className={`pl-10 ${errors.totalInstallments ? 'border-destructive' : ''}`}
              />
            )}
          />
        </View>
        {errors.totalInstallments && (
          <Text className="text-destructive text-sm mt-1">
            {errors.totalInstallments.message}
          </Text>
        )}
      </View>

      {/* Fecha de inicio */}
      <View>
        <Label nativeID="startDate" className="mb-2">
          Fecha de Inicio *
        </Label>
        <Controller
          control={control}
          name="startDate"
          render={({ field: { onChange, value } }) => (
            <DatePicker
              value={value}
              onChange={(v) => {
                onChange(v);
                clearSchedule();
              }}
            />
          )}
        />
        {errors.startDate && (
          <Text className="text-destructive text-sm mt-1">{errors.startDate.message}</Text>
        )}
      </View>

      {/* Botón calcular cronograma */}
      <Button onPress={handleCalculate} variant="secondary" className="mt-2" disabled={!canCalculate}>
        <Calculator size={18} color="#ffffff" />
        <Text className="text-secondary-foreground font-bold text-base">
          Calcular Cronograma
        </Text>
      </Button>

      {/* Vista previa del cronograma (solo tras presionar el botón) */}
      {schedule.length > 0 && (
        <View className="mt-2">
          <SchedulePreview schedule={schedule} />
        </View>
      )}
    </View>
  );
}