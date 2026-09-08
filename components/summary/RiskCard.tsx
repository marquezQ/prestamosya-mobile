import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { SectionHeader } from './SectionHeader';
import { DualCurrencyAmount } from './DualCurrencyAmount';
import { StatCell } from './StatCell';
import { RiskIndicators } from '@/types/stats';
import { ShieldAlert } from 'lucide-react-native';
import { palette } from '@/lib/theme/colors';

interface RiskCardProps {
  risk: RiskIndicators;
}

function getDelinquencyBadge(rate: number) {
  if (rate >= 20) {
    return {
      badge: 'bg-red-500/10 border-red-500/30',
      text: 'text-red-600 dark:text-red-400',
      label: 'Mora Alta',
    };
  }
  if (rate >= 10) {
    return {
      badge: 'bg-amber-500/10 border-amber-500/30',
      text: 'text-amber-600 dark:text-amber-400',
      label: 'Mora Moderada',
    };
  }
  return {
    badge: 'bg-green-500/10 border-green-500/30',
    text: 'text-green-600 dark:text-green-400',
    label: 'Mora Baja',
  };
}

export function RiskCard({ risk }: RiskCardProps) {
  const r = risk ?? ({} as RiskIndicators);
  const delinquency = getDelinquencyBadge(r.delinquencyRate ?? 0);

  return (
    <View className="mx-4 mb-3 bg-card border border-border rounded-2xl p-4 shadow-sm">
      <SectionHeader
        icon={<ShieldAlert size={18} color={palette.azul} />}
        title="Riesgo del Mes"
        subtitle="Préstamos impagos y actividad del mes"
        right={
          <View
            className={`flex-row items-center gap-1 px-2.5 py-0.5 rounded-full border ${delinquency.badge}`}
          >
            <Text className={`text-xs font-bold ${delinquency.text}`}>
              {delinquency.label} {(r.delinquencyRate ?? 0).toFixed(1)}%
            </Text>
          </View>
        }
      />

      <View className="flex-row items-center justify-between py-2 border-b border-border/50">
        <Text className="text-muted-foreground text-sm font-semibold">Dinero en riesgo</Text>
        <DualCurrencyAmount amount={r.portfolioAtRisk ?? { BOB: 0, USD: 0 }} />
      </View>

      <View className="flex-row items-center justify-between py-2 border-b border-border/50">
        <Text className="text-muted-foreground text-sm font-semibold">Préstamos en mora</Text>
        <Text className="text-red-600 dark:text-red-400 font-extrabold text-base">
          {r.overdueLoansCount ?? 0}
        </Text>
      </View>

      <View className="flex-row items-center justify-between py-2 border-b border-border/50">
        <Text className="text-muted-foreground text-sm font-semibold">Capital de préstamos nuevos</Text>
        <DualCurrencyAmount amount={r.newLoansCapital ?? { BOB: 0, USD: 0 }} />
      </View>

      <View className="flex-row gap-2.5 mt-3">
        <StatCell label="Nuevos préstamos" value={r.newLoansCount ?? 0} valueClassName="text-blue-600 dark:text-blue-400" />
        <StatCell label="Finalizados" value={r.completedLoansCount ?? 0} valueClassName="text-foreground" />
        <StatCell label="Clientes nuevos" value={r.newClientsCount ?? 0} valueClassName="text-emerald-600 dark:text-emerald-400" />
      </View>
    </View>
  );
}