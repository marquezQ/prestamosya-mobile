import React, { useEffect } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DatePicker } from '@/components/ui/DatePicker';
import { CheckCircle2, AlertCircle, Banknote, QrCode } from 'lucide-react-native';
import { PaymentMethod, RegisterPaymentInput, RegisterPaymentResponseData } from '@/types/payment';
import { LoanInstallmentItem, Currency } from '@/types/loan';
import { getTodayISO } from '@/lib/format';
import { getApiErrorMessage } from '@/services/api';
import { useRegisterPayment } from '@/hooks/useRegisterPayment';
import { PaymentClientSummary } from './modal/PaymentClientSummary';
import { PendingInstallmentsSummary } from './modal/PendingInstallmentsSummary';

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
  currency?: Currency;
  onPaymentSuccess?: (result: RegisterPaymentResponseData) => void;
}

export function RegisterPaymentModal({
  isOpen,
  onClose,
  loanId,
  clientName,
  clientPhone = '',
  installments = [],
  defaultAmount = 0,
  currency = 'BOB',
  onPaymentSuccess,
}: RegisterPaymentModalProps) {
  const registerPayment = useRegisterPayment();

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
      registerPayment.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, defaultAmount, reset]);

  const onSubmit = (data: PaymentFormData) => {
    const payload: RegisterPaymentInput = {
      loanId,
      amount: parseFloat(data.amount),
      method: data.method as PaymentMethod,
      paymentDate: data.paymentDate,
      notes: data.notes?.trim() || undefined,
    };

    registerPayment.mutate(payload, {
      onSuccess: (result) => {
        onPaymentSuccess?.(result);
        onClose();
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg w-full bg-card border border-border p-4 sm:p-5 rounded-2xl">
        {/* Header simple y directo */}
        <DialogHeader className="mb-0.5">
          <DialogTitle className="text-foreground font-bold text-lg">
            Registrar Pago
          </DialogTitle>
        </DialogHeader>

        <View className="gap-3 py-1">
          {/* Ficha resumida del cliente */}
          <PaymentClientSummary clientName={clientName} clientPhone={clientPhone} />

          {/* Cuotas pendientes referenciales */}
          <PendingInstallmentsSummary installments={installments} currency={currency} />

          {/* Campo de Monto */}
          <View>
            <Text className="text-foreground text-xs font-bold uppercase tracking-wider mb-1.5">
              Monto a Pagar ({currency === 'USD' ? '$us' : 'Bs.-'}) *
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
                  className="bg-background text-foreground font-bold text-lg h-12 rounded-xl"
                />
              )}
            />
            {errors.amount && (
              <Text className="text-destructive text-sm mt-1">
                {errors.amount.message}
              </Text>
            )}
          </View>

          {/* Fila única de 3 columnas: Efectivo | Transferencia/QR | Fecha de Pago */}
          <View>
            <Text className="text-foreground text-xs font-bold uppercase tracking-wider mb-1.5">
              Método y Fecha de Pago *
            </Text>
            <View className="flex-row gap-2 items-center">
              {/* Método de pago en 2 columnas */}
              <Controller
                control={control}
                name="method"
                render={({ field: { value, onChange } }) => (
                  <>
                    <Pressable
                      onPress={() => onChange('cash')}
                      className={`flex-1 flex-row items-center justify-center gap-1.5 h-12 px-2 rounded-xl border ${
                        value === 'cash'
                          ? 'bg-secondary border-secondary'
                          : 'bg-muted/40 border-border/70 active:bg-muted'
                      }`}
                    >
                      <Banknote size={16} color={value === 'cash' ? '#ffffff' : '#2368A3'} />
                      <Text
                        numberOfLines={1}
                        className={`text-xs font-bold ${
                          value === 'cash' ? 'text-white' : 'text-foreground'
                        }`}
                      >
                        Efectivo
                      </Text>
                    </Pressable>

                    <Pressable
                      onPress={() => onChange('transfer')}
                      className={`flex-1 flex-row items-center justify-center gap-1.5 h-12 px-1.5 rounded-xl border ${
                        value === 'transfer'
                          ? 'bg-secondary border-secondary'
                          : 'bg-muted/40 border-border/70 active:bg-muted'
                      }`}
                    >
                      <QrCode size={16} color={value === 'transfer' ? '#ffffff' : '#2368A3'} />
                      <Text
                        numberOfLines={1}
                        className={`text-xs font-bold ${
                          value === 'transfer' ? 'text-white' : 'text-foreground'
                        }`}
                      >
                        QR / Transf.
                      </Text>
                    </Pressable>
                  </>
                )}
              />

              {/* Fecha en la 3ra columna */}
              <View className="flex-1">
                <Controller
                  control={control}
                  name="paymentDate"
                  render={({ field: { value, onChange } }) => (
                    <DatePicker
                      value={value}
                      onChange={onChange}
                      className="w-full"
                      buttonClassName="h-12 rounded-xl bg-muted/40 border-border/70 px-2 justify-center"
                      textClassName="text-xs font-bold text-center"
                    />
                  )}
                />
              </View>
            </View>
            {errors.paymentDate && (
              <Text className="text-destructive text-sm mt-1">
                {errors.paymentDate.message}
              </Text>
            )}
          </View>

          {/* Notas */}
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
                  placeholder="Ej. Pago entregado por el titular"
                  className="bg-background text-foreground text-sm h-12 rounded-xl"
                />
              )}
            />
          </View>

          {/* Error del Backend */}
          {registerPayment.isError && (
            <View className="flex-row items-center gap-2 bg-destructive/10 border border-destructive/30 rounded-xl p-3">
              <AlertCircle size={18} color="#ef4444" />
              <Text className="text-destructive text-sm font-semibold flex-1">
                {getApiErrorMessage(registerPayment.error)}
              </Text>
            </View>
          )}
        </View>

        <DialogFooter className="mt-2 flex-row gap-3">
          <Button
            variant="outline"
            onPress={onClose}
            disabled={registerPayment.isPending}
            className="flex-1 h-12 rounded-xl"
          >
            <Text className="font-bold text-foreground text-base">Cancelar</Text>
          </Button>

          <Button
            onPress={handleSubmit(onSubmit)}
            disabled={registerPayment.isPending}
            className="flex-1 h-12 rounded-xl bg-secondary active:bg-secondary/90 flex-row items-center justify-center gap-2"
          >
            {registerPayment.isPending ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <>
                <CheckCircle2 size={18} color="#ffffff" />
                <Text className="font-bold text-white text-base">Confirmar Pago</Text>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
