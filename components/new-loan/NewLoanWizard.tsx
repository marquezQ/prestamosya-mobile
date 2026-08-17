import React, { useEffect } from 'react';
import { View } from 'react-native';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useNewLoanStore } from '@/stores/newLoanStore';
import { createDefaultLoanFormValues, loanFormSchema, type LoanFormValues } from '@/lib/schemas/loanForm';
import { StepIndicator } from './StepIndicator';
import { StepSelectClient } from './StepSelectClient';
import { StepConfigureLoan } from './StepConfigureLoan';
import { StepSummary } from './StepSummary';
import { KeyboardAwareScrollView } from '@/components/ui/KeyboardAwareScrollView';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function NewLoanWizard() {
  const insets = useSafeAreaInsets();
  const { currentStep, selectedClient, schedule, reset, prevStep, nextStep } = useNewLoanStore();

  // El formulario vive a nivel del wizard para persistir entre pasos.
  const form = useForm<LoanFormValues>({
    resolver: zodResolver(loanFormSchema) as unknown as Resolver<LoanFormValues>,
    mode: 'onChange',
    defaultValues: createDefaultLoanFormValues(),
  });

  // Limpiar el store al montar el wizard
  useEffect(() => {
    reset();
  }, [reset]);

  const canGoNext = () => {
    if (currentStep === 1) return selectedClient !== null;
    // El paso 2 solo permite avanzar con un cronograma ya calculado.
    if (currentStep === 2) return schedule.length > 0;
    return false;
  };

  const handleNext = async () => {
    // Paso 1 no tiene campos que validar (la elección del cliente es por
    // FlatList); validar acá bloquearía el avance con falsos negativos.
    if (currentStep === 1) {
      nextStep();
      return;
    }
    const isValid = await form.trigger();
    if (isValid) nextStep();
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingBottom: insets.bottom }}>
      {/* Indicador de pasos superior */}
      <StepIndicator currentStep={currentStep} />

      {/* Contenido principal (Scrollable o Flex) */}
      <FormProvider {...form}>
        {currentStep === 1 ? (
          <StepSelectClient />
        ) : (
          <KeyboardAwareScrollView
            className="flex-1"
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            {currentStep === 2 && <StepConfigureLoan />}
            {currentStep === 3 && <StepSummary />}
          </KeyboardAwareScrollView>
        )}
      </FormProvider>

      {/* Barra de navegación inferior */}
      <View className="flex-row justify-between px-4 py-3 border-t border-border bg-background">
        <Button
          variant="outline"
          onPress={prevStep}
          disabled={currentStep === 1}
          className={currentStep < 3 ? "flex-1 mr-2" : "flex-1"}
        >
          <Text>Anterior</Text>
        </Button>

        {currentStep < 3 && (
          <Button
            variant="default"
            onPress={handleNext}
            disabled={!canGoNext()}
            className="flex-1 ml-2"
          >
            <Text className="text-primary-foreground font-bold">Siguiente</Text>
          </Button>
        )}
      </View>
    </View>
  );
}