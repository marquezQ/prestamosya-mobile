import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { LoanProgressBar } from './LoanProgressBar';
import { ActiveLoanSummary, LoanStatus } from '@/types/client';
import { Plus, CheckCircle2, AlertCircle, Clock, CalendarDays } from 'lucide-react-native';
import { palette } from '@/lib/theme/colors';

// ─────────────────────────────────────────────────────────────────────────────
// Status configuration
// ─────────────────────────────────────────────────────────────────────────────

type StatusConfig = {
  label: string;
  /** bg class for the pill */
  pillBg: string;
  /** text class for pill label */
  pillText: string;
  /** left accent bar class */
  accentBar: string;
  /** hex color for Lucide icon */
  iconColor: string;
  Icon: React.ComponentType<{ size: number; color: string }>;
};

function getStatusConfig(status: LoanStatus): StatusConfig {
  switch (status) {
    case 'OVERDUE':
      return {
        label: 'Vencido',
        pillBg: 'bg-destructive/10',
        pillText: 'text-red-600 dark:text-red-400',
        accentBar: 'bg-destructive',
        iconColor: '#ef4444',
        Icon: AlertCircle,
      };
    case 'COMPLETED':
      return {
        label: 'Completado',
        pillBg: 'bg-green-100 dark:bg-green-900/30',
        pillText: 'text-green-700 dark:text-green-400',
        accentBar: 'bg-accent',
        iconColor: '#22c55e',
        Icon: CheckCircle2,
      };
    case 'IN_PROGRESS':
    default:
      return {
        label: 'Pendiente',
        pillBg: 'bg-primary/15',
        pillText: 'text-secondary dark:text-primary',
        accentBar: 'bg-secondary',
        iconColor: palette.azul,
        Icon: Clock,
      };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Schedule builder
// ─────────────────────────────────────────────────────────────────────────────

interface ScheduleRow {
  number: number;
  date: string;
  amount: number;
  isPaid: boolean;
}

function buildScheduleRows(loan: ActiveLoanSummary): ScheduleRow[] {
  const baseDate = new Date(loan.nextPaymentDate);
  const firstDueDate = new Date(baseDate);

  if (loan.frequency === 'Semanal') {
    firstDueDate.setDate(firstDueDate.getDate() - loan.paidInstallments * 7);
  } else if (loan.frequency === 'Quincenal') {
    firstDueDate.setDate(firstDueDate.getDate() - loan.paidInstallments * 15);
  } else {
    firstDueDate.setMonth(firstDueDate.getMonth() - loan.paidInstallments);
  }

  return Array.from({ length: loan.totalInstallments }, (_, i) => {
    const dueDate = new Date(firstDueDate);
    if (loan.frequency === 'Semanal') {
      dueDate.setDate(firstDueDate.getDate() + i * 7);
    } else if (loan.frequency === 'Quincenal') {
      dueDate.setDate(firstDueDate.getDate() + i * 15);
    } else {
      dueDate.setMonth(firstDueDate.getMonth() + i);
    }
    return {
      number: i + 1,
      date: dueDate.toLocaleDateString('es-BO', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      amount: loan.installmentAmount,
      isPaid: i < loan.paidInstallments,
    };
  });
}

function formatLoanId(id: string): string {
  const numeric = id.replace(/\D/g, '');
  return numeric ? `#${numeric}` : `#${id}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

interface LoanAccordionCardProps {
  loan: ActiveLoanSummary;
}

export function LoanAccordionCard({ loan }: LoanAccordionCardProps) {
  const sc = getStatusConfig(loan.status);
  const amountPaid = loan.paidInstallments * loan.installmentAmount;
  const remaining = Math.max(0, loan.totalDebt - amountPaid);
  const progressPct = Math.round((loan.paidInstallments / loan.totalInstallments) * 100);
  const totalInterest = loan.totalDebt - loan.totalAmount;
  const scheduleRows = buildScheduleRows(loan);

  return (
    <View className="mx-4 mb-4 rounded-2xl overflow-hidden bg-card border border-border shadow-sm">
      <Accordion type="single" collapsible>
        <AccordionItem value={loan.id} className="border-b-0">

          {/* ── Trigger ── */}
          <AccordionTrigger className="px-4 py-3.5">
            <View className="flex-1 flex-row items-center gap-3">
              {/* Left: ID + type */}
              <View className="flex-1">
                <Text className="text-foreground font-bold text-lg leading-snug">
                  Préstamo {formatLoanId(loan.id)}
                </Text>
                <Text className="text-muted-foreground text-sm font-medium mt-0.5">
                  {loan.type}
                </Text>
              </View>

              {/* Right: status pill */}
              <View className={`flex-row items-center gap-1.5 px-3 py-1 rounded-full ${sc.pillBg}`}>
                <sc.Icon size={12} color={sc.iconColor} />
                <Text className={`text-xs font-bold ${sc.pillText}`}>
                  {sc.label}
                </Text>
              </View>
            </View>
          </AccordionTrigger>

          {/* ── Body (expanded) ── */}
          <AccordionContent className="px-5 pb-5 pt-0">

            {/* ── Amount hero ── */}
            <View className="bg-secondary/5 border border-secondary/15 rounded-xl px-4 py-3.5 mb-4">
              <Text className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-1">
                Deuda Total
              </Text>
              <View className="flex-row items-baseline gap-1.5 mb-2.5">
                <Text className="text-2xl font-bold text-secondary">
                  Bs.- {amountPaid.toFixed(0)}
                </Text>
                <Text className="text-muted-foreground text-sm font-medium">
                  / {loan.totalAmount.toFixed(0)}
                </Text>
              </View>
              <LoanProgressBar
                paid={loan.paidInstallments}
                total={loan.totalInstallments}
                className="mb-2"
              />
              <View className="flex-row justify-between items-center">
                <Text className="text-muted-foreground text-xs font-medium">
                  {loan.paidInstallments} de {loan.totalInstallments} cuotas pagadas
                </Text>
                <Text className="text-secondary font-bold text-xs">
                  {progressPct}%
                </Text>
              </View>
            </View>

            {/* ── Quick stats row ── */}
            <View className="flex-row gap-3 mb-4">
              <View className="flex-1 bg-muted/60 rounded-xl px-3 py-2.5">
                <Text className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-0.5">
                  Cuota
                </Text>
                <Text className="text-foreground font-bold text-base">
                  Bs.- {loan.installmentAmount.toFixed(0)}
                </Text>
                <Text className="text-muted-foreground text-xs mt-0.5 font-medium">
                  {loan.frequency}
                </Text>
              </View>
              <View className="flex-1 bg-muted/60 rounded-xl px-3 py-2.5">
                <Text className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-0.5">
                  Restante
                </Text>
                <Text className="text-foreground font-bold text-base">
                  Bs.- {remaining.toFixed(0)}
                </Text>
                <Text className="text-muted-foreground text-xs mt-0.5 font-medium">
                  {loan.totalInstallments - loan.paidInstallments} cuotas
                </Text>
              </View>
            </View>

            {/* ── Schedule table ── */}
            <View className="rounded-xl overflow-hidden border border-border mb-4">
              {/* Table header */}
              <View className="flex-row items-center px-4 py-2.5 bg-muted/80">
                <View className="w-9 items-center">
                  <Text className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    #
                  </Text>
                </View>
                <View className="flex-1 flex-row items-center gap-1.5">
                  <CalendarDays size={11} color={palette.azul} />
                  <Text className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Fecha
                  </Text>
                </View>
                <Text className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Monto
                </Text>
              </View>

              {/* Rows */}
              {scheduleRows.map((row, idx) => (
                <View
                  key={row.number}
                  className={`flex-row items-center px-4 py-3 ${
                    idx < scheduleRows.length - 1 ? 'border-b border-border/60' : ''
                  } ${row.isPaid ? 'bg-muted/30' : 'bg-card'}`}
                >
                  {/* Number / check */}
                  <View className="w-9 items-center">
                    {row.isPaid ? (
                      <CheckCircle2 size={16} color="#22c55e" />
                    ) : (
                      <View className="w-5 h-5 rounded-full border border-border items-center justify-center">
                        <Text className="text-foreground text-xs font-bold">
                          {row.number}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Date */}
                  <Text
                    className={`flex-1 text-sm font-medium ${
                      row.isPaid ? 'text-muted-foreground line-through' : 'text-foreground'
                    }`}
                  >
                    {row.date}
                  </Text>

                  {/* Amount */}
                  <Text
                    className={`text-sm font-bold ${
                      row.isPaid ? 'text-muted-foreground' : 'text-foreground'
                    }`}
                  >
                    Bs.- {row.amount.toFixed(2)}
                  </Text>
                </View>
              ))}

              {/* Footer totals */}
              <View className="bg-muted/60 px-4 pt-2.5 pb-2.5 gap-1.5 border-t border-border">
                <View className="flex-row justify-between items-center">
                  <Text className="text-sm text-muted-foreground font-medium">
                    Total intereses:
                  </Text>
                  <Text className="text-sm font-semibold text-foreground">
                    {totalInterest > 0 ? `Bs.- ${totalInterest.toFixed(2)}` : '—'}
                  </Text>
                </View>
                <View className="flex-row justify-between items-center pt-1 border-t border-border/60">
                  <Text className="text-sm font-bold text-foreground">Total a pagar:</Text>
                  <Text className="text-base font-bold text-secondary">
                    Bs.- {loan.totalDebt.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>

            {/* ── CTA ── */}
            <Button className="w-full bg-secondary active:bg-secondary/80 flex-row gap-2 h-14 rounded-xl">
              <Plus size={20} color="#ffffff" />
              <Text className="text-white font-bold text-lg">Registrar pago</Text>
            </Button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </View>
  );
}
