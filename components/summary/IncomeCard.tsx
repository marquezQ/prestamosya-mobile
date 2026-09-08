import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { SectionHeader } from './SectionHeader';
import { DualCurrencyAmount } from './DualCurrencyAmount';
import { formatAmountNumber } from '@/lib/format';
import { IncomeBreakdown } from '@/types/stats';
import { TrendingUp } from 'lucide-react-native';
import { palette } from '@/lib/theme/colors';

interface IncomeCardProps {
  income: IncomeBreakdown;
}

export function IncomeCard({ income }: IncomeCardProps) {
  const interest = income?.interestCollected ?? { BOB: 0, USD: 0 };
  const capital = income?.capitalRecovered ?? { BOB: 0, USD: 0 };
  const cashIn = income?.totalCashIn ?? { BOB: 0, USD: 0 };
  const discounts = income?.discountsGiven ?? { BOB: 0, USD: 0 };
  const hasUSD = (interest.USD ?? 0) > 0;
  const hasDiscounts = (discounts.BOB ?? 0) > 0 || (discounts.USD ?? 0) > 0;

  return (
    <View className="mx-4 mt-3 mb-3 rounded-3xl bg-card border border-border/70 p-4 shadow-sm">
      <SectionHeader
        icon={<TrendingUp size={18} color={palette.azul} />}
        title="Ingresos del Mes"
        subtitle="Intereses cobrados por tus préstamos"
      />

      <View className="flex-row gap-3 mt-1">
        <View className="flex-1 bg-sky-500/5 dark:bg-sky-500/10 border border-sky-500/20 rounded-2xl p-3.5 justify-between">
          <View className="flex-row items-center justify-between mb-1.5">
            <Text className="text-sky-700 dark:text-sky-300 text-xs font-bold uppercase tracking-wider">
              Bolivianos
            </Text>
            <View className="px-2 py-0.5 rounded-md bg-sky-500/15 border border-sky-500/25">
              <Text className="text-sky-700 dark:text-sky-300 text-xs font-extrabold">Bs.-</Text>
            </View>
          </View>
          <Text numberOfLines={1} className="text-foreground font-extrabold text-2xl leading-tight">
            {formatAmountNumber(interest.BOB ?? 0)}
          </Text>
        </View>

        {hasUSD && (
          <View className="flex-1 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3.5 justify-between">
            <View className="flex-row items-center justify-between mb-1.5">
              <Text className="text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
                Dólares
              </Text>
              <View className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/25">
                <Text className="text-emerald-700 dark:text-emerald-300 text-xs font-extrabold">
                  $us
                </Text>
              </View>
            </View>
            <Text numberOfLines={1} className="text-emerald-600 dark:text-emerald-400 font-extrabold text-2xl leading-tight">
              {formatAmountNumber(interest.USD ?? 0)}
            </Text>
          </View>
        )}
      </View>

      <View className="flex-row gap-3 mt-3">
        <View className="flex-1 bg-muted/50 rounded-xl p-3">
          <Text className="text-muted-foreground text-xs font-bold uppercase tracking-wider">
            Capital recuperado
          </Text>
          <DualCurrencyAmount amount={capital} textClassName="text-foreground font-extrabold text-base" />
        </View>
        <View className="flex-1 bg-muted/50 rounded-xl p-3">
          <Text className="text-muted-foreground text-xs font-bold uppercase tracking-wider">
            Efectivo ingresado
          </Text>
          <DualCurrencyAmount amount={cashIn} textClassName="text-foreground font-extrabold text-base" />
        </View>
      </View>

      {hasDiscounts && (
        <View className="pt-3 mt-3 border-t border-border/60">
          <View className="flex-row items-center justify-between">
            <Text className="text-muted-foreground text-sm font-semibold">
              Condonaciones aplicadas
            </Text>
            <DualCurrencyAmount amount={discounts} />
          </View>
        </View>
      )}
    </View>
  );
}