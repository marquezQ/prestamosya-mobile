import React from 'react';
import { View, ActivityIndicator, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/DatePicker';
import { useFormContext, Controller } from 'react-hook-form';
import type { LoanFormValues } from '@/lib/schemas/loanForm';
import { PERIOD_OPTIONS, type Currency, type LoanScheduleType } from '@/types/loan';
import { useNewLoanStore } from '@/stores/newLoanStore';
import { useSimulateLoan } from '@/hooks/useSimulateLoan';
import { SchedulePreview } from './SchedulePreview';
import { Calculator } from 'lucide-react-native';

const SCHEDULE_TYPE_OPTIONS: {
  label: string;
  value: LoanScheduleType;
}[] = [
  { label: 'Cuotas iguales', value: 'EQUAL_INSTALLMENTS' },
  { label: 'Solo interés', value: 'INTEREST_ONLY' },
];

export function AutomaticLoanForm() {
  const {
    control,
    trigger,
    getValues,
    formState: { errors },
  } = useFormContext<LoanFormValues>();

  const { schedule, setSchedule, clearSchedule } = useNewLoanStore();
  const { mutate: simulateLoan, isPending: isSimulating } = useSimulateLoan();

  const handleSimulate = async () => {
    const isValid = await trigger([
      'capitalAmount',
      'currency',
      'interestRate',
      'periodType',
      'totalInstallments',
      'startDate',
    ]);

    if (!isValid) return;

    const values = getValues();
    simulateLoan(
      {
        capitalAmount: Number(values.capitalAmount),
        currency: values.currency,
        interestRate: Number(values.interestRate),
        periodType: values.periodType || 'monthly',
        totalInstallments: Number(values.totalInstallments),
        startDate: values.startDate!,
        scheduleType: values.scheduleType || 'EQUAL_INSTALLMENTS',
      },
      {
        onSuccess: (res) => {
          setSchedule(res.data.installments);
        },
      },
    );
  };

  const handleInputChange = () => {
    if (schedule.length > 0) {
      clearSchedule();
    }
  };

  return (
    <View className="gap-3 pb-4">
      {/* Monto Capital y Moneda */}
      <View className="flex-row gap-3">
        <View className="flex-1">
          <Label nativeID="capitalAmount" className="mb-1.5">
            Monto Capital *
          </Label>
          <Controller
            control={control}
            name="capitalAmount"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                id="capitalAmount"
                placeholder="0.00"
                keyboardType="numeric"
                onBlur={onBlur}
                onChangeText={(val) => {
                  onChange(val);
                  handleInputChange();
                }}
                value={value}
                className={errors.capitalAmount ? 'border-destructive' : ''}
              />
            )}
          />
          {errors.capitalAmount && (
            <Text className="text-destructive text-sm mt-1">
              {errors.capitalAmount.message}
            </Text>
          )}
        </View>

        <View className="w-32">
          <Label nativeID="currency" className="mb-1.5">
            Moneda *
          </Label>
          <Controller
            control={control}
            name="currency"
            render={({ field: { onChange, value } }) => (
              <View className="flex-row border border-border rounded-lg overflow-hidden h-12">
                {(['BOB', 'USD'] as Currency[]).map((curr) => (
                  <Pressable
                    key={curr}
                    onPress={() => {
                      onChange(curr);
                      handleInputChange();
                    }}
                    className={`flex-1 items-center justify-center ${
                      value === curr ? 'bg-primary' : 'bg-background'
                    }`}
                  >
                    <Text
                      className={`font-bold text-sm ${
                        value === curr
                          ? 'text-primary-foreground'
                          : 'text-foreground'
                      }`}
                    >
                      {curr}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          />
        </View>
      </View>

      {/* Tasa y Cuotas */}
      <View className="flex-row gap-3">
        <View className="flex-1">
          <Label nativeID="interestRate" className="mb-1.5">
            Tasa (%) *
          </Label>
          <Controller
            control={control}
            name="interestRate"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                id="interestRate"
                placeholder="0"
                keyboardType="numeric"
                onBlur={onBlur}
                onChangeText={(val) => {
                  onChange(val);
                  handleInputChange();
                }}
                value={value ?? ''}
                className={errors.interestRate ? 'border-destructive' : ''}
              />
            )}
          />
          {errors.interestRate && (
            <Text className="text-destructive text-sm mt-1">
              {errors.interestRate.message}
            </Text>
          )}
        </View>

        <View className="flex-1">
          <Label nativeID="totalInstallments" className="mb-1.5">
            N° Cuotas *
          </Label>
          <Controller
            control={control}
            name="totalInstallments"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                id="totalInstallments"
                placeholder="0"
                keyboardType="numeric"
                onBlur={onBlur}
                onChangeText={(val) => {
                  onChange(val);
                  handleInputChange();
                }}
                value={value}
                className={errors.totalInstallments ? 'border-destructive' : ''}
              />
            )}
          />
          {errors.totalInstallments && (
            <Text className="text-destructive text-sm mt-1">
              {errors.totalInstallments.message}
            </Text>
          )}
        </View>
      </View>

      {/* Modalidad de Cobro (scheduleType) */}
      <View>
        <Label className="mb-1.5">Modalidad de Cobro *</Label>
        <Controller
          control={control}
          name="scheduleType"
          render={({ field: { onChange, value = 'EQUAL_INSTALLMENTS' } }) => (
            <View className="flex-row border border-border rounded-lg overflow-hidden h-12 bg-background">
              {SCHEDULE_TYPE_OPTIONS.map((opt) => (
                <Pressable
                  key={opt.value}
                  onPress={() => {
                    onChange(opt.value);
                    handleInputChange();
                  }}
                  className={`flex-1 items-center justify-center border-r border-border last:border-r-0 ${
                    value === opt.value ? 'bg-primary' : 'bg-background'
                  }`}
                >
                  <Text
                    className={`text-xs font-bold ${
                      value === opt.value
                        ? 'text-primary-foreground'
                        : 'text-foreground'
                    }`}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        />
      </View>

      {/* Frecuencia de Cobro */}
      <View>
        <Label className="mb-1.5">Frecuencia de Cobro *</Label>
        <Controller
          control={control}
          name="periodType"
          render={({ field: { onChange, value } }) => (
            <View className="flex-row border border-border rounded-lg overflow-hidden h-12 bg-background">
              {PERIOD_OPTIONS.map((opt) => (
                <Pressable
                  key={opt.value}
                  onPress={() => {
                    onChange(opt.value);
                    handleInputChange();
                  }}
                  className={`flex-1 items-center justify-center border-r border-border last:border-r-0 ${
                    value === opt.value ? 'bg-primary' : 'bg-background'
                  }`}
                >
                  <Text
                    className={`text-xs font-bold ${
                      value === opt.value
                        ? 'text-primary-foreground'
                        : 'text-foreground'
                    }`}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        />
      </View>

      {/* Selector de Fecha Único */}
      <View>
        <Label className="mb-1.5">Fecha del Préstamo *</Label>
        <Controller
          control={control}
          name="startDate"
          render={({ field: { onChange, value } }) => (
            <DatePicker
              value={value}
              onChange={(d) => {
                onChange(d);
                handleInputChange();
              }}
            />
          )}
        />
        {errors.startDate && (
          <Text className="text-destructive text-sm mt-1">
            {errors.startDate.message}
          </Text>
        )}
      </View>

      {/* Botón de Simulación */}
      <Button
        onPress={handleSimulate}
        disabled={isSimulating}
        className="mt-2 h-14"
        variant={schedule.length > 0 ? 'outline' : 'default'}
      >
        {isSimulating ? (
          <ActivityIndicator color="#ffffff" className="mr-2" />
        ) : (
          <Calculator size={20} className="mr-2 text-primary-foreground" />
        )}
        <Text className="font-bold text-base">
          {isSimulating
            ? 'Simulando...'
            : schedule.length > 0
            ? 'Volver a Simular'
            : 'Simular Cronograma'}
        </Text>
      </Button>

      {/* Cronograma Proyectado */}
      {schedule.length > 0 && (
        <View className="mt-4">
          <SchedulePreview schedule={schedule} />
        </View>
      )}
    </View>
  );
}
