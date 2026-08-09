import React from 'react';
import { Stack } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { getThemeColors } from '@/lib/theme';
import { NewLoanWizard } from '@/components/new-loan/NewLoanWizard';

export default function NewLoanScreen() {
  const { colorScheme } = useColorScheme();
  const colors = getThemeColors(colorScheme);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Nuevo Préstamo',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTitleStyle: {
            color: colors.foreground,
            fontWeight: 'bold',
          },
          headerTintColor: colors.foreground,
          headerShadowVisible: false,
        }}
      />
      <NewLoanWizard />
    </>
  );
}
