import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { SectionHeader } from './SectionHeader';
import { SectionTag } from './SectionTag';
import { DualCurrencyAmount } from './DualCurrencyAmount';
import { LoanProgressBar } from '@/components/client-detail/LoanProgressBar';
import { PerformanceSummary } from '@/types/stats';
import { Gauge } from 'lucide-react-native';
import { palette } from '@/lib/theme/colors';

interface PerformanceCardProps {
  performance: PerformanceSummary;
}

function RateRow({ label, value }: { label: string; value: number }) {
  const safeValue = value ?? 0;
  return (
    <View className="mb-3">
      <View className="flex-row items-center justify-between mb-1.5">
        <Text className="text-muted-foreground text-sm font-semibold">{label}</Text>
        <Text className="text-foreground font-bold text-sm">{(safeValue).toFixed(1)}%</Text>
      </View>
      <LoanProgressBar paid={safeValue} total={100} className="h-2.5" />
    </View>
  );
}

function CountRow({
  dotClassName,
  label,
  value,
}: {
  dotClassName: string;
  label: string;
  value: number;
}) {
  return (
    <View className="flex-row items-center justify-between py-1.5">
      <View className="flex-row items-center gap-2.5 flex-1">
        <View className={`w-2.5 h-2.5 rounded-full ${dotClassName}`} />
        <Text className="text-foreground text-sm font-semibold flex-1">{label}</Text>
      </View>
      <Text className="text-foreground font-bold text-sm">{value ?? 0}</Text>
    </View>
  );
}

export function PerformanceCard({ performance }: PerformanceCardProps) {
  const p = performance ?? ({} as PerformanceSummary);

  return (
    <View className="mx-4 mb-3 bg-card border border-border rounded-2xl p-4 shadow-sm">
      <SectionHeader
        icon={<Gauge size={18} color={palette.azul} />}
        title="Resumen de Rendimiento"
        subtitle="performanceSummary"
        right={<SectionTag kind="month" />}
      />

      <View className="flex-row items-center justify-between py-2 border-b border-border/50">
        <Text className="text-muted-foreground text-sm font-semibold">Ingresos esperados</Text>
        <DualCurrencyAmount amount={p.expectedRevenue ?? { BOB: 0, USD: 0 }} />
      </View>
      <View className="flex-row items-center justify-between py-2 mb-3 border-b border-border/50">
        <Text className="text-muted-foreground text-sm font-semibold">Ingresos reales</Text>
        <DualCurrencyAmount amount={p.actualRevenue ?? { BOB: 0, USD: 0 }} />
      </View>

      <RateRow label="Tasa de cobranza" value={p.collectionRate ?? 0} />
      <RateRow label="Eficiencia de ingresos" value={p.revenueEfficiency ?? 0} />

      <View className="border-t border-border/50 pt-2">
        <Text className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-1">
          Cuotas del período: {p.installmentsDueCount ?? 0}
        </Text>
        <CountRow
          dotClassName="bg-green-500"
          label="Pagadas a tiempo"
          value={p.installmentsPaidOnTimeCount ?? 0}
        />
        <CountRow
          dotClassName="bg-amber-500"
          label="Pagadas con atraso"
          value={p.installmentsPaidLateCount ?? 0}
        />
        <CountRow
          dotClassName="bg-red-500"
          label="Aún vencidas"
          value={p.installmentsStillOverdueCount ?? 0}
        />
        <CountRow
          dotClassName="bg-sky-500"
          label="Parciales"
          value={p.installmentsPartialCount ?? 0}
        />
      </View>
    </View>
  );
}