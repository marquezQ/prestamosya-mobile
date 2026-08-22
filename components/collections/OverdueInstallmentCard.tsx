import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { DashboardInstallmentItem } from '@/types/payment';
import { formatDateBO, formatBs, getInitials } from '@/lib/format';

interface OverdueInstallmentCardProps {
  item: DashboardInstallmentItem;
  onPress: () => void;
}

export function OverdueInstallmentCard({ item, onPress }: OverdueInstallmentCardProps) {
  const initials = getInitials(item.clientName);
  const formattedDate = formatDateBO(item.dueDate, 'dd/MM/yyyy');
  const displayAmount =
    item.remainingAmount > 0 ? item.remainingAmount : item.totalAmount;

  return (
    <Pressable
      onPress={onPress}
      className="mx-4 mb-3 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 p-4 shadow-sm active:bg-red-100/50 flex-row items-center justify-between"
    >
      {/* Left: Initials Avatar + Client Info */}
      <View className="flex-row items-center gap-3.5 flex-1 mr-3">
        {/* Avatar badge */}
        <View className="w-11 h-11 rounded-full bg-red-600 items-center justify-center shadow-sm">
          <Text className="text-white font-bold text-sm">{initials}</Text>
        </View>

        {/* Info */}
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
      <View className="bg-red-600 px-3.5 py-1.5 rounded-xl items-center justify-center shadow-sm">
        <Text className="text-white font-bold text-sm">{formatBs(displayAmount)}</Text>
      </View>
    </Pressable>
  );
}
