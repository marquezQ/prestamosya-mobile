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
import { useLoanById } from '@/hooks/useLoanById';
import { Button } from '@/components/ui/button';
import { palette } from '@/lib/theme/colors';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

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

  const formattedDate = loan.startDate
    ? format(new Date(loan.startDate), "d 'de' MMMM, yyyy", { locale: es })
    : 'Finalizado';

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
              {/* Left: ID + label */}
              <View className="flex-1">
                <Text className="text-foreground font-bold text-lg leading-snug">
                  Préstamo {formatLoanId(loan.id)}
                </Text>
                <Text className="text-muted-foreground text-sm font-medium mt-0.5">
                  Préstamo finalizado
                </Text>
              </View>

              {/* Right: Completed pill */}
              <View className="flex-row items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10">
                <CheckCircle2 size={12} color="#22c55e" />
                <Text className="text-xs font-bold text-green-600 dark:text-green-400">
                  Completado
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
                  Cargando detalle del préstamo...
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
                {/* Info cards */}
                <View className="flex-row gap-3 mb-4">
                  {/* Amount */}
                  <View className="flex-1 rounded-xl border border-border bg-muted/50 px-4 py-3.5">
                    <View className="flex-row items-center gap-1.5 mb-2">
                      <Banknote size={14} color="#22c55e" />
                      <Text className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Monto total
                      </Text>
                    </View>
                    <Text className="text-foreground font-bold text-lg">
                      Bs.- {(loanDetail?.loan.totalAmount ?? loan.totalAmount).toFixed(2)}
                    </Text>
                  </View>

                  {/* Date */}
                  <View className="flex-1 rounded-xl border border-border bg-muted/50 px-4 py-3.5">
                    <View className="flex-row items-center gap-1.5 mb-2">
                      <CalendarCheck size={14} color="#22c55e" />
                      <Text className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Inicio
                      </Text>
                    </View>
                    <Text className="text-foreground font-bold text-sm leading-tight">
                      {formattedDate}
                    </Text>
                  </View>
                </View>

                {/* Saldo tag */}
                <View className="flex-row items-center gap-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-xl px-4 py-3.5">
                  <View className="bg-green-100 dark:bg-green-800/40 rounded-full p-1.5">
                    <CheckCircle2 size={18} color="#22c55e" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-bold text-green-800 dark:text-green-300">
                      Préstamo saldado
                    </Text>
                    <Text className="text-xs text-green-700 dark:text-green-400 font-medium mt-0.5">
                      Este préstamo fue liquidado en su totalidad
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </View>
  );
}
