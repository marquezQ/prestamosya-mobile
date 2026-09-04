import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { AlertCircle, Trash2 } from 'lucide-react-native';
import { formatCurrency } from '@/lib/format';
import { Currency } from '@/types/loan';
import { getApiErrorMessage } from '@/services/api';
import { useVoidPayment } from '@/hooks/useVoidPayment';

interface VoidPaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  paymentId: string;
  amount: number;
  currency?: Currency;
  onSuccess?: () => void;
}

export function VoidPaymentDialog({
  isOpen,
  onClose,
  paymentId,
  amount,
  currency = 'BOB',
  onSuccess,
}: VoidPaymentDialogProps) {
  const [reason, setReason] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const voidPayment = useVoidPayment();

  useEffect(() => {
    if (isOpen) {
      setReason('');
      setValidationError(null);
      voidPayment.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleConfirmVoid = () => {
    const trimmedReason = reason.trim();
    if (!trimmedReason || trimmedReason.length < 3) {
      setValidationError('Ingresa un motivo válido (mínimo 3 caracteres)');
      return;
    }

    setValidationError(null);
    voidPayment.mutate(
      { paymentId, reason: trimmedReason },
      {
        onSuccess: () => {
          onSuccess?.();
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md w-full bg-card border border-border p-4 sm:p-5 rounded-2xl">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-destructive font-bold text-lg flex-row items-center gap-2">
            <Trash2 size={20} className="text-destructive" /> Anular Pago
          </DialogTitle>
        </DialogHeader>

        <View className="gap-3 py-1">
          <View className="bg-destructive/10 border border-destructive/20 rounded-xl p-3">
            <Text className="text-foreground text-sm font-medium">
              ¿Estás seguro de que deseas anular el pago por{' '}
              <Text className="font-bold text-destructive">{formatCurrency(amount, currency)}</Text>?
            </Text>
            <Text className="text-muted-foreground text-xs font-medium mt-1">
              Esta acción revertirá los abonos a las cuotas correspondientes.
            </Text>
          </View>

          <View>
            <Text className="text-foreground text-xs font-bold uppercase tracking-wider mb-1.5">
              Motivo de Anulación *
            </Text>
            <Input
              value={reason}
              onChangeText={(text) => {
                setReason(text);
                if (validationError) setValidationError(null);
              }}
              autoCapitalize="sentences"
              autoCorrect={false}
              placeholder="Ej. Error en el monto ingresado"
              className="bg-background text-foreground text-sm h-12 rounded-xl"
            />
            {validationError && (
              <Text className="text-destructive text-sm mt-1">
                {validationError}
              </Text>
            )}
          </View>

          {voidPayment.isError && (
            <View className="flex-row items-center gap-2 bg-destructive/10 border border-destructive/30 rounded-xl p-3">
              <AlertCircle size={18} color="#ef4444" />
              <Text className="text-destructive text-sm font-semibold flex-1">
                {getApiErrorMessage(voidPayment.error)}
              </Text>
            </View>
          )}
        </View>

        <DialogFooter className="mt-3 flex-row gap-3">
          <Button
            variant="outline"
            onPress={onClose}
            disabled={voidPayment.isPending}
            className="flex-1 h-12 rounded-xl"
          >
            <Text className="font-bold text-foreground text-base">Cancelar</Text>
          </Button>

          <Button
            onPress={handleConfirmVoid}
            disabled={voidPayment.isPending}
            className="flex-1 h-12 rounded-xl bg-destructive active:bg-destructive/90 flex-row items-center justify-center gap-2"
          >
            {voidPayment.isPending ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text className="font-bold text-white text-base">Anular Pago</Text>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
