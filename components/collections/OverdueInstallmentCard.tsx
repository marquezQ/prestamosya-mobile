import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { MessageSquare } from 'lucide-react-native';
import { DashboardInstallmentItem } from '@/types/payment';
import { formatDateBO, formatCurrency } from '@/lib/format';
import { sendWhatsAppWithChooser } from '@/lib/whatsapp';

interface OverdueInstallmentCardProps {
  item: DashboardInstallmentItem;
  onPress: () => void;
}

function buildOverdueMessage(item: DashboardInstallmentItem): string {
  const amount = formatCurrency(
    item.remainingAmount > 0 ? item.remainingAmount : item.totalAmount,
    item.currency || 'BOB',
  );
  return `Hola ${item.clientName}, le informamos que tiene la cuota N° ${item.installmentNumber} con un saldo de ${amount} con ${item.daysOverdue} ${item.daysOverdue === 1 ? 'día' : 'días'} de mora. Le pedimos regularizar el pago a la brevedad. ¡Gracias!`;
}

export function OverdueInstallmentCard({ item, onPress }: OverdueInstallmentCardProps) {
  const formattedDate = formatDateBO(item.dueDate, 'dd/MM/yyyy');
  const displayAmount =
    item.remainingAmount > 0 ? item.remainingAmount : item.totalAmount;

  const handleWhatsApp = () => {
    sendWhatsAppWithChooser({
      phone: item.clientPhone,
      text: buildOverdueMessage(item),
    });
  };

  return (
    <Pressable
      onPress={onPress}
      className="mx-4 mb-3 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 p-4 shadow-sm active:bg-red-100/50 flex-row items-center justify-between"
    >
      {/* Left: N° Cuota badge + WhatsApp icon + Client Info */}
      <View className="flex-row items-center gap-3.5 flex-1 mr-3">

        {/* Columna izquierda: Badge N° cuota en rojo + mini botón WhatsApp debajo */}
        <View className="items-center gap-1.5 shrink-0">
          <View className="px-2.5 py-1.5 min-w-[50px] rounded-xl bg-red-600/15 items-center justify-center border border-red-500/30">
            <Text className="text-red-700 dark:text-red-400 text-[10px] font-bold uppercase leading-none">
              CUOTA
            </Text>
            <Text className="text-red-600 dark:text-red-400 font-extrabold text-xs leading-none mt-0.5">
              #{item.installmentNumber}
            </Text>
          </View>

          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              handleWhatsApp();
            }}
            className="w-[50px] h-7 bg-green-600 active:bg-green-700 rounded-lg items-center justify-center"
          >
            <MessageSquare size={13} color="#ffffff" />
          </Pressable>
        </View>

        {/* Info del cliente */}
        <View className="flex-1">
          <Text
            className="text-foreground font-bold text-base leading-snug mb-0.5"
            numberOfLines={1}
          >
            {item.clientName}
          </Text>

          <Text className="text-red-600 dark:text-red-400 text-xs font-semibold">
            Desde {formattedDate} ({item.daysOverdue}{' '}
            {item.daysOverdue === 1 ? 'día' : 'días'} de mora)
          </Text>
        </View>
      </View>

      {/* Right: Red Amount Badge */}
      <View className="bg-red-600 px-3.5 py-1.5 rounded-xl items-center justify-center shadow-sm shrink-0">
        <Text className="text-white font-bold text-sm">
          {formatCurrency(displayAmount, item.currency || 'BOB')}
        </Text>
      </View>
    </Pressable>
  );
}
