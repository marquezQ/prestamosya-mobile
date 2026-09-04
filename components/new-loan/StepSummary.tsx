import React from 'react';
import { View, ActivityIndicator, Alert, Platform } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { useNewLoanStore } from '@/stores/newLoanStore';
import { useFormContext } from 'react-hook-form';
import { SchedulePreview } from './SchedulePreview';
import { PERIOD_OPTIONS } from '@/types/loan';
import type {
  CreateAutomaticLoanInput,
  CreateManualLoanInput,
} from '@/types/loan';
import type { LoanFormValues } from '@/lib/schemas/loanForm';
import { buildManualInstallmentsInput } from '@/lib/manualSchedule';
import { useRouter } from 'expo-router';
import { format, isValid, parse } from 'date-fns';
import { useCreateLoan } from '@/hooks/useCreateLoan';
import { getApiErrorMessage } from '@/services/api';

export function StepSummary() {
  const router = useRouter();
  const { selectedClient, schedule, reset } = useNewLoanStore();
  const { watch } = useFormContext<LoanFormValues>();
  const values = watch();
  const loanMode = values.loanMode || 'automatic';

  const { mutate: createLoan, isPending: isSubmitting } = useCreateLoan();

  const buildCreateInput = ():
    | CreateAutomaticLoanInput
    | CreateManualLoanInput
    | null => {
    if (!selectedClient || !values.startDate) {
      return null;
    }

    const baseParams = {
      clientId: selectedClient.id,
      capitalAmount: Number(values.capitalAmount),
      currency: values.currency,
      interestRate: Number(values.interestRate) || 0,
      periodType: values.periodType || 'monthly',
      startDate: values.startDate,
    };

    if (loanMode === 'manual') {
      const manualInstallments = buildManualInstallmentsInput(
        values.installments || [],
        Number(values.capitalAmount),
      );
      if (manualInstallments.length === 0) {
        return null;
      }
      return {
        ...baseParams,
        mode: 'manual',
        // El backend valida que totalInstallments coincida con el arreglo de
        // cuotas; siempre se deriva de la cantidad real de cuotas enviadas.
        totalInstallments: manualInstallments.length,
        manualInstallments,
      };
    }

    return {
      ...baseParams,
      mode: 'automatic',
      totalInstallments: schedule.length || Number(values.totalInstallments),
      scheduleType: values.scheduleType || 'EQUAL_INSTALLMENTS',
    };
  };

  const handleConfirm = () => {
    const payload = buildCreateInput();
    if (!payload) {
      const msg = 'Faltan datos obligatorios para registrar el préstamo.';
      if (Platform.OS === 'web') window.alert(msg);
      else Alert.alert('Error', msg);
      return;
    }

    createLoan(payload, {
      onSuccess: () => {
        const successMsg = 'Préstamo creado exitosamente.';
        if (Platform.OS === 'web') {
          window.alert(successMsg);
        } else {
          Alert.alert('Éxito', successMsg);
        }
        reset();
        router.back();
      },
      onError: (err: unknown) => {
        const errorMsg = getApiErrorMessage(err, 'Hubo un problema al registrar el préstamo.');
        if (Platform.OS === 'web') {
          window.alert(errorMsg);
        } else {
          Alert.alert('Error al Crear Préstamo', errorMsg);
        }
      },
    });
  };

  const currentPeriodLabel =
    PERIOD_OPTIONS.find((p) => p.value === values.periodType)?.label ||
    values.periodType;

  return (
    <View className="flex-1 px-4">
      {/* Encabezado */}
      <View className="pt-2 pb-4">
        <Text className="text-foreground font-bold text-xl">Resumen Final</Text>
        <Text className="text-muted-foreground text-base mt-0.5">
          Verifica los datos antes de registrar el préstamo
        </Text>
      </View>

      {/* Insignia de Modo Solicitado */}
      <View className="mb-4 flex-row items-center justify-between bg-primary/10 border border-primary/20 rounded-xl px-4 py-3">
        <Text className="text-foreground font-bold text-sm">
          Cronograma calculado:
        </Text>
        <View className="bg-primary px-3 py-1 rounded-full">
          <Text className="text-primary-foreground text-xs font-bold uppercase">
            {loanMode === 'manual' ? 'Manual' : 'Automático'}
          </Text>
        </View>
      </View>

      {/* Cliente Seleccionado */}
      <View className="bg-card border border-border rounded-xl p-4 mb-4">
        <Text className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-2">
          Cliente Seleccionado
        </Text>
        <Text className="text-foreground font-bold text-lg">
          {selectedClient?.fullName}
        </Text>
        <Text className="text-muted-foreground text-sm mt-0.5">
          CI: {selectedClient?.idNumber}
        </Text>
      </View>

      {/* Términos del Préstamo */}
      <View className="bg-card border border-border rounded-xl p-4 mb-4">
        <Text className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-3">
          Términos del Préstamo
        </Text>

        <View className="flex-row flex-wrap">
          <View className="w-1/2 mb-3">
            <Text className="text-muted-foreground text-xs mb-0.5">
              Monto Capital
            </Text>
            <Text className="text-foreground font-bold text-base">
              {values.capitalAmount} {values.currency}
            </Text>
          </View>

          {loanMode === 'automatic' && (
            <View className="w-1/2 mb-3">
              <Text className="text-muted-foreground text-xs mb-0.5">
                Tasa de Interés
              </Text>
              <Text className="text-foreground font-bold text-base">
                {values.interestRate}%
              </Text>
            </View>
          )}

          {loanMode === 'automatic' && (
            <View className="w-1/2 mb-3">
              <Text className="text-muted-foreground text-xs mb-0.5">Frecuencia</Text>
              <Text className="text-foreground font-bold text-base">
                {currentPeriodLabel}
              </Text>
            </View>
          )}

          <View className="w-1/2 mb-3">
            <Text className="text-muted-foreground text-xs mb-0.5">Total Cuotas</Text>
            <Text className="text-foreground font-bold text-base">
              {schedule.length > 0 ? schedule.length : values.totalInstallments}
            </Text>
          </View>

          {loanMode === 'automatic' && (
            <View className="w-full mb-3">
              <Text className="text-muted-foreground text-xs mb-0.5">
                Modalidad de Cobro
              </Text>
              <Text className="text-foreground font-bold text-base">
                {values.scheduleType === 'INTEREST_ONLY'
                  ? 'Solo Interés (Capital al final)'
                  : 'Cuotas Iguales (Capital + Interés)'}
              </Text>
            </View>
          )}

          <View className="w-full mb-1">
            <Text className="text-muted-foreground text-xs mb-0.5">
              Fecha del Préstamo
            </Text>
            <Text className="text-foreground font-bold text-base">
              {formatSummaryDate(values.startDate)}
            </Text>
          </View>
        </View>
      </View>

      {/* Cronograma */}
      <View className="mb-6">
        <SchedulePreview schedule={schedule} currency={values.currency} />
      </View>

      {/* Botón de Confirmar */}
      <Button
        onPress={handleConfirm}
        disabled={isSubmitting || schedule.length === 0}
        className="mb-8 h-14"
      >
        {isSubmitting ? (
          <ActivityIndicator color="#ffffff" className="mr-2" />
        ) : null}
        <Text className="text-primary-foreground font-bold text-lg">
          {isSubmitting ? 'Registrando Préstamo...' : 'Confirmar y Registrar'}
        </Text>
      </Button>
    </View>
  );
}

function formatSummaryDate(value: string | null): string {
  if (!value) return 'Sin fecha';
  const parsed = parse(value, 'yyyy-MM-dd', new Date());
  if (!isValid(parsed)) return value;
  return format(parsed, 'dd/MM/yyyy');
}