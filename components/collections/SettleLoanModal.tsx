import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { KeyboardAwareScrollView } from '@/components/ui/KeyboardAwareScrollView';
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
import { AlertCircle, BadgeCheck, Info } from 'lucide-react-native';
import { SettleLoanInput, SettleLoanResponseData } from '@/types/payment';
import { Currency } from '@/types/loan';
import { formatCurrency, getTodayISO } from '@/lib/format';
import { getApiErrorMessage } from '@/services/api';
import { useSettleLoan } from '@/hooks/useSettleLoan';
import { PaymentClientSummary } from './modal/PaymentClientSummary';
import { PaymentMethodSelector } from './modal/PaymentMethodSelector';

// ─────────────────────────────────────────────────────────────────────────────
// Schema
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Construye el schema Zod con la restricción cross-field:
 * amount + discount debe ser exactamente igual a outstandingBalance.
 */
function buildSettleSchema(outstandingBalance: number, currency: Currency = 'BOB') {
  return z
    .object({
      amount: z
        .string()
        .min(1, 'Ingresa el monto a cobrar')
        .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
          message: 'El monto debe ser un número mayor a 0',
        }),
      discount: z
        .string()
        .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
          message: 'El descuento debe ser 0 o mayor',
        }),
      method: z.enum(['cash', 'transfer']),
      paymentDate: z.string().min(1, 'Selecciona la fecha de liquidación'),
      notes: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      const total = Number(data.amount) + Number(data.discount);
      const diff = Math.abs(total - outstandingBalance);
      // Tolerancia de 0.01 para evitar errores de coma flotante
      if (diff > 0.01) {
        const msg = `Monto + Descuento (${formatCurrency(total, currency)}) debe ser igual al saldo pendiente (${formatCurrency(outstandingBalance, currency)})`;
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: msg, path: ['amount'] });
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: ' ', path: ['discount'] });
      }
    });
}

