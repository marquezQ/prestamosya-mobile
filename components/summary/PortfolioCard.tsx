import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { SectionHeader } from './SectionHeader';
import { SectionTag } from './SectionTag';
import { DualCurrencyAmount } from './DualCurrencyAmount';
import { CurrencyAmount } from '@/types/stats';
import { ShieldAlert } from 'lucide-react-native';
import { palette } from '@/lib/theme/colors';

interface PortfolioCardProps {
  capitalDeployed: CurrencyAmount;
  portfolioAtRisk: CurrencyAmount;
  delinquencyRate: number;
  overdueLoansCount: number;
}

function getDelinquencyText(rate: number) {
  if (rate >= 20) {
    return 'text-red-600 dark:text-red-400';
  }
  if (rate >= 10) {
    return 'text-amber-600 dark:text-amber-400';
  }
  return 'text-green-600 dark:text-green-400';
}

export function PortfolioCard({
  capitalDeployed,
  portfolioAtRisk,
  delinquencyRate,
  overdueLoansCount,
}: PortfolioCardProps) {
  const rate = delinquencyRate ?? 0;

  return (
    <View className="mx-4 mb-3 bg-card border border-border rounded-2xl p-4 shadow-sm">
      <SectionHeader
        icon={<ShieldAlert size={18} color={palette.azul} />}
        title="Estado de tu Cartera"
        subtitle="delinquencyRate · portfolioAtRisk · capitalDeployed"
        right={<SectionTag kind="now" />}
      />

      <View className="flex-row items-center justify-between py-2 border-b border-border/50">
        <Text className="text-muted-foreground text-sm font-semibold">Capital en calle</Text>
        <DualCurrencyAmount
          amount={capitalDeployed ?? { BOB: 0, USD: 0 }}
          textClassName="font-extrabold text-base"
        />
      </View>

      <View className="flex-row items-center justify-between py-2 border-b border-border/50">
        <Text className="text-muted-foreground text-sm font-semibold">Capital en riesgo</Text>
        <DualCurrencyAmount amount={portfolioAtRisk ?? { BOB: 0, USD: 0 }} />
      </View>

      <View className="flex-row items-center justify-between py-2 border-b border-border/50">
        <Text className="text-muted-foreground text-sm font-semibold">Préstamos con mora</Text>
        <Text className="text-red-600 dark:text-red-400 font-extrabold text-base">
          {overdueLoansCount ?? 0}
        </Text>
      </View>

      <View className="flex-row items-center justify-between py-2">
        <Text className="text-muted-foreground text-sm font-semibold">Tasa de morosidad</Text>
        <Text className={`font-extrabold text-base ${getDelinquencyText(rate)}`}>
          {rate.toFixed(1)}%
        </Text>
      </View>
    </View>
  );
}