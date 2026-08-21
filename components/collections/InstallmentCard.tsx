import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { ChevronRight } from 'lucide-react-native';
import { DashboardInstallmentItem } from '@/types/payment';
import { palette } from '@/lib/theme/colors';
import { formatBs } from '@/lib/format';
import { getInstallmentStatusConfig } from './installmentStatus';

interface InstallmentCardProps {
  item: DashboardInstallmentItem;
  onPress: () => void;
}

export function InstallmentCard({ item, onPress }: InstallmentCardProps) {
  const badgeConfig = getInstallmentStatusConfig(item.status);
  const StatusIcon = badgeConfig.icon;
  const displayAmount =
    item.remainingAmount > 0 ? item.remainingAmount : item.totalAmount;

  return (
    <Pressable
      onPress={onPress}
      className="mx-4 mb-3 rounded-2xl bg-card border border-border p-4 shadow-sm active:bg-muted/50 flex-row items-center justify-between"
    >
      {/* Left: Cuota badge + Client Info + Status */}
      <View className="flex-row items-center gap-3 flex-1 mr-3">
        {/* Cuota # Badge */}
        <View className="w-12 h-12 rounded-2xl bg-secondary/10 items-center justify-center border border-secondary/20">
          <Text className="text-muted-foreground text-xs font-bold uppercase tracking-wider leading-none">
            CUOTA
          </Text>
          <Text className="text-secondary font-extrabold text-base leading-none mt-1">
            #{item.installmentNumber}
          </Text>
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
      <View className="flex-row items-center gap-2">
        <Text className="text-foreground font-bold text-base">
          {formatBs(displayAmount)}
        </Text>
        <ChevronRight size={18} color={palette.azul} />
      </View>
    </Pressable>
  );
}
