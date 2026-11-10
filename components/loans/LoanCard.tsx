import React from 'react';
import { View, Pressable, Image } from 'react-native';
import { Text } from '@/components/ui/text';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LoanListItem } from '@/types/loan';
import { formatCurrency, formatDateBO, getInitials } from '@/lib/format';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Calendar,
  Layers,
} from 'lucide-react-native';

interface LoanCardProps {
  item: LoanListItem;
  onPress: (item: LoanListItem) => void;
}

export function LoanCard({ item, onPress }: LoanCardProps) {
  const isCompleted = item.status === 'COMPLETED';
  const isDelinquent = item.isDelinquent && !isCompleted;
  const isUpToDate = !isDelinquent && !isCompleted;

  const progressPercent = item.totalInstallments > 0
    ? Math.min(Math.round((item.paidInstallments / item.totalInstallments) * 100), 100)
    : 0;

  return (
    <Pressable
      onPress={() => onPress(item)}
      className="bg-card border border-border rounded-2xl p-4 mb-3 shadow-sm active:bg-muted/40"
    >
      {/* ─── Encabezado: Cliente & Estado ─── */}
      <View className="flex-row items-center justify-between gap-2 mb-3">
        <View className="flex-row items-center gap-3 flex-1">
          {/* Avatar / Foto */}
          <Avatar alt={item.client.fullName} className="h-11 w-11 bg-primary/15 items-center justify-center shrink-0 rounded-full">
            {item.client.photoUrl ? (
              <Image
                source={{ uri: item.client.photoUrl }}
                className="w-full h-full rounded-full"
                resizeMode="cover"
              />
            ) : (
              <AvatarFallback className="bg-primary/15">
                <Text className="text-secondary font-bold text-sm">
                  {getInitials(item.client.fullName)}
                </Text>
              </AvatarFallback>
            )}
          </Avatar>

          {/* Nombre y C.I. */}
          <View className="flex-1 justify-center">
            <Text className="text-foreground font-bold text-base leading-tight" numberOfLines={1}>
              {item.client.fullName}
            </Text>
            <Text className="text-muted-foreground text-xs font-medium mt-0.5" numberOfLines={1}>
              CI: {item.client.idNumber || 'Sin C.I.'}
            </Text>
          </View>
        </View>

        {/* Badge de Estado */}
        {isCompleted ? (
          <View className="flex-row items-center gap-1 bg-slate-500/10 border border-slate-500/20 px-2 py-0.5 rounded-full shrink-0">
            <CheckCircle2 size={11} color="#64748b" />
            <Text className="text-slate-600 dark:text-slate-400 font-bold text-[11px] uppercase tracking-wider">
              Finalizado
            </Text>
          </View>
        ) : isDelinquent ? (
          <View className="flex-row items-center gap-1 bg-destructive/10 border border-destructive/20 px-2 py-0.5 rounded-full shrink-0">
            <AlertTriangle size={11} color="#ef4444" />
            <Text className="text-destructive font-bold text-[11px] uppercase tracking-wider">
              En Mora{item.overdueInstallmentsCount > 0 ? ` (${item.overdueInstallmentsCount})` : ''}
            </Text>
          </View>
        ) : (
          <View className="flex-row items-center gap-1 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full shrink-0">
            <CheckCircle2 size={11} color="#22c55e" />
            <Text className="text-green-600 dark:text-green-400 font-bold text-[11px] uppercase tracking-wider">
              Al Día
            </Text>
          </View>
        )}
      </View>

      {/* ─── Barra de Progreso de Cuotas ─── */}
      <View className="mb-3">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-muted-foreground text-xs font-medium">
            Cuotas: <Text className="text-foreground font-bold">{item.paidInstallments}</Text> de {item.totalInstallments}
          </Text>
          <Text className="text-muted-foreground text-xs font-semibold">
            {progressPercent}%
          </Text>
        </View>
        <View className="h-1.5 bg-muted rounded-full overflow-hidden">
          <View
            style={{ width: `${progressPercent}%` }}
            className={`h-full rounded-full ${
              isCompleted
                ? 'bg-slate-500'
                : isDelinquent
                ? 'bg-destructive'
                : 'bg-green-500'
            }`}
          />
        </View>
      </View>

      {/* ─── Cifras Financieras ─── */}
      <View className="flex-row items-center justify-between bg-muted/30 border border-border/50 rounded-xl p-2.5 mb-2.5">
        <View>
          <Text className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
            Capital Prestado
          </Text>
          <Text className="text-foreground font-bold text-sm mt-0.5">
            {formatCurrency(item.capitalAmount, item.currency)}
          </Text>
        </View>

        <View className="items-end">
          <Text className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
            Saldo Pendiente
          </Text>
          <Text className="text-secondary font-bold text-base mt-0.5">
            {formatCurrency(item.outstandingBalance, item.currency)}
          </Text>
        </View>
      </View>

      {/* ─── Footer: Próximo Vencimiento & Flecha ─── */}
      <View className="flex-row items-center justify-between pt-1">
        <View className="flex-row items-center gap-1.5">
          <Calendar size={13} color="#64748b" />
          <Text className="text-muted-foreground text-xs font-medium">
            {isCompleted
              ? 'Préstamo liquidado'
              : item.nextDueDate
              ? `Próx. vencimiento: ${formatDateBO(item.nextDueDate)}`
              : 'Sin cuotas pendientes'}
          </Text>
        </View>

        <View className="flex-row items-center gap-1">
          <Text className="text-secondary font-bold text-xs">
            Ver detalle
          </Text>
          <ChevronRight size={14} color="#24b2cd" />
        </View>
      </View>
    </Pressable>
  );
}

