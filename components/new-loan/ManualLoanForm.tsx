import React, { useMemo } from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { useNewLoanStore } from '@/stores/newLoanStore';
import { deriveSchedule } from '@/lib/loanCalculator';
import { manualLoanSchema, type LoanFormValues } from '@/lib/schemas/loanForm';
import { SchedulePreview } from './SchedulePreview';
import { DatePicker } from '@/components/ui/DatePicker';
import { Calculator, Plus, Trash2, Wallet } from 'lucide-react-native';

export function ManualLoanForm() {
  const { control, watch, formState: { errors } } = useFormContext<LoanFormValues>();
  const { schedule, setSchedule, clearSchedule } = useNewLoanStore();
  const { fields, append, remove } = useFieldArray({ control, name: 'installments' });

  const values = watch();

  const capital = Number(values.manualCapitalAmount) || 0;
  const sum = (values.installments ?? []).reduce(
    (acc, row) => acc + (Number(row.totalAmount) || 0),
    0
  );
  const sumError = errors.installments?.root?.message;

  const canValidate = useMemo(
    () =>
      manualLoanSchema.safeParse({
        loanMode: 'manual',
        manualCapitalAmount: values.manualCapitalAmount,
        installments: values.installments ?? [],
      }).success,
    [values]
  );

  const handleValidate = () => {
    if (!canValidate) return;
    setSchedule(
      deriveSchedule({
        loanMode: 'manual',
        manualInstallments: values.installments ?? [],
      })
    );
  };

  return (
    <View className="gap-4">
      {/* Monto a prestar */}
      <View>
        <Label nativeID="manualCapitalAmount" className="mb-2">
          Monto a Prestar (Bs) *
        </Label>
        <View className="relative">
          <View className="absolute left-3 top-0 bottom-0 justify-center z-10">
            <Wallet size={18} className="text-muted-foreground" />
          </View>
          <Controller
            control={control}
            name="manualCapitalAmount"
            render={({ field: { onChange, value } }) => (
              <Input
                id="manualCapitalAmount"
                placeholder="0"
                keyboardType="numeric"
                value={value}
                onChangeText={(v) => {
                  onChange(v);
                  clearSchedule();
                }}
                className={`pl-10 ${errors.manualCapitalAmount ? 'border-destructive' : ''}`}
              />
            )}
          />
        </View>
        {errors.manualCapitalAmount && (
          <Text className="text-destructive text-sm mt-1">
            {errors.manualCapitalAmount.message}
          </Text>
        )}
      </View>

      {/* Lista de cuotas manuales */}
      <View>
        <View className="flex-row items-center justify-between mb-3">
          <Label className="mb-0">Cronograma Personalizado</Label>
          <Button
            variant="ghost"
            size="sm"
            onPress={() => {
              append({ dueDate: null, totalAmount: '' });
              clearSchedule();
            }}
            className="h-8 px-2"
          >
            <Plus size={16} className="mr-1 text-primary" />
            <Text className="text-primary font-bold text-sm">Añadir Cuota</Text>
          </Button>
        </View>

        {fields.map((field, index) => (
          <View key={field.id}>
            <View className="flex-row items-center gap-2 mb-3">
              {/* Número de cuota */}
              <View className="w-8 h-12 items-center justify-center bg-muted rounded-md">
                <Text className="text-muted-foreground text-xs font-bold">{index + 1}</Text>
              </View>

              {/* Fecha de pago */}
              <Controller
                control={control}
                name={`installments.${index}.dueDate`}
                render={({ field: { onChange, value } }) => (
                  <DatePicker
                    value={value}
                    onChange={(v) => {
                      onChange(v);
                      clearSchedule();
                    }}
                    className="flex-1"
                  />
                )}
              />

              {/* Monto */}
              <Controller
                control={control}
                name={`installments.${index}.totalAmount`}
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder="0"
                    value={value}
                    onChangeText={(v) => {
                      onChange(v);
                      clearSchedule();
                    }}
                    keyboardType="numeric"
                    className={`w-28 ${
                      errors.installments?.[index]?.totalAmount ? 'border-destructive' : ''
                    }`}
                  />
                )}
              />

              {/* Botón eliminar */}
              <Button
                variant="ghost"
                onPress={() => {
                  remove(index);
                  clearSchedule();
                }}
                disabled={fields.length <= 1}
                className="w-9 h-9 p-0"
                aria-label={`Eliminar cuota ${index + 1}`}
              >
                <Trash2 size={16} className="text-destructive" />
              </Button>
            </View>

            {(errors.installments?.[index]?.dueDate ||
              errors.installments?.[index]?.totalAmount) && (
              <View className="-mt-2 mb-3">
                {errors.installments?.[index]?.dueDate && (
                  <Text className="text-destructive text-sm mt-1">
                    {errors.installments?.[index]?.dueDate?.message}
                  </Text>
                )}
                {errors.installments?.[index]?.totalAmount && (
                  <Text className="text-destructive text-sm mt-1">
                    {errors.installments?.[index]?.totalAmount?.message}
                  </Text>
                )}
              </View>
            )}
          </View>
        ))}

        {/* Suma de cuotas vs capital */}
        <View className="flex-row justify-between items-center mt-1 px-1">
          <Text className="text-sm text-muted-foreground">Suma de cuotas:</Text>
          <Text
            className={`text-sm font-bold ${sum >= capital && capital > 0 ? 'text-primary' : 'text-destructive'}`}
          >
            {sum.toFixed(2)} Bs / {capital.toFixed(2)} Bs
          </Text>
        </View>
        {sumError && (
          <Text className="text-destructive text-sm mt-1 text-right">{sumError}</Text>
        )}
      </View>

      {/* Botón validar/calcular cronograma */}
      <Button onPress={handleValidate} variant="secondary" className="mt-2" disabled={!canValidate}>
        <Calculator size={18} color="#ffffff" />
        <Text className="text-secondary-foreground font-bold text-base">
          Validar Cronograma
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