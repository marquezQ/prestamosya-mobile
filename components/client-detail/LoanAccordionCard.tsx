import React, { useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { LoanProgressBar } from './LoanProgressBar';
import { ClientLoanSummary } from '@/types/client';
import { useLoanById } from '@/hooks/useLoanById';
import { Plus, CheckCircle2, AlertCircle, Clock, CalendarDays, RefreshCw, Banknote, BadgeCheck } from 'lucide-react-native';
import { palette } from '@/lib/theme/colors';
import { formatDateBO } from '@/lib/format';
import { RegisterPaymentModal } from '../collections/RegisterPaymentModal';
import { SettleLoanModal } from '../collections/SettleLoanModal';
import { SettleLoanResponseData } from '@/types/payment';

// ─────────────────────────────────────────────────────────────────────────────
// Period label translator
// ─────────────────────────────────────────────────────────────────────────────

function getPeriodLabel(periodType: string): string {
  switch (periodType?.toLowerCase()) {
    case 'daily':
      return 'Diario';
    case 'weekly':
      return 'Semanal';
    case 'fortnightly':
      return 'Quincenal';
    case 'monthly':
      return 'Mensual';
    case 'custom':
      return 'Personalizado';
    default:
      return periodType || 'Cuotas';
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Status configuration
// ─────────────────────────────────────────────────────────────────────────────

function getStatusConfig(status: string) {
  switch (status) {
    case 'OVERDUE':
    case 'DEFAULTED':
      return {
        label: 'En mora',
        pillBg: 'bg-red-500/10',
        pillText: 'text-red-600 dark:text-red-400',
        iconColor: '#ef4444',
        Icon: AlertCircle,
      };
    case 'COMPLETED':
    case 'PAID':
      return {
        label: 'Completado',
        pillBg: 'bg-green-500/10',
        pillText: 'text-green-600 dark:text-green-400',
        iconColor: '#22c55e',
        Icon: CheckCircle2,
      };
    case 'ACTIVE':
    default:
      return {
        label: 'Activo',
        pillBg: 'bg-primary/15',
        pillText: 'text-secondary dark:text-primary',
        iconColor: palette.azul,
        Icon: Clock,
      };
  }
}

function formatLoanId(id: string): string {
  const numeric = id.replace(/\D/g, '');
  return numeric ? `#${numeric.slice(-4)}` : `#${id.slice(0, 6)}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

interface LoanAccordionCardProps {
  loan: ClientLoanSummary;
  clientPhone?: string;
}

export function LoanAccordionCard({ loan, clientPhone = '' }: LoanAccordionCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSettleModalOpen, setIsSettleModalOpen] = useState(false);
  const sc = getStatusConfig(loan.status);

  // Fetch loan detail on demand when accordion is opened
  const { data: loanDetail, isLoading, isError, refetch } = useLoanById(loan.id, isOpen);

  const periodLabel = getPeriodLabel(loan.periodType);
  const quickPaid = loan.totalPaid ?? 0;
  const quickTotal = loan.totalAmount ?? 1;
  const quickProgress = Math.min(Math.round((quickPaid / quickTotal) * 100), 100);

  const nextPendingInstallment = loanDetail?.installments.find(
    (ins) => ins.status === 'PENDING' || ins.status === 'OVERDUE' || ins.status === 'PARTIAL'
  );
  const defaultAmount = nextPendingInstallment
    ? nextPendingInstallment.totalAmount - nextPendingInstallment.paidAmount
    : loanDetail?.loan.outstandingBalance ?? 0;

  const isLoanActive =
    (loanDetail?.loan.status ?? loan.status) === 'ACTIVE' &&
    (loanDetail?.loan.outstandingBalance ?? loan.outstandingBalance ?? 0) > 0;

  const handleLoanSettled = (_result: SettleLoanResponseData) => {
    // Las queries se invalidan en el hook; el acordeón se refresca solo.
    setIsSettleModalOpen(false);
  };

  return (
    <View className="mx-4 mb-3 rounded-2xl overflow-hidden bg-card border border-border shadow-sm">
      <Accordion
        type="single"
        collapsible
        onValueChange={(val?: string) => setIsOpen(val === loan.id)}
      >
        <AccordionItem value={loan.id} className="border-b-0">

          {/* ── Trigger / Header ── */}
          <AccordionTrigger className="px-4 py-3.5">
            <View className="flex-1 flex-row items-center gap-3">
              <View className="flex-1">
                <Text className="text-foreground font-bold text-lg leading-snug">
                  Préstamo {formatLoanId(loan.id)}
                </Text>
                <Text className="text-muted-foreground text-sm font-medium mt-0.5">
                  {periodLabel} • {loan.totalInstallments} cuotas
                </Text>
              </View>

              {/* Status Pill */}
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

            {/* ── Loader State ── */}
            {isLoading && (
              <View className="py-8 items-center justify-center">
                <ActivityIndicator size="small" color={palette.azul} />
                <Text className="text-muted-foreground text-xs font-semibold mt-3">
                  Cargando cronograma...
                </Text>
              </View>
            )}

            {/* ── Error State ── */}
            {isError && !isLoading && (
              <View className="py-6 items-center justify-center">
                <Text className="text-destructive font-bold text-sm mb-2 text-center">
                  No se pudo cargar el detalle del préstamo
                </Text>
                <Button
                  variant="outline"
                  onPress={() => refetch()}
                  className="h-9 px-4 rounded-xl flex-row items-center gap-2"
                >
                  <RefreshCw size={14} color={palette.azul} />
                  <Text className="text-xs font-bold text-secondary">Reintentar</Text>
                </Button>
              </View>
            )}

            {/* ── Content Loaded ── */}
            {!isLoading && !isError && (
              <View className="pt-2">

                {/* Amount hero */}
                <View className="bg-secondary/5 border border-secondary/15 rounded-xl px-4 py-3.5 mb-4">
                  <Text className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-1">
                    Deuda Total
                  </Text>
                  <View className="flex-row items-baseline gap-1.5 mb-2.5">
                    <Text className="text-2xl font-bold text-secondary">
                      Bs.- {(loanDetail?.loan.totalPaid ?? quickPaid).toFixed(2)}
                    </Text>
                    <Text className="text-muted-foreground text-sm font-medium">
                      / {(loanDetail?.loan.totalAmount ?? quickTotal).toFixed(2)}
                    </Text>
                  </View>

                  <LoanProgressBar
                    paid={loanDetail?.loan.totalPaid ?? quickPaid}
                    total={loanDetail?.loan.totalAmount ?? quickTotal}
                    className="mb-2"
                  />

                  <View className="flex-row justify-between items-center">
                    <Text className="text-muted-foreground text-xs font-medium">
                      Progreso de pago
                    </Text>
                    <Text className="text-secondary font-bold text-xs">
                      {loanDetail?.loan
                        ? Math.min(Math.round((loanDetail.loan.totalPaid / loanDetail.loan.totalAmount) * 100), 100)
                        : quickProgress}%
                    </Text>
                  </View>
                </View>

                {/* Quick stats row */}
                <View className="flex-row gap-3 mb-4">
                  <View className="flex-1 bg-muted/60 rounded-xl px-3 py-2.5">
                    <Text className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-0.5">
                      Capital
                    </Text>
                    <Text className="text-foreground font-bold text-base">
                      Bs.- {(loanDetail?.loan.capitalAmount ?? loan.capitalAmount ?? 0).toFixed(0)}
                    </Text>
                    <Text className="text-muted-foreground text-xs mt-0.5 font-medium">
                      Interés: {loanDetail?.loan.interestRate ?? loan.interestRate}%
                    </Text>
                  </View>

                  <View className="flex-1 bg-muted/60 rounded-xl px-3 py-2.5">
                    <Text className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-0.5">
                      Saldo Restante
                    </Text>
                    <Text className="text-foreground font-bold text-base">
                      Bs.- {Math.max(0, loanDetail?.loan.outstandingBalance ?? loan.outstandingBalance ?? 0).toFixed(2)}
                    </Text>
                    <Text className="text-muted-foreground text-xs mt-0.5 font-medium">
                      {loan.totalInstallments} cuotas totales
                    </Text>
                  </View>
                </View>

                {/* Schedule Table */}
                {loanDetail?.installments && loanDetail.installments.length > 0 && (
                  <View className="rounded-xl overflow-hidden border border-border mb-4">
                    {/* Header */}
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
                    {loanDetail.installments.map((inst, idx) => {
                      const isPaid = inst.status === 'PAID';

                      return (
                        <View
                          key={inst.id || idx}
                          className={`flex-row items-center px-4 py-3 ${
                            idx < loanDetail.installments.length - 1 ? 'border-b border-border/60' : ''
                          } ${isPaid ? 'bg-muted/30' : 'bg-card'}`}
                        >
                          {/* Installment Number / Check */}
                          <View className="w-9 items-center">
                            {isPaid ? (
                              <CheckCircle2 size={16} color="#22c55e" />
                            ) : (
                              <View className="w-5 h-5 rounded-full border border-border items-center justify-center">
                                <Text className="text-foreground text-xs font-bold">
                                  {inst.installmentNumber}
                                </Text>
                              </View>
                            )}
                          </View>

                          {/* Date */}
                          <Text
                            className={`flex-1 text-sm font-medium ${
                              isPaid ? 'text-muted-foreground line-through' : 'text-foreground'
                            }`}
                          >
                            {formatDateBO(inst.dueDate, "d 'de' MMM, yyyy")}
                          </Text>

                          {/* Amount */}
                          <Text
                            className={`text-sm font-bold ${
                              isPaid ? 'text-muted-foreground' : 'text-foreground'
                            }`}
                          >
                            Bs.- {inst.totalAmount.toFixed(2)}
                          </Text>
                        </View>
                      );
                    })}

                    {/* Table Footer */}
                    <View className="bg-muted/60 px-4 pt-2.5 pb-2.5 gap-1.5 border-t border-border">
                      <View className="flex-row justify-between items-center">
                        <Text className="text-sm text-muted-foreground font-medium">
                          Monto total del crédito:
                        </Text>
                        <Text className="text-sm font-semibold text-foreground">
                          Bs.- {loanDetail.loan.totalAmount.toFixed(2)}
                        </Text>
                      </View>
                      <View className="flex-row justify-between items-center pt-1 border-t border-border/60">
                        <Text className="text-sm font-bold text-foreground">Saldo pendiente:</Text>
                        <Text className="text-base font-bold text-secondary">
                          Bs.- {Math.max(0, loanDetail.loan.outstandingBalance).toFixed(2)}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}

                {/* CTA */}
                <Button
                  onPress={() => setIsPaymentModalOpen(true)}
                  disabled={!isLoanActive}
                  className="w-full bg-secondary active:bg-secondary/80 flex-row gap-2 h-14 rounded-xl"
                >
                  <Banknote size={20} color="#ffffff" />
                  <Text className="text-white font-bold text-lg">Registrar pago</Text>
                </Button>

                {isLoanActive && (
                  <Button
                    variant="outline"
                    onPress={() => setIsSettleModalOpen(true)}
                    className="w-full h-12 rounded-xl flex-row gap-2 border-secondary/40 active:bg-secondary/10 mt-2"
                  >
                    <BadgeCheck size={18} color="#2368A3" />
                    <Text className="text-secondary font-bold text-base">Liquidar Préstamo</Text>
                  </Button>
                )}

                {/* Payment Modal */}
                {loanDetail && (
                  <RegisterPaymentModal
                    isOpen={isPaymentModalOpen}
                    onClose={() => setIsPaymentModalOpen(false)}
                    loanId={loan.id}
                    clientName={loanDetail.loan.clientName}
                    clientPhone={clientPhone}
                    installments={loanDetail.installments}
                    defaultAmount={defaultAmount}
                  />
                )}

                {/* Settle Modal */}
                {loanDetail && (
                  <SettleLoanModal
                    isOpen={isSettleModalOpen}
                    onClose={() => setIsSettleModalOpen(false)}
                    loanId={loan.id}
                    clientName={loanDetail.loan.clientName}
                    clientPhone={clientPhone}
                    outstandingBalance={loanDetail.loan.outstandingBalance}
                    onSettleSuccess={handleLoanSettled}
                  />
                )}
              </View>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </View>
  );
}
