import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { LoansSummary, ClientsSummary } from '@/types/dashboard';
import { Banknote, Users, AlertTriangle, CheckCircle2, UserCheck, UserX, UserMinus } from 'lucide-react-native';
import { palette } from '@/lib/theme/colors';

interface LoansClientsSummaryCardsProps {
  loansSummary: LoansSummary;
  clientsSummary: ClientsSummary;
}

export function LoansClientsSummaryCards({
  loansSummary,
  clientsSummary,
}: LoansClientsSummaryCardsProps) {
  const rate = loansSummary.delinquencyRate ?? 0;
  
  // Color dinámico para la mora
  const getRateBadgeStyle = (delinquency: number) => {
    if (delinquency >= 20) {
      return {
        bg: 'bg-red-500/10 border-red-500/30',
        text: 'text-red-600 dark:text-red-400',
        label: 'Mora Alta',
      };
    }
    if (delinquency >= 10) {
      return {
        bg: 'bg-amber-500/10 border-amber-500/30',
        text: 'text-amber-600 dark:text-amber-400',
        label: 'Mora Moderada',
      };
    }
    return {
      bg: 'bg-green-500/10 border-green-500/30',
      text: 'text-green-600 dark:text-green-400',
      label: 'Mora Baja',
    };
  };

  const rateBadge = getRateBadgeStyle(rate);

  return (
    <View className="mx-4 gap-4 mb-3">
      {/* ─── BLOQUE 1: PRÉSTAMOS ─── */}
      <View className="bg-card border border-border rounded-2xl p-4 shadow-sm">
        {/* Card Header */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center gap-2">
            <View className="w-8 h-8 rounded-xl bg-primary/10 items-center justify-center">
              <Banknote size={18} color={palette.azul} />
            </View>
            <Text className="text-foreground font-bold text-base">
              Estado de Préstamos
            </Text>
          </View>

          {/* Delinquency Rate Badge */}
          <View className={`flex-row items-center gap-1 px-2.5 py-0.5 rounded-full border ${rateBadge.bg}`}>
            <AlertTriangle size={11} className={rateBadge.text} />
            <Text className={`text-xs font-bold ${rateBadge.text}`}>
              Mora: {rate.toFixed(1)}%
            </Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View className="flex-row gap-2.5">
          {/* Activos */}
          <View className="flex-1 bg-muted/40 rounded-xl p-3 items-center border border-border/50">
            <Text className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider mb-0.5">
              Activos
            </Text>
            <Text className="text-foreground font-bold text-xl">
              {loansSummary.totalActive ?? 0}
            </Text>
          </View>

          {/* Al día */}
          <View className="flex-1 bg-green-500/5 rounded-xl p-3 items-center border border-green-500/20">
            <View className="flex-row items-center gap-1 mb-0.5">
              <CheckCircle2 size={10} color="#22c55e" />
              <Text className="text-green-700 dark:text-green-400 text-[10px] font-bold uppercase tracking-wider">
                Al Día
              </Text>
            </View>
            <Text className="text-green-600 dark:text-green-400 font-bold text-xl">
              {loansSummary.totalUpToDate ?? 0}
            </Text>
          </View>

          {/* En Mora */}
          <View className="flex-1 bg-red-500/5 rounded-xl p-3 items-center border border-red-500/20">
            <View className="flex-row items-center gap-1 mb-0.5">
              <AlertTriangle size={10} color="#ef4444" />
              <Text className="text-red-700 dark:text-red-400 text-[10px] font-bold uppercase tracking-wider">
                En Mora
              </Text>
            </View>
            <Text className="text-red-600 dark:text-red-400 font-bold text-xl">
              {loansSummary.totalDelinquent ?? 0}
            </Text>
          </View>
        </View>
      </View>

      {/* ─── BLOQUE 2: CLIENTES ─── */}
      <View className="bg-card border border-border rounded-2xl p-4 shadow-sm">
        {/* Card Header */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center gap-2">
            <View className="w-8 h-8 rounded-xl bg-secondary/10 items-center justify-center">
              <Users size={18} color={palette.celeste} />
            </View>
            <Text className="text-foreground font-bold text-base">
              Estado de Clientes
            </Text>
          </View>
          <View className="bg-muted px-2.5 py-0.5 rounded-full border border-border">
            <Text className="text-muted-foreground text-xs font-bold">
              {clientsSummary.totalClients ?? 0} clientes
            </Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View className="flex-row gap-2">
          {/* Al Día */}
          <View className="flex-1 bg-muted/40 rounded-xl p-2.5 items-center border border-border/50">
            <UserCheck size={14} color="#22c55e" className="mb-1" />
            <Text className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider mb-0.5">
              Al Día
            </Text>
            <Text className="text-foreground font-bold text-lg">
              {clientsSummary.currentClients ?? 0}
            </Text>
          </View>

          {/* En Mora */}
          <View className="flex-1 bg-muted/40 rounded-xl p-2.5 items-center border border-border/50">
            <UserX size={14} color="#ef4444" className="mb-1" />
            <Text className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider mb-0.5">
              En Mora
            </Text>
            <Text className="text-red-600 dark:text-red-400 font-bold text-lg">
              {clientsSummary.delinquentClients ?? 0}
            </Text>
          </View>

          {/* Sin Préstamo */}
          <View className="flex-1 bg-muted/40 rounded-xl p-2.5 items-center border border-border/50">
            <UserMinus size={14} color="#a1a1aa" className="mb-1" />
            <Text className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider mb-0.5">
              Sin Crédito
            </Text>
            <Text className="text-muted-foreground font-bold text-lg">
              {clientsSummary.noLoanClients ?? 0}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
