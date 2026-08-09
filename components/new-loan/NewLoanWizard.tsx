import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useNewLoanStore } from '@/stores/newLoanStore';
import { StepIndicator } from './StepIndicator';
import { StepSelectClient } from './StepSelectClient';
import { StepConfigureLoan } from './StepConfigureLoan';
import { StepSummary } from './StepSummary';
import { KeyboardAwareScrollView } from '@/components/ui/KeyboardAwareScrollView';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function NewLoanWizard() {
  const insets = useSafeAreaInsets();
  const { currentStep, reset, selectedClient, schedule, prevStep, nextStep } = useNewLoanStore();

  // Limpiar el store al montar el wizard
  useEffect(() => {
    reset();
  }, [reset]);

  const canGoNext = () => {
    if (currentStep === 1) return selectedClient !== null;
    if (currentStep === 2) return schedule.length > 0;
    return false;
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingBottom: insets.bottom }}>
      {/* Indicador de pasos superior */}
      <StepIndicator currentStep={currentStep} />

      {/* Contenido principal (Scrollable o Flex) */}
      {currentStep === 1 ? (
        <View className="flex-1">
          <StepSelectClient />
        </View>
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
            onPress={nextStep}
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
