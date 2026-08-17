import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/DatePicker';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import type { LoanFormValues } from '@/lib/schemas/loanForm';
import { type Currency } from '@/types/loan';
import { buildManualSchedule } from '@/lib/manualSchedule';
import { useNewLoanStore } from '@/stores/newLoanStore';
import { ManualInstallmentRow } from './ManualInstallmentRow';
import { Plus, CheckCircle2 } from 'lucide-react-native';

export function ManualLoanForm() {
  const {
    control,
    trigger,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<LoanFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'installments',
  });

  const { schedule, setSchedule, clearSchedule } = useNewLoanStore();

  const handleValidateManual = async () => {
    const isValid = await trigger();
    if (!isValid) return;

    const values = getValues();
    const rows = values.installments || [];
    // El número de cuotas manuales es la longitud del arreglo construido por el
    // usuario. Mantener totalInstallments sincronizado evita que el backend
    // reciba un valor desfasado respecto a las cuotas realmente enviadas.
    setValue('totalInstallments', String(rows.length), { shouldDirty: true });
    setSchedule(buildManualSchedule(rows, Number(values.capitalAmount)));
  };

  const handleInputChange = () => {
    if (schedule.length > 0) {
      clearSchedule();
    }
  };

  const watchedInstallments = watch('installments');
  const totalSum = (watchedInstallments || []).reduce((sum, item) => {
    const val = Number(item?.totalAmount) || 0;
    return sum + val;
  }, 0);

  return (
    <View className="gap-4 pb-6">
      {/* Monto Capital y Moneda */}
      <View className="flex-row gap-4">
        <View className="flex-1">
          <Label nativeID="capitalAmount" className="mb-2">
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
                value={value || ''}
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
          <Label nativeID="currency" className="mb-2">
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

      {/* N° Cuotas (derivado de las cuotas construidas) */}
      <View>
        <Label nativeID="totalInstallments" className="mb-2">
          N° Cuotas *
        </Label>
        <View className="h-12 border border-border rounded-lg bg-background items-center justify-center">
          <Text className="text-foreground font-bold text-base">
            {fields.length}
          </Text>
        </View>
      </View>

      {/* Fecha del Préstamo */}
      <View>
        <Label className="mb-2">Fecha del Préstamo *</Label>
        <Controller
          control={control}
          name="startDate"
          render={({ field: { onChange, value } }) => (
            <DatePicker
              value={value || null}
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

      {/* Arreglo de Cuotas Manuales */}
      <View className="mt-2">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-foreground font-bold text-base">
            Cuotas Personalizadas
          </Text>
          <Text className="text-muted-foreground text-sm font-bold">
            Suma: {totalSum.toFixed(2)} Bs
          </Text>
        </View>

        {fields.map((field, index) => (
          <ManualInstallmentRow
            key={field.id}
            index={index}
            control={control}
            errors={errors}
            onRemove={() => {
              remove(index);
              handleInputChange();
            }}
            canRemove={fields.length > 1}
          />
        ))}

        {errors.installments && typeof errors.installments.message === 'string' && (
          <Text className="text-destructive text-sm mb-2">
            {errors.installments.message}
          </Text>
        )}

        <Button
          variant="outline"
          onPress={() => {
            append({ dueDate: null, totalAmount: '' });
            handleInputChange();
          }}
          className="mb-4 h-12"
        >
          <Plus size={18} className="mr-2 text-primary" />
          <Text className="font-bold">Agregar Cuota</Text>
        </Button>
      </View>

      {/* Botón Validar Cronograma */}
      <Button onPress={handleValidateManual} className="h-14">
        <CheckCircle2 size={20} className="mr-2 text-primary-foreground" />
        <Text className="font-bold text-base text-primary-foreground">
          {schedule.length > 0
            ? 'Cronograma Validado'
            : 'Validar Cronograma Manual'}
        </Text>
      </Button>
    </View>
  );
}
