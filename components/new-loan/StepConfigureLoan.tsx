import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNewLoanStore } from '@/stores/newLoanStore';
import { AutomaticLoanForm } from './AutomaticLoanForm';
import { ManualLoanForm } from './ManualLoanForm';

export function StepConfigureLoan() {
  const { loanMode, setLoanMode } = useNewLoanStore();

  return (
    <View className="flex-1">
      {/* Título */}
      <View className="px-4 pt-2 pb-3">
        <Text className="text-foreground font-bold text-xl">
          Configurar Préstamo
        </Text>
        <Text className="text-muted-foreground text-base mt-0.5">
          Define los términos y el cronograma de pagos
        </Text>
      </View>

      <Tabs
        value={loanMode}
        onValueChange={(val) => setLoanMode(val as 'automatic' | 'manual')}
        className="flex-1 px-4"
      >
        <TabsList className="mb-4">
          <TabsTrigger value="automatic" className="flex-1">
            <Text>Automático</Text>
          </TabsTrigger>
          <TabsTrigger value="manual" className="flex-1">
            <Text>Manual</Text>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="automatic" className="flex-1 pb-4">
          <AutomaticLoanForm />
        </TabsContent>

        <TabsContent value="manual" className="flex-1 pb-4">
          <ManualLoanForm />
        </TabsContent>
      </Tabs>
    </View>
  );
}
