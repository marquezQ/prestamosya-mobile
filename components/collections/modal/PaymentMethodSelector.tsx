import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { Banknote, QrCode } from 'lucide-react-native';
import { PaymentMethod } from '@/types/payment';

interface PaymentMethodSelectorProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

const PAYMENT_METHOD_UI_OPTIONS: {
  label: string;
  value: PaymentMethod;
  icon: typeof Banknote;
}[] = [
  { label: 'Efectivo', value: 'cash', icon: Banknote },
  { label: 'Transferencia / QR', value: 'transfer', icon: QrCode },
];

export function PaymentMethodSelector({
  value,
  onChange,
}: PaymentMethodSelectorProps) {
  return (
    <View>
      <Text className="text-foreground text-xs font-bold uppercase tracking-wider mb-1.5">
        Método de Pago *
      </Text>
      <View className="flex-row gap-2">
        {PAYMENT_METHOD_UI_OPTIONS.map((opt) => {
          const isSelected = value === opt.value;
          const Icon = opt.icon;
          return (
            <Pressable
              key={opt.value}
              onPress={() => onChange(opt.value)}
              className={`flex-1 flex-row items-center justify-center gap-2 h-10 px-3 rounded-xl border ${
                isSelected
                  ? 'bg-secondary border-secondary'
                  : 'bg-muted/40 border-border/70 active:bg-muted'
              }`}
            >
              <Icon size={16} color={isSelected ? '#ffffff' : '#2368A3'} />
              <Text
                className={`text-xs font-bold ${
                  isSelected ? 'text-white' : 'text-foreground'
                }`}
              >
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
