import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { CapitalEnCalle } from '@/types/dashboard';
import { formatAmountNumber } from '@/lib/format';
import { Wallet, TrendingUp } from 'lucide-react-native';
import { palette } from '@/lib/theme/colors';

interface OutstandingCapitalCardProps {
  capital: CapitalEnCalle;
}

export function OutstandingCapitalCard({ capital }: OutstandingCapitalCardProps) {
  const hasUSD = (capital.USD ?? 0) > 0;

  return (
    <View className="mx-4 my-3 rounded-3xl bg-card border border-border/70 p-4 shadow-sm">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-3.5">
        <View className="flex-row items-center gap-3">
          <View className="w-10 h-10 rounded-2xl bg-secondary/10 items-center justify-center border border-secondary/20">
            <Wallet size={20} color={palette.azul} />
          </View>
          <View>
            <Text className="text-foreground font-bold text-base leading-snug">
              Capital en Calle
            </Text>
            <Text className="text-muted-foreground text-xs font-medium mt-0.5">
              Inversión activa en préstamos
            </Text>
          </View>
        </View>

        <View className="bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full flex-row items-center gap-1">
          <TrendingUp size={12} color="#10b981" />
          <Text className="text-emerald-600 dark:text-emerald-400 text-[11px] font-bold">
            Activo
          </Text>
        </View>
      </View>

      {/* Main Figures Row */}
      <View className="flex-row gap-3">
        {/* BOB Card */}
        <View className="flex-1 bg-sky-500/5 dark:bg-sky-500/10 border border-sky-500/20 rounded-2xl p-3.5 justify-between">
          <View className="flex-row items-center justify-between mb-1.5">
            <Text className="text-sky-700 dark:text-sky-300 text-xs font-bold uppercase tracking-wider">
              Bolivianos
            </Text>
            <View className="px-2 py-0.5 rounded-md bg-sky-500/15 border border-sky-500/25">
              <Text className="text-sky-700 dark:text-sky-300 text-[10px] font-extrabold">
                Bs.-
              </Text>
            </View>
          </View>
          <Text
            numberOfLines={1}
            className="text-foreground font-extrabold text-2xl leading-tight"
          >
            {formatAmountNumber(capital.BOB ?? 0)}
          </Text>
        </View>

        {/* USD Card */}
        {hasUSD && (
          <View className="flex-1 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3.5 justify-between">
            <View className="flex-row items-center justify-between mb-1.5">
              <Text className="text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
                Dólares
              </Text>
              <View className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/25">
                <Text className="text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold">
                  $us
                </Text>
              </View>
            </View>
            <Text
              numberOfLines={1}
              className="text-emerald-600 dark:text-emerald-400 font-extrabold text-2xl leading-tight"
            >
              {formatAmountNumber(capital.USD ?? 0)}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
