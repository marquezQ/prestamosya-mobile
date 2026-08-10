import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Check } from 'lucide-react-native';

interface StepIndicatorProps {
  currentStep: 1 | 2 | 3;
}

const STEPS = [
  { label: 'Cliente' },
  { label: 'Préstamo' },
  { label: 'Resumen' },
];

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <View className="flex-row items-center justify-center px-6 py-4">
      {STEPS.map((step, index) => {
        const stepNumber = (index + 1) as 1 | 2 | 3;
        const isCompleted = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;
        const isLast = index === STEPS.length - 1;

        return (
          <React.Fragment key={stepNumber}>
            {/* Círculo + Label */}
            <View className="items-center">
              <View
                className={`w-9 h-9 rounded-full items-center justify-center ${
                  isCompleted
                    ? 'bg-accent'
                    : isActive
                      ? 'bg-primary'
                      : 'bg-muted'
                }`}
              >
                {isCompleted ? (
                  <Check size={18} color="#ffffff" />
                ) : (
                  <Text
                    className={`text-sm font-bold ${
                      isActive ? 'text-primary-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {stepNumber}
                  </Text>
                )}
              </View>
              <Text
                className={`text-xs mt-1.5 font-medium ${
                  isActive || isCompleted ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {step.label}
              </Text>
            </View>

            {/* Línea conectora */}
            {!isLast && (
              <View
                className={`flex-1 h-[2px] mx-2 mb-5 rounded-full ${
                  isCompleted ? 'bg-accent' : 'bg-muted'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}
