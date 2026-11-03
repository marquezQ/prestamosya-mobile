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
import { AlertCircle, BadgeCheck, Banknote, Info, QrCode } from 'lucide-react-native';
import { SettleLoanInput, SettleLoanResponseData } from '@/types/payment';
import { Currency } from '@/types/loan';
import { formatCurrency, getTodayISO, getInitials } from '@/lib/format';
import { getApiErrorMessage } from '@/services/api';
import { useSettleLoan } from '@/hooks/useSettleLoan';

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
  outstandingBalance,
  currency = 'BOB',
  onSettleSuccess,
}: SettleLoanModalProps) {
  const settleLoan = useSettleLoan();
  const settleSchema = buildSettleSchema(outstandingBalance, currency);
  const initials = getInitials(clientName);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SettleFormData>({
    resolver: zodResolver(settleSchema),
    defaultValues: {
      amount: '',
      discount: '',
      method: 'cash',
      paymentDate: getTodayISO(),
      notes: '',
    },
  });

  // Refresca el formulario cada vez que el modal se abre
  useEffect(() => {
    if (isOpen) {
      reset({
        amount: '',
        discount: '',
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
      discount: data.discount ? parseFloat(data.discount) : 0,
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

        <View className="gap-3 py-1">
          {/* Ficha del cliente: avatar + nombre (sin teléfono) */}
          <View className="flex-row items-center gap-3 bg-muted/40 border border-border/60 rounded-xl p-2.5">
            <View className="w-10 h-10 rounded-full bg-primary/20 items-center justify-center shrink-0">
              <Text className="text-secondary font-bold text-base">{initials}</Text>
            </View>
            <View className="flex-1 justify-center">
              <Text className="text-foreground font-bold text-base leading-snug" numberOfLines={1}>
                {clientName}
              </Text>
            </View>
          </View>

          {/* Banner informativo de recomendación */}
          <View className="flex-row items-start gap-2.5 bg-primary/10 border border-primary/25 rounded-xl p-3">
            <Info size={18} color="#6DB6EF" className="shrink-0 mt-0.5" />
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

          {/* Monto y Descuento en una sola fila */}
          <View className="flex-row gap-3">
            <View className="flex-1">
              <Text className="text-foreground text-xs font-bold uppercase tracking-wider mb-1.5" numberOfLines={1}>
                Monto ({currency}) *
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
                    className="bg-background text-foreground font-bold text-base h-12 rounded-xl"
                  />
                )}
              />
              {errors.amount && (
                <Text className="text-destructive text-xs mt-1">
                  {errors.amount.message}
                </Text>
              )}
            </View>

            <View className="flex-1">
              <Text className="text-foreground text-xs font-bold uppercase tracking-wider mb-1.5" numberOfLines={1}>
                Desc. ({currency})
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
                    className="bg-background text-foreground text-base h-12 rounded-xl"
                  />
                )}
              />
              {errors.discount && errors.discount.message?.trim() && (
                <Text className="text-destructive text-xs mt-1">
                  {errors.discount.message}
                </Text>
              )}
            </View>
          </View>

          {/* Fila única de 3 columnas: Efectivo | Transferencia/QR | Fecha de Liquidación */}
          <View>
            <Text className="text-foreground text-xs font-bold uppercase tracking-wider mb-1.5">
              Método y Fecha de Liquidación *
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
              <Text className="text-destructive text-xs mt-1">
                {errors.paymentDate.message}
              </Text>
            )}
          </View>

          {/* Notas */}
          <View>
            <Text className="text-foreground text-xs font-bold uppercase tracking-wider mb-1.5">
              Notas (Opcional)
            </Text>
            <Controller
              control={control}
              name="notes"
              render={({ field: { value, onChange, onBlur } }) => (
                <Input
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Ej. Liquidación anticipada acordada"
                  className="bg-background text-foreground text-sm h-12 rounded-xl"
                />
              )}
            />
          </View>

          {/* Error del backend */}
          {settleLoan.isError && (
            <View className="flex-row items-center gap-2 bg-destructive/10 border border-destructive/30 rounded-xl p-2.5">
              <AlertCircle size={16} color="#ef4444" />
              <Text className="text-destructive text-xs font-semibold flex-1">
                {getApiErrorMessage(settleLoan.error)}
              </Text>
            </View>
          )}
        </View>

        <DialogFooter className="mt-3 flex-row gap-3">
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
