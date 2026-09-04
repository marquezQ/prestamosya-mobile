import React, { useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { CheckCircle2, CalendarCheck, Banknote, RefreshCw } from 'lucide-react-native';
import { ClientLoanSummary } from '@/types/client';
import { Currency } from '@/types/loan';
import { useLoanById } from '@/hooks/useLoanById';
import { Button } from '@/components/ui/button';
import { palette } from '@/lib/theme/colors';
import { formatDateBO, formatCurrency } from '@/lib/format';

interface CompletedLoanAccordionCardProps {
  loan: ClientLoanSummary;
}

function formatLoanId(id: string): string {
  const numeric = id.replace(/\D/g, '');
  return numeric ? `#${numeric.slice(-4)}` : `#${id.slice(0, 6)}`;
}

export function CompletedLoanAccordionCard({ loan }: CompletedLoanAccordionCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: loanDetail, isLoading, isError, refetch } = useLoanById(loan.id, isOpen);
  const currency: Currency = (loanDetail?.loan.currency ?? loan.currency ?? 'BOB') as Currency;

  const startDateStr = loanDetail?.loan.startDate || loan.startDate;
  const formattedDate = startDateStr
    ? formatDateBO(startDateStr, "d 'de' MMMM, yyyy")
    : '—';

  return (
    <View className="mx-4 mb-3 rounded-2xl overflow-hidden bg-card border border-border shadow-sm">
      <Accordion
        type="single"
        collapsible
        onValueChange={(val?: string) => setIsOpen(val === loan.id)}
      >
        <AccordionItem value={loan.id} className="border-b-0">

          {/* ── Trigger ── */}
          <AccordionTrigger className="px-4 py-3.5">
            <View className="flex-1 flex-row items-center gap-3">
              <View className="flex-1">
                <Text className="text-foreground font-bold text-lg leading-snug">
                  Préstamo {formatLoanId(loan.id)}
                </Text>
                <Text className="text-muted-foreground text-sm font-medium mt-0.5">
                  Préstamo finalizado
                </Text>
              </View>
              <View className="flex-row items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10">
                <CheckCircle2 size={12} color="#22c55e" />
                <Text className="text-xs font-bold text-green-600 dark:text-green-400">
                  Completado
                </Text>
              </View>
            </View>
          </AccordionTrigger>

          {/* ── Body (expanded) ── */}
          <AccordionContent className="px-0 pb-5 pt-0">

            {/* Loader */}
            {isLoading && (
              <View className="py-8 items-center justify-center">
                <ActivityIndicator size="small" color={palette.azul} />
                <Text className="text-muted-foreground text-xs font-semibold mt-3">
                  Cargando detalle del préstamo...
                </Text>
              </View>
            )}

            {/* Error */}
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

            {/* ── Content ── */}
            {!isLoading && !isError && loanDetail && (
              <View className="pt-3 gap-5">

                {/* ─── Hero: Capital vs Intereses vs Total ─── */}
                <View className="mx-4 rounded-2xl overflow-hidden border border-border">
                  {/* Cabecera del bloque */}
                  <View className="flex-row items-center gap-2.5 px-4 pt-3.5 pb-3 bg-green-500/8 dark:bg-green-900/20 border-b border-border/60">
                    <View className="bg-green-100 dark:bg-green-800/40 rounded-full p-1.5">
                      <CheckCircle2 size={16} color="#22c55e" />
                    </View>
                    <View>
                      <Text className="text-sm font-bold text-green-800 dark:text-green-300">
                        Préstamo saldado en su totalidad
                      </Text>
                      <Text className="text-xs text-muted-foreground font-medium mt-0.5">
                        Inicio: {formattedDate}
                      </Text>
                    </View>
                  </View>

                  {/* Fila: Capital prestado */}
                  <View className="flex-row items-center justify-between px-4 py-3 border-b border-border/60 bg-card">
                    <View className="flex-row items-center gap-2.5">
                      <View className="w-7 h-7 rounded-full bg-secondary/10 items-center justify-center">
                        <Banknote size={14} color={palette.azul} />
                      </View>
                      <View>
                        <Text className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
                          Capital prestado
                        </Text>
                        <Text className="text-xs text-muted-foreground font-medium mt-0.5">
                          {loanDetail.loan.interestRate}% interés · {loanDetail.installments.length} cuotas
                        </Text>
                      </View>
                    </View>
                    <Text className="text-secondary font-bold text-base">
                      {formatCurrency(loanDetail.loan.capitalAmount, currency)}
                    </Text>
                  </View>

                  {/* Fila: Intereses cobrados */}
                  <View className="flex-row items-center justify-between px-4 py-3 border-b border-border/60 bg-card">
                    <View className="flex-row items-center gap-2.5">
                      <View className="w-7 h-7 rounded-full bg-accent/25 items-center justify-center">
                        <CalendarCheck size={14} color="#5a7a1a" />
                      </View>
                      <Text className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
                        Intereses cobrados
                      </Text>
                    </View>
                    <Text className="text-foreground font-bold text-base">
                      {formatCurrency(Math.max(0, loanDetail.loan.totalPaid - loanDetail.loan.capitalAmount), currency)}
                    </Text>
                  </View>

                  {/* Fila: Total cobrado */}
                  <View className="flex-row items-center justify-between px-4 py-3.5 bg-green-50 dark:bg-green-900/15">
                    <Text className="text-sm font-bold text-green-800 dark:text-green-300">
                      Total cobrado
                    </Text>
                    <Text className="text-green-700 dark:text-green-300 font-bold text-xl">
                      {formatCurrency(loanDetail.loan.totalPaid, currency)}
                    </Text>
                  </View>
                </View>

                {/* ─── Cronograma de cuotas ─── */}
                <View>
                  <View className="mx-4 mb-3 flex-row items-center justify-between">
                    <Text className="text-foreground font-bold text-base tracking-tight">
                      Cronograma de Cuotas
                    </Text>
                    <View className="bg-muted px-2.5 py-0.5 rounded-full">
                      <Text className="text-muted-foreground text-xs font-bold">
                        {loanDetail.installments.length} cuotas
                      </Text>
                    </View>
                  </View>

                  <View className="mx-4 rounded-2xl overflow-hidden border border-border bg-card shadow-sm">
                    {/* Header tabla */}
                    <View className="flex-row items-center px-4 py-2.5 bg-muted/80 border-b border-border">
                      <View className="w-9 items-center">
                        <Text className="text-xs font-bold text-muted-foreground uppercase tracking-wider">#</Text>
                      </View>
                      <View className="flex-1">
                        <Text className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Fecha</Text>
                      </View>
                      <View className="w-28 items-end">
                        <Text className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Monto</Text>
                      </View>
                    </View>

                    {/* Filas */}
                    {loanDetail.installments.map((inst, idx) => (
                      <View
                        key={inst.id || idx}
                        className={`flex-row items-center px-4 py-3 bg-card ${
                          idx < loanDetail.installments.length - 1 ? 'border-b border-border/50' : ''
                        }`}
                      >
                        <View className="w-9 items-center">
                          <CheckCircle2 size={15} color="#22c55e" />
                        </View>
                        <View className="flex-1">
                          <Text className="text-muted-foreground text-sm font-medium line-through">
                            {formatDateBO(inst.dueDate, "d 'de' MMM, yyyy")}
                          </Text>
                        </View>
                        <View className="w-28 items-end">
                          <Text className="text-muted-foreground font-bold text-sm line-through">
                            {formatCurrency(inst.totalAmount, currency)}
                          </Text>
                        </View>
                      </View>
                    ))}

                    {/* Footer tabla */}
                    <View className="bg-muted/60 px-4 py-2.5 border-t border-border flex-row justify-between items-center">
                      <Text className="text-sm text-muted-foreground font-medium">
                        Total del crédito:
                      </Text>
                      <Text className="text-sm font-bold text-foreground">
                        {formatCurrency(loanDetail.loan.totalAmount, currency)}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* ─── Historial de Pagos ─── */}
                {loanDetail.payments && loanDetail.payments.length > 0 && (
                  <View>
                    <View className="mx-4 mb-3 flex-row items-center justify-between">
                      <Text className="text-foreground font-bold text-base tracking-tight">
                        Historial de Pagos
                      </Text>
                      <View className="bg-muted px-2.5 py-0.5 rounded-full">
                        <Text className="text-muted-foreground text-xs font-bold">
                          {loanDetail.payments.length}
                        </Text>
                      </View>
                    </View>

                    {loanDetail.payments.map((pay) => (
                      <View
                        key={pay.id}
                        className={`mx-4 mb-2.5 rounded-2xl border p-3.5 flex-row items-center gap-3 ${
                          pay.voided
                            ? 'bg-muted/40 border-border/60 opacity-75'
                            : 'bg-card border-border'
                        }`}
                      >
                        <View className={`p-2.5 rounded-xl shrink-0 ${pay.voided ? 'bg-destructive/10' : 'bg-green-500/10'}`}>
                          <Banknote size={18} color={pay.voided ? '#ef4444' : '#22c55e'} />
                        </View>
                        <View className="flex-1">
                          <Text className={`font-bold text-sm leading-snug ${pay.voided ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                            {pay.method === 'transfer' ? 'Transferencia / QR' : 'Efectivo'}
                          </Text>
                          <Text className="text-muted-foreground text-xs font-medium mt-0.5">
                            {formatDateBO(pay.paymentDate)}{pay.notes ? ` · ${pay.notes}` : ''}
                          </Text>
                        </View>
                        <Text className={`font-bold text-base shrink-0 ${pay.voided ? 'text-muted-foreground line-through' : 'text-green-600 dark:text-green-400'}`}>
                          {pay.voided ? '' : '+ '}{formatCurrency(pay.amount, currency)}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

              </View>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </View>
  );
}
