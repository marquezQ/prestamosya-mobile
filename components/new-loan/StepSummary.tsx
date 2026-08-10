import React, { useState } from 'react';
import { View, ScrollView, ActivityIndicator, Alert, Platform } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { useNewLoanStore } from '@/stores/newLoanStore';
import { SchedulePreview } from './SchedulePreview';
import { PERIOD_OPTIONS } from '@/types/loan';
import { useRouter } from 'expo-router';

export function StepSummary() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    selectedClient,
    loanMode,
    capitalAmount,
    interestRate,
    periodType,
    totalInstallments,
    manualCapitalAmount,
    schedule,
    reset,
  } = useNewLoanStore();

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      // TODO: Conectar al hook useCreateLoan → POST /loans
      // Simular llamada a API por ahora
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (Platform.OS === 'web') {
        window.alert('Préstamo creado exitosamente.');
      } else {
        Alert.alert('Éxito', 'Préstamo creado exitosamente.');
      }
      
      reset();
      router.back(); // Volver a la pantalla anterior (home o clientes)
    } catch (error) {
      if (Platform.OS === 'web') {
        window.alert('Error al crear el préstamo.');
      } else {
        Alert.alert('Error', 'Hubo un problema al registrar el préstamo.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentCapital = loanMode === 'automatic' ? capitalAmount : manualCapitalAmount;
  const currentPeriodLabel = PERIOD_OPTIONS.find((p) => p.value === periodType)?.label || periodType;

  return (
    <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
      {/* Título */}
      <View className="pt-2 pb-4">
        <Text className="text-foreground font-bold text-xl">Resumen Final</Text>
        <Text className="text-muted-foreground text-base mt-0.5">
          Verifica los datos antes de confirmar el préstamo
        </Text>
      </View>

      {/* Datos del Cliente */}
      <View className="bg-card border border-border rounded-xl p-4 mb-4">
        <Text className="text-muted-foreground text-sm font-bold uppercase tracking-wider mb-2">
          Cliente Seleccionado
        </Text>
        <Text className="text-foreground font-bold text-lg">
          {selectedClient?.fullName}
        </Text>
        <Text className="text-muted-foreground text-sm mt-1">
          CI: {selectedClient?.idNumber}
        </Text>
      </View>

      {/* Datos del Préstamo */}
      <View className="bg-card border border-border rounded-xl p-4 mb-4">
        <Text className="text-muted-foreground text-sm font-bold uppercase tracking-wider mb-2">
          Detalles del Préstamo ({loanMode === 'automatic' ? 'Automático' : 'Manual'})
        </Text>
        
        <View className="flex-row flex-wrap mt-1">
          <View className="w-1/2 mb-4">
            <Text className="text-muted-foreground text-sm mb-1">Monto Capital</Text>
            <Text className="text-foreground font-bold text-base">{currentCapital} Bs</Text>
          </View>
          
          {loanMode === 'automatic' && (
            <>
              <View className="w-1/2 mb-4">
                <Text className="text-muted-foreground text-sm mb-1">Tasa de Interés</Text>
                <Text className="text-foreground font-bold text-base">{interestRate}%</Text>
              </View>
              <View className="w-1/2 mb-2">
                <Text className="text-muted-foreground text-sm mb-1">Frecuencia</Text>
                <Text className="text-foreground font-bold text-base">{currentPeriodLabel}</Text>
              </View>
              <View className="w-1/2 mb-2">
                <Text className="text-muted-foreground text-sm mb-1">Total Cuotas</Text>
                <Text className="text-foreground font-bold text-base">{totalInstallments}</Text>
              </View>
            </>
          )}
        </View>
      </View>

      {/* Cronograma */}
      <View className="mb-6">
        <SchedulePreview schedule={schedule} />
      </View>

      {/* Botón de Confirmación */}
      <Button
        onPress={handleConfirm}
        disabled={isSubmitting || schedule.length === 0}
        className="mb-8 h-14"
      >
        {isSubmitting ? (
          <ActivityIndicator color="#ffffff" className="mr-2" />
        ) : null}
        <Text className="text-primary-foreground font-bold text-lg">
          {isSubmitting ? 'Confirmando...' : 'Confirmar Préstamo'}
        </Text>
      </Button>
    </ScrollView>
  );
}
