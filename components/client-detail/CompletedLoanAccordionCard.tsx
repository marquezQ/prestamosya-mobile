import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { CheckCircle2, CalendarCheck, Banknote } from 'lucide-react-native';
import { CompletedLoanSummary } from '@/types/client';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface CompletedLoanAccordionCardProps {
  loan: CompletedLoanSummary;
}

export function CompletedLoanAccordionCard({ loan }: CompletedLoanAccordionCardProps) {
  const formattedDate = format(
    new Date(loan.completedDate),
    "d 'de' MMMM, yyyy",
    { locale: es }
  );

  const loanNum = loan.id.replace(/\D/g, '') || loan.id;

  return (
    <View className="mx-4 mb-4 rounded-2xl overflow-hidden bg-card border border-border shadow-sm">
      <Accordion type="single" collapsible>
        <AccordionItem value={loan.id} className="border-b-0">

          {/* ── Trigger ── */}
          <AccordionTrigger className="px-4 py-3.5">
            <View className="flex-1 flex-row items-center gap-3">
              {/* Left: ID + label */}
              <View className="flex-1">
                <Text className="text-foreground font-bold text-lg leading-snug">
                  Préstamo #{loanNum}
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

            {/* ── Info cards ── */}
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
                  Bs.- {loan.totalAmount.toFixed(2)}
                </Text>
              </View>

              {/* Date */}
              <View className="flex-1 rounded-xl border border-border bg-muted/50 px-4 py-3.5">
                <View className="flex-row items-center gap-1.5 mb-2">
                  <CalendarCheck size={14} color="#22c55e" />
                  <Text className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Cierre
                  </Text>
                </View>
                <Text className="text-foreground font-bold text-sm leading-tight">
                  {formattedDate}
                </Text>
              </View>
            </View>

            {/* ── Saldo tag ── */}
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
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </View>
  );
}
