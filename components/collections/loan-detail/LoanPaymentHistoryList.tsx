import React, { useState } from 'react';
import { View, Pressable, Alert, Platform } from 'react-native';
import { Text } from '@/components/ui/text';
import { Banknote, Trash2, Ban } from 'lucide-react-native';
import { LoanPaymentItem, Currency } from '@/types/loan';
import { formatDateBO, formatCurrency } from '@/lib/format';
import { VoidPaymentDialog } from './VoidPaymentDialog';

interface LoanPaymentHistoryListProps {
  payments: LoanPaymentItem[];
  currency?: Currency;
}

export function LoanPaymentHistoryList({ payments, currency = 'BOB' }: LoanPaymentHistoryListProps) {
  const [selectedPaymentForVoid, setSelectedPaymentForVoid] = useState<{
    id: string;
    amount: number;
  } | null>(null);

  if (!payments || payments.length === 0) return null;

  const handleVoidSuccess = () => {
    const msg = 'El pago ha sido anulado correctamente.';
    if (Platform.OS === 'web') {
      window.alert(msg);
    } else {
      Alert.alert('Éxito', msg);
    }
  };

  return (
    <View className="mt-2">
      <View className="mx-4 mb-3 flex-row items-center justify-between">
        <Text className="text-foreground font-bold text-xl tracking-tight">
          Historial de Pagos
        </Text>
        <View className="bg-muted px-2.5 py-0.5 rounded-full">
          <Text className="text-muted-foreground text-xs font-bold">
            {payments.length}
          </Text>
        </View>
      </View>

      {payments.map((pay) => {
        const isVoided = pay.voided;

        return (
          <View
            key={pay.id}
            className={`mx-4 mb-3 rounded-2xl border p-3.5 shadow-sm flex-row items-center justify-between gap-3 ${
              isVoided
                ? 'bg-muted/40 border-border/60 opacity-80'
                : 'bg-card border-border'
            }`}
          >
            {/* Left: Icon + Method & Details */}
            <View className="flex-row items-center gap-3 flex-1">
              <View
                className={`p-2.5 rounded-xl shrink-0 ${
                  isVoided ? 'bg-destructive/10' : 'bg-green-500/10'
                }`}
              >
                {isVoided ? (
                  <Ban size={20} color="#ef4444" />
                ) : (
                  <Banknote size={20} color="#22c55e" />
                )}
              </View>

              <View className="flex-1">
                <View className="flex-row items-center gap-2">
                  <Text
                    className={`font-bold text-base leading-snug ${
                      isVoided
                        ? 'text-muted-foreground line-through'
                        : 'text-foreground'
                    }`}
                  >
                    Pago ({pay.method === 'transfer' ? 'Transferencia/QR' : 'Efectivo'})
                  </Text>
                  {isVoided && (
                    <View className="bg-destructive/10 px-2 py-0.5 rounded-full border border-destructive/20">
                      <Text className="text-destructive text-xs font-bold uppercase">
                        Anulado
                      </Text>
                    </View>
                  )}
                </View>

                <Text
                  className="text-muted-foreground text-xs font-medium mt-0.5"
                  numberOfLines={1}
                >
                  {formatDateBO(pay.paymentDate)} •{' '}
                  {isVoided
                    ? `Motivo: ${pay.voidReason || 'Sin motivo'}`
                    : pay.notes || 'Sin notas'}
                </Text>
              </View>
            </View>

            {/* Right: Amount + Void Button */}
            <View className="flex-row items-center gap-2 shrink-0">
              <Text
                className={`font-bold text-base ${
                  isVoided
                    ? 'text-muted-foreground line-through'
                    : 'text-green-600 dark:text-green-400'
                }`}
              >
                {isVoided ? '' : '+ '}{formatCurrency(pay.amount, currency)}
              </Text>

              {!isVoided && (
                <Pressable
                  onPress={() =>
                    setSelectedPaymentForVoid({ id: pay.id, amount: pay.amount })
                  }
                  className="h-9 w-9 items-center justify-center bg-destructive/10 rounded-xl border border-destructive/20 active:bg-destructive/20 ml-1"
                >
                  <Trash2 size={16} color="#ef4444" />
                </Pressable>
              )}
            </View>
          </View>
        );
      })}

      {/* Modal de Anulación de Pago */}
      {selectedPaymentForVoid && (
        <VoidPaymentDialog
          isOpen={!!selectedPaymentForVoid}
          onClose={() => setSelectedPaymentForVoid(null)}
          paymentId={selectedPaymentForVoid.id}
          amount={selectedPaymentForVoid.amount}
          currency={currency}
          onSuccess={handleVoidSuccess}
        />
      )}
    </View>
  );
}
