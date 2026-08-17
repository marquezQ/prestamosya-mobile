import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { useNewLoanStore } from '@/stores/newLoanStore';
import { useFormContext } from 'react-hook-form';
import type { LoanFormValues } from '@/lib/schemas/loanForm';
import { AutomaticLoanForm } from './AutomaticLoanForm';
import { ManualLoanForm } from './ManualLoanForm';

export function StepConfigureLoan() {
  const { watch, setValue, clearErrors } = useFormContext<LoanFormValues>();
  const { schedule, clearSchedule } = useNewLoanStore();
  const loanMode = watch('loanMode') || 'automatic';

  const handleModeChange = (mode: 'automatic' | 'manual') => {
    if (loanMode === mode) return;
    clearErrors();
    if (schedule.length > 0) {
      clearSchedule();
    }
    setValue('loanMode', mode, { shouldValidate: false, shouldDirty: true });
  };

  return (
    <View className="flex-1 px-4">
      {/* Encabezado */}
      <View className="pt-2 pb-3">
        <Text className="text-foreground font-bold text-xl">
          Configurar Préstamo
        </Text>
        <Text className="text-muted-foreground text-base mt-0.5">
          Define los términos y el cronograma de pagos
        </Text>
      </View>

      {/* Tabs Selector de Alto Contraste */}
      <View className="flex-row bg-muted p-1.5 rounded-xl border border-border mb-4 h-14">
        <Pressable
          onPress={() => handleModeChange('automatic')}
          className={`flex-1 items-center justify-center rounded-lg shadow-none ${
            loanMode === 'automatic' ? 'bg-primary shadow-sm' : 'bg-transparent'
          }`}
        >
          <Text
            className={`text-base font-bold ${
              loanMode === 'automatic'
                ? 'text-primary-foreground'
                : 'text-muted-foreground'
            }`}
          >
            Automático
          </Text>
        </Pressable>

        <Pressable
          onPress={() => handleModeChange('manual')}
          className={`flex-1 items-center justify-center rounded-lg shadow-none ${
            loanMode === 'manual' ? 'bg-primary shadow-sm' : 'bg-transparent'
          }`}
        >
          <Text
            className={`text-base font-bold ${
              loanMode === 'manual'
                ? 'text-primary-foreground'
                : 'text-muted-foreground'
            }`}
          >
            Manual
          </Text>
        </Pressable>
      </View>

      {/* Contenido de Modos (Montados de forma persistente para evitar desmontajes y perdida de contexto) */}
      <View className="flex-1">
        <View style={{ display: loanMode === 'automatic' ? 'flex' : 'none' }} className="flex-1">
          <AutomaticLoanForm />
        </View>
        <View style={{ display: loanMode === 'manual' ? 'flex' : 'none' }} className="flex-1">
          <ManualLoanForm />
        </View>
      </View>
    </View>
  );
}