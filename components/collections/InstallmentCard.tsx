import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { ChevronRight, MessageSquare } from 'lucide-react-native';
import { DashboardInstallmentItem } from '@/types/payment';
import { palette } from '@/lib/theme/colors';
import { formatCurrency } from '@/lib/format';
import { getInstallmentStatusConfig } from './installmentStatus';
import { sendWhatsAppWithChooser } from '@/lib/whatsapp';

interface InstallmentCardProps {
  item: DashboardInstallmentItem;
  onPress: () => void;
}

function buildReminderMessage(item: DashboardInstallmentItem): string {
  const amount = formatCurrency(
    item.remainingAmount > 0 ? item.remainingAmount : item.totalAmount,
    item.currency || 'BOB',
  );
  return `Hola ${item.clientName}, le recordamos que hoy vence su cuota N° ${item.installmentNumber} por un monto de ${amount}. Le pedimos realizar el pago. ¡Gracias!`;
}

export function InstallmentCard({ item, onPress }: InstallmentCardProps) {
  const badgeConfig = getInstallmentStatusConfig(item.status);
  const StatusIcon = badgeConfig.icon;
  const displayAmount =
    item.remainingAmount > 0 ? item.remainingAmount : item.totalAmount;

  // Solo mostrar WhatsApp para cuotas PENDIENTES o PARCIALES (no ya pagadas)
  const showWhatsApp = item.status === 'PENDING' || item.status === 'PARTIAL';

  const handleWhatsApp = () => {
    sendWhatsAppWithChooser({
      phone: item.clientPhone,
      text: buildReminderMessage(item),
    });
  };

  return (
    <Pressable
      onPress={onPress}
      className="mx-4 mb-3 rounded-2xl bg-card border border-border p-4 shadow-sm active:bg-muted/50 flex-row items-center justify-between"
    >
      {/* Left: Cuota badge + WhatsApp icon + Client Info + Status */}
      <View className="flex-row items-center gap-3 flex-1 mr-3">

        {/* Columna izquierda: Badge N° cuota + mini botón WhatsApp debajo */}
        <View className="items-center gap-1.5 shrink-0">
          <View className="px-2.5 py-1.5 min-w-[50px] rounded-xl bg-secondary/10 items-center justify-center border border-secondary/20">
            <Text className="text-muted-foreground text-[11px] font-bold uppercase leading-none">
              CUOTA
            </Text>
            <Text className="text-secondary font-extrabold text-xs leading-none mt-0.5">
              #{item.installmentNumber}
            </Text>
          </View>

          {showWhatsApp && (
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                handleWhatsApp();
              }}
              className="w-[50px] h-7 bg-green-600 active:bg-green-700 rounded-lg items-center justify-center"
            >
              <MessageSquare size={13} color="#ffffff" />
            </Pressable>
          )}
        </View>

        {/* Client details */}
        <View className="flex-1">
          <Text
            className="text-foreground font-bold text-base leading-snug mb-1"
            numberOfLines={1}
          >
            {item.clientName}
          </Text>

          {/* Status badge */}
          <View className="flex-row items-center self-start">
            <View className={`flex-row items-center gap-1 px-2.5 py-0.5 rounded-full ${badgeConfig.bg}`}>
              <StatusIcon size={12} color={badgeConfig.iconColor} />
              <Text className={`text-xs font-bold ${badgeConfig.textColor}`}>
                {badgeConfig.label}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Right: Amount + Chevron */}
      <View className="flex-row items-center gap-2 shrink-0">
        <Text className="text-foreground font-bold text-base">
          {formatCurrency(displayAmount, item.currency || 'BOB')}
        </Text>
        <ChevronRight size={18} color={palette.azul} />
      </View>
    </Pressable>
  );
}
