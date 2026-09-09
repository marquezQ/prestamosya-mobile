import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { SectionHeader } from './SectionHeader';
import { SectionTag } from './SectionTag';
import { DualCurrencyAmount } from './DualCurrencyAmount';
import { MonthlyBalance } from '@/types/stats';
import { Coins } from 'lucide-react-native';
import { palette } from '@/lib/theme/colors';

interface BalanceCardProps {
  balance: MonthlyBalance;
}

export function BalanceCard({ balance }: BalanceCardProps) {
  const b = balance ?? ({} as MonthlyBalance);
  const roc = b.returnOnCapital ?? { BOB: 0, USD: 0 };
  const hasRocUSD = (roc.USD ?? 0) > 0;

  return (
    <View className="mx-4 mb-3 bg-card border border-border rounded-2xl p-4 shadow-sm">
      <SectionHeader
        icon={<Coins size={18} color={palette.celeste} />}
        title="Balance del Mes"
        subtitle="monthlyBalance · resultado del período"
        right={<SectionTag kind="month" />}
      />

      <View className="flex-row items-center justify-between py-2 border-b border-border/50">
        <Text className="text-muted-foreground text-sm font-semibold">Beneficio neto</Text>
        <DualCurrencyAmount
          amount={b.netProfit ?? { BOB: 0, USD: 0 }}
          textClassName="text-green-600 dark:text-green-400 font-extrabold text-base"
        />
      </View>

      <View className="flex-row items-center justify-between py-2">
        <Text className="text-muted-foreground text-sm font-semibold">Retorno sobre capital</Text>
        <View className="items-end">
          <Text className="text-foreground font-extrabold text-base">
            {(roc.BOB ?? 0).toFixed(2)}%
          </Text>
          {hasRocUSD && (
            <Text className="text-muted-foreground text-xs font-semibold">
              {(roc.USD ?? 0).toFixed(2)}%
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}