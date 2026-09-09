import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { SectionHeader } from './SectionHeader';
import { SectionTag } from './SectionTag';
import { DualCurrencyAmount } from './DualCurrencyAmount';
import { StatCell } from './StatCell';
import { CurrencyAmount } from '@/types/stats';
import { HandCoins } from 'lucide-react-native';
import { palette } from '@/lib/theme/colors';

interface MonthlyActivityCardProps {
  newLoansCapital: CurrencyAmount;
  newLoansCount: number;
  completedLoansCount: number;
  newClientsCount: number;
}

export function MonthlyActivityCard({
  newLoansCapital,
  newLoansCount,
  completedLoansCount,
  newClientsCount,
}: MonthlyActivityCardProps) {
  return (
    <View className="mx-4 mb-3 bg-card border border-border rounded-2xl p-4 shadow-sm">
      <SectionHeader
        icon={<HandCoins size={18} color={palette.celeste} />}
        title="Actividad del Mes"
        subtitle="riskIndicators · desembolsos y cierres del período"
        right={<SectionTag kind="month" />}
      />

      <View className="flex-row items-center justify-between py-2 border-b border-border/50">
        <Text className="text-muted-foreground text-sm font-semibold">
          Capital de préstamos nuevos
        </Text>
        <DualCurrencyAmount amount={newLoansCapital ?? { BOB: 0, USD: 0 }} />
      </View>

      <View className="flex-row gap-2.5 mt-3">
        <StatCell
          label="Nuevos préstamos"
          value={newLoansCount ?? 0}
          valueClassName="text-blue-600 dark:text-blue-400"
        />
        <StatCell
          label="Préstamos finalizados"
          value={completedLoansCount ?? 0}
          valueClassName="text-foreground"
        />
        <StatCell
          label="Clientes nuevos"
          value={newClientsCount ?? 0}
          valueClassName="text-emerald-600 dark:text-emerald-400"
        />
      </View>
    </View>
  );
}