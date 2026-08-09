import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useNewLoanStore } from '@/stores/newLoanStore';
import { calculateAutomaticSchedule } from '@/lib/loanCalculator';
import { SchedulePreview } from './SchedulePreview';
import { PERIOD_OPTIONS } from '@/types/loan';
import type { PeriodType } from '@/types/loan';
import { Calculator, Percent, DollarSign, Hash } from 'lucide-react-native';
import { Pressable } from 'react-native';

export function AutomaticLoanForm() {
  const {
    capitalAmount,
    interestRate,
    periodType,
    totalInstallments,
    schedule,
    setAutoField,
    setPeriodType,
    setSchedule,
  } = useNewLoanStore();

  const handleCalculate = () => {
    const capital = parseFloat(capitalAmount);
    const rate = parseFloat(interestRate);
    const installments = parseInt(totalInstallments, 10);

    if (isNaN(capital) || capital <= 0) return;
    if (isNaN(rate) || rate < 0) return;
    if (isNaN(installments) || installments < 1) return;

    // TODO: reemplazar con llamada al hook usePreviewSchedule → GET /loans/preview-schedule
    const result = calculateAutomaticSchedule({
      capitalAmount: capital,
      interestRate: rate,
      periodType,
      totalInstallments: installments,
      startDate: new Date(),
    });

    setSchedule(result);
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
          <Input
            id="capitalAmount"
            placeholder="Ej. 1000"
            keyboardType="numeric"
            value={capitalAmount}
            onChangeText={(v) => setAutoField('capitalAmount', v)}
            className="pl-10"
          />
        </View>
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
          <Input
            id="interestRate"
            placeholder="Ej. 10"
            keyboardType="numeric"
            value={interestRate}
            onChangeText={(v) => setAutoField('interestRate', v)}
            className="pl-10"
          />
        </View>
      </View>

      {/* Tipo de período */}
      <View>
        <Label nativeID="periodType" className="mb-2">
          Tipo de Crédito *
        </Label>
        <View className="flex-row gap-2">
          {PERIOD_OPTIONS.map((opt) => (
            <Pressable
              key={opt.value}
              onPress={() => setPeriodType(opt.value as PeriodType)}
              className={`flex-1 py-2.5 rounded-lg items-center border ${
                periodType === opt.value
                  ? 'bg-primary border-primary'
                  : 'bg-card border-border'
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  periodType === opt.value
                    ? 'text-primary-foreground'
                    : 'text-foreground'
                }`}
              >
                {opt.label}
              </Text>
            </Pressable>
          ))}
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
          <Input
            id="totalInstallments"
            placeholder="Ej. 12"
            keyboardType="numeric"
            value={totalInstallments}
            onChangeText={(v) => setAutoField('totalInstallments', v)}
            className="pl-10"
          />
        </View>
      </View>

      {/* Botón calcular */}
      <Button onPress={handleCalculate} variant="secondary" className="mt-2">
        <Calculator size={18} color="#ffffff" />
        <Text className="text-secondary-foreground font-bold text-base">
          Calcular Cronograma
        </Text>
      </Button>

      {/* Preview del cronograma */}
      {schedule.length > 0 && (
        <View className="mt-2">
          <SchedulePreview schedule={schedule} />
        </View>
      )}
    </View>
  );
}
