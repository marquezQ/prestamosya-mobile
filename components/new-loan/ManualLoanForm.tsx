import React, { useMemo } from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useNewLoanStore } from '@/stores/newLoanStore';
import { ManualInstallmentRow } from './ManualInstallmentRow';
import { SchedulePreview } from './SchedulePreview';
import type { ScheduleInstallment } from '@/types/loan';
import { Plus, Calculator, DollarSign } from 'lucide-react-native';

export function ManualLoanForm() {
  const {
    manualCapitalAmount,
    manualInstallments,
    setManualCapitalAmount,
    addManualInstallment,
    removeManualInstallment,
    updateManualInstallment,
    setSchedule,
    schedule,
  } = useNewLoanStore();

  const handleUpdateInstallment = (index: number, field: 'dueDate' | 'totalAmount', value: string) => {
    updateManualInstallment(index, field, value);
  };

  const handleGeneratePreview = () => {
    // Convertir el estado manual al formato ScheduleInstallment para el preview
    // En modo manual, no calculamos intereses por cuota (o se asume 0/incluido en la cuota).
    // Para la UI, simplemente mostraremos la cuota.
    
    const newSchedule: ScheduleInstallment[] = manualInstallments.map((inst, index) => {
      const total = parseFloat(inst.totalAmount) || 0;
      return {
        number: index + 1,
        dueDate: inst.dueDate || new Date().toISOString(), // Fallback si no hay fecha válida aún
        capitalAmount: total, // Simplificación para modo manual
        interestAmount: 0,
        totalAmount: total,
      };
    });

    setSchedule(newSchedule);
  };

  // Validación básica: la suma de las cuotas debe ser >= al capital
  const { totalSum, capital } = useMemo(() => {
    const sum = manualInstallments.reduce((acc, curr) => acc + (parseFloat(curr.totalAmount) || 0), 0);
    const cap = parseFloat(manualCapitalAmount) || 0;
    return { totalSum: sum, capital: cap };
  }, [manualInstallments, manualCapitalAmount]);

  const allDatesFilled = manualInstallments.every((inst) => inst.dueDate.trim() !== '');
  const isValid = totalSum >= capital && capital > 0 && allDatesFilled;

  return (
    <View className="gap-4">
      {/* Monto a prestar */}
      <View>
        <Label nativeID="manualCapitalAmount" className="mb-2">
          Monto a Prestar (Bs) *
        </Label>
        <View className="relative">
          <View className="absolute left-3 top-0 bottom-0 justify-center z-10">
            <DollarSign size={18} className="text-muted-foreground" />
          </View>
          <Input
            id="manualCapitalAmount"
            placeholder="Ej. 1000"
            keyboardType="numeric"
            value={manualCapitalAmount}
            onChangeText={setManualCapitalAmount}
            className="pl-10"
          />
        </View>
      </View>

      {/* Lista de cuotas manuales */}
      <View>
        <View className="flex-row items-center justify-between mb-3">
          <Label className="mb-0">Cronograma Personalizado</Label>
          <Button
            variant="ghost"
            size="sm"
            onPress={addManualInstallment}
            className="h-8 px-2"
          >
            <Plus size={16} className="mr-1 text-primary" />
            <Text className="text-primary font-bold text-xs">Añadir Cuota</Text>
          </Button>
        </View>

        {manualInstallments.map((inst, index) => (
          <ManualInstallmentRow
            key={index}
            index={index}
            dueDate={inst.dueDate}
            totalAmount={inst.totalAmount}
            onDateChange={(val) => handleUpdateInstallment(index, 'dueDate', val)}
            onAmountChange={(val) => handleUpdateInstallment(index, 'totalAmount', val)}
            onRemove={() => removeManualInstallment(index)}
            canRemove={manualInstallments.length > 1}
          />
        ))}

        <View className="flex-row justify-between items-center mt-2 px-1">
          <Text className="text-xs text-muted-foreground">Suma de cuotas:</Text>
          <Text
            className={`text-sm font-bold ${
              totalSum < capital && capital > 0 ? 'text-destructive' : 'text-primary'
            }`}
          >
            {totalSum.toFixed(2)} Bs / {capital.toFixed(2)} Bs
          </Text>
        </View>
        {totalSum < capital && capital > 0 && (
          <Text className="text-[10px] text-destructive mt-1 text-right">
            La suma debe ser al menos igual al capital prestado
          </Text>
        )}
        {!allDatesFilled && capital > 0 && (
          <Text className="text-[10px] text-destructive mt-1 text-right">
            Todas las cuotas deben tener una fecha de pago
          </Text>
        )}
      </View>

      {/* Botón calcular/preview */}
      <Button
        onPress={handleGeneratePreview}
        variant="secondary"
        className="mt-2"
        disabled={!isValid}
      >
        <Calculator size={18} color="#ffffff" />
        <Text className="text-secondary-foreground font-bold text-base">
          Validar Cronograma
        </Text>
      </Button>

      {/* Preview del cronograma (usa el componente compartido) */}
      {schedule.length > 0 && (
        <View className="mt-2">
          <SchedulePreview schedule={schedule} />
        </View>
      )}
    </View>
  );
}