type SettleFormData = {
  amount: string;
  discount: string;
  method: 'cash' | 'transfer';
  paymentDate: string;
  notes?: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────

interface SettleLoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  loanId: string;
  clientName: string;
  clientPhone?: string;
  /** Saldo total pendiente del préstamo; amount + discount debe igualarlo. */
  outstandingBalance: number;
  currency?: Currency;
  onSettleSuccess?: (result: SettleLoanResponseData) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export function SettleLoanModal({
  isOpen,
  onClose,
  loanId,
  clientName,
  clientPhone = '',
  outstandingBalance,
  currency = 'BOB',
  onSettleSuccess,
}: SettleLoanModalProps) {
  const settleLoan = useSettleLoan();
  const settleSchema = buildSettleSchema(outstandingBalance, currency);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SettleFormData>({
    resolver: zodResolver(settleSchema),
    defaultValues: {
      amount: outstandingBalance > 0 ? String(outstandingBalance) : '',
      discount: '0',
      method: 'cash',
      paymentDate: getTodayISO(),
      notes: '',
    },
  });

  // Refresca el formulario cada vez que el modal se abre
  useEffect(() => {
    if (isOpen) {
      reset({
        amount: outstandingBalance > 0 ? String(outstandingBalance) : '',
        discount: '0',
        method: 'cash',
        paymentDate: getTodayISO(),
        notes: '',
      });
      settleLoan.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, outstandingBalance, reset]);

  const onSubmit = (data: SettleFormData) => {
    const payload: SettleLoanInput = {
      loanId,
      amount: parseFloat(data.amount),
      discount: parseFloat(data.discount),
      method: data.method,
      paymentDate: data.paymentDate,
      notes: data.notes?.trim() || undefined,
    };

    settleLoan.mutate(payload, {
      onSuccess: (result) => {
        onSettleSuccess?.(result);
        onClose();
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg w-full bg-card border border-border p-4 sm:p-5 rounded-2xl">
        {/* Header */}
        <DialogHeader className="mb-0.5">
          <View className="flex-row items-center gap-2">
            <BadgeCheck size={20} color="#2368A3" />
            <DialogTitle className="text-foreground font-bold text-lg">
              Liquidar Préstamo
            </DialogTitle>
          </View>
        </DialogHeader>

        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerClassName="gap-3 py-1"
        >
          {/* Ficha del cliente */}
          <PaymentClientSummary clientName={clientName} clientPhone={clientPhone} />

          {/* Banner informativo */}
          <View className="flex-row items-start gap-2.5 bg-primary/10 border border-primary/25 rounded-xl p-3">
            <Info size={16} color="#6DB6EF" />
            <Text className="text-foreground text-sm font-medium flex-1 leading-snug">
              La liquidación cancela todo el saldo pendiente en un solo pago. Puedes aplicar un descuento para reducir el monto real a cobrar.
            </Text>
          </View>

          {/* Resumen de saldo */}
          <View className="bg-secondary/5 border border-secondary/20 rounded-xl px-4 py-3">
            <Text className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-0.5">
              Saldo Pendiente a Liquidar
            </Text>
            <Text className="text-secondary font-bold text-2xl">
              {formatCurrency(outstandingBalance, currency)}
            </Text>
            <Text className="text-muted-foreground text-xs font-medium mt-0.5">
              Monto + Descuento debe igualar este valor
            </Text>
          </View>

          {/* Monto a cobrar */}
          <View>
            <Text className="text-foreground text-xs font-bold uppercase tracking-wider mb-1.5">
              Monto a Cobrar ({currency === 'USD' ? '$us' : 'Bs.-'}) *
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

          {/* Descuento */}
          <View>
            <Text className="text-foreground text-xs font-bold uppercase tracking-wider mb-1.5">
              Descuento ({currency === 'USD' ? '$us' : 'Bs.-'}) — Opcional
            </Text>
            <Controller
              control={control}
              name="discount"
              render={({ field: { value, onChange, onBlur } }) => (
                <Input
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="numeric"
                  placeholder="0"
                  className="bg-background text-foreground text-lg h-12 rounded-xl"
                />
              )}
            />
            {errors.discount && errors.discount.message?.trim() && (
              <Text className="text-destructive text-sm mt-1">
                {errors.discount.message}
              </Text>
            )}
          </View>

          {/* Método de pago */}
          <Controller
            control={control}
            name="method"
            render={({ field: { value, onChange } }) => (
              <PaymentMethodSelector value={value} onChange={onChange} />
            )}
          />

          {/* Fecha */}
          <View>
            <Text className="text-foreground text-xs font-bold uppercase tracking-wider mb-1.5">
              Fecha de Liquidación *
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
                  placeholder="Ej. Liquidación anticipada acordada con el cliente"
                  className="bg-background text-foreground text-sm h-12 rounded-xl"
                />
              )}
            />
          </View>

          {/* Error del backend */}
          {settleLoan.isError && (
            <View className="flex-row items-center gap-2 bg-destructive/10 border border-destructive/30 rounded-xl p-3">
              <AlertCircle size={18} color="#ef4444" />
              <Text className="text-destructive text-sm font-semibold flex-1">
                {getApiErrorMessage(settleLoan.error)}
              </Text>
            </View>
          )}
        </KeyboardAwareScrollView>

        <DialogFooter className="mt-2 flex-row gap-3">
          <Button
            variant="outline"
            onPress={onClose}
            disabled={settleLoan.isPending}
            className="flex-1 h-12 rounded-xl"
          >
            <Text className="font-bold text-foreground text-base">Cancelar</Text>
          </Button>

          <Button
            onPress={handleSubmit(onSubmit)}
            disabled={settleLoan.isPending}
            className="flex-1 h-12 rounded-xl bg-secondary active:bg-secondary/90 flex-row items-center justify-center gap-2"
          >
            {settleLoan.isPending ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <>
                <BadgeCheck size={18} color="#ffffff" />
                <Text className="font-bold text-white text-base">Liquidar</Text>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
