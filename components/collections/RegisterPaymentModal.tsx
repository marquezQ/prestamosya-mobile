import React, { useEffect } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DatePicker } from '@/components/ui/DatePicker';
import { CheckCircle2 } from 'lucide-react-native';
import { PaymentMethod, RegisterPaymentInput } from '@/types/payment';
import { LoanInstallmentItem } from '@/types/loan';
import { getTodayISO } from '@/lib/format';
import { PaymentClientSummary } from './modal/PaymentClientSummary';
import { PendingInstallmentsSummary } from './modal/PendingInstallmentsSummary';
import { PaymentMethodSelector } from './modal/PaymentMethodSelector';

const paymentSchema = z.object({
  amount: z
    .string()
    .min(1, 'Ingresa el monto del pago')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'El monto debe ser un número mayor a 0',
    }),
  method: z.enum(['cash', 'transfer']),
  paymentDate: z.string().min(1, 'Selecciona la fecha del pago'),
  notes: z.string().optional(),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface RegisterPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  loanId: string;
  clientName: string;
  clientPhone?: string;
  installments?: LoanInstallmentItem[];
  defaultAmount?: number;
  onPaymentSuccess?: (input: RegisterPaymentInput) => void;
}

export function RegisterPaymentModal({
  isOpen,
  onClose,
  loanId,
  clientName,
  clientPhone = '',
  installments = [],
  defaultAmount = 0,
  onPaymentSuccess,
}: RegisterPaymentModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: defaultAmount > 0 ? String(defaultAmount) : '',
      method: 'cash',
      paymentDate: getTodayISO(),
      notes: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        amount: defaultAmount > 0 ? String(defaultAmount) : '',
        method: 'cash',
        paymentDate: getTodayISO(),
        notes: '',
      });
    }
  }, [isOpen, defaultAmount, reset]);

  // Fase de interfaz: simulamos la latencia del POST /payments.
  // Al conectar el backend esto se reemplaza por useRegisterPayment (React Query).
  const onSubmit = (data: PaymentFormData) => {
    const payload: RegisterPaymentInput = {
      loanId,
      amount: parseFloat(data.amount),
      method: data.method as PaymentMethod,
      paymentDate: data.paymentDate,
      notes: data.notes?.trim() || undefined,
    };

    setTimeout(() => {
      onPaymentSuccess?.(payload);
      onClose();
    }, 400);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg w-full bg-card border border-border p-5 rounded-2xl">
        <DialogHeader className="mb-1">
          <DialogTitle className="text-foreground font-bold text-xl">
            Registrar Pago
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs font-medium">
            Datos del pago entregado por el cliente
          </DialogDescription>
        </DialogHeader>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerClassName="gap-4 py-2"
        >
          <PaymentClientSummary clientName={clientName} clientPhone={clientPhone} />

          <PendingInstallmentsSummary installments={installments} />

          {/* Amount input */}
          <View>
            <Text className="text-foreground text-xs font-bold uppercase tracking-wider mb-1.5">
              Monto a Pagar (Bs.-) *
            </Text>
            <Controller
              control={control}
              name="amount"
              render={({ field: { value, onChange, onBlur } }) => (
                <Input
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="numeric"
                  placeholder="0"
                  className="bg-background text-foreground font-bold text-lg h-12"
                />
              )}
            />
            {errors.amount && (
              <Text className="text-destructive text-sm mt-1">
                {errors.amount.message}
              </Text>
            )}
          </View>

          {/* Payment method selector */}
          <Controller
            control={control}
            name="method"
            render={({ field: { value, onChange } }) => (
              <PaymentMethodSelector value={value} onChange={onChange} />
            )}
          />

          {/* Payment date picker */}
          <View>
            <Text className="text-foreground text-xs font-bold uppercase tracking-wider mb-1.5">
              Fecha de Pago *
            </Text>
            <Controller
              control={control}
              name="paymentDate"
              render={({ field: { value, onChange } }) => (
                <DatePicker value={value} onChange={onChange} />
              )}
            />
            {errors.paymentDate && (
              <Text className="text-destructive text-sm mt-1">
                {errors.paymentDate.message}
              </Text>
            )}
          </View>

          {/* Notes */}
          <View>
            <Text className="text-foreground text-xs font-bold uppercase tracking-wider mb-1.5">
              Notas / Observaciones (Opcional)
            </Text>
            <Controller
              control={control}
              name="notes"
              render={({ field: { value, onChange, onBlur } }) => (
                <Input
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Nota sobre el pago"
                  className="bg-background text-foreground text-sm h-12"
                />
              )}
            />
          </View>
        </ScrollView>

        <DialogFooter className="mt-2 flex-row gap-3">
          <Button
            variant="outline"
            onPress={onClose}
            className="flex-1 h-12 rounded-xl"
          >
            <Text className="font-bold text-foreground text-base">Cancelar</Text>
          </Button>

          <Button
            onPress={handleSubmit(onSubmit)}
            className="flex-1 h-12 rounded-xl bg-secondary active:bg-secondary/90 flex-row items-center justify-center gap-2"
          >
            <CheckCircle2 size={18} color="#ffffff" />
            <Text className="font-bold text-white text-base">Confirmar Pago</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
