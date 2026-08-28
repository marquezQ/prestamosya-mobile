import React from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { TrendingUp, CheckCircle2 } from 'lucide-react-native';
import { LoanAccordionCard } from '../LoanAccordionCard';
import { CompletedLoanAccordionCard } from '../CompletedLoanAccordionCard';
import { ClientLoanSummary } from '@/types/client';
import { palette } from '@/lib/theme/colors';

interface CreditsTabProps {
  activeLoans: ClientLoanSummary[];
  completedLoans: ClientLoanSummary[];
  clientPhone?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Section Header — with badge count
// ─────────────────────────────────────────────────────────────────────────────

interface SectionHeaderProps {
  title: string;
  count: number;
}

function SectionHeader({ title, count }: SectionHeaderProps) {
  return (
    <View className="flex-row items-center justify-between mx-4 mb-3 mt-1">
      <Text className="text-foreground font-bold text-xl tracking-tight">
        {title}
      </Text>
      <View className="bg-muted/80 border border-border/50 px-2.5 py-0.5 rounded-full">
        <Text className="text-muted-foreground text-xs font-bold">{count}</Text>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Empty State
// ─────────────────────────────────────────────────────────────────────────────

function EmptyState({ message }: { message: string }) {
  return (
    <View className="mx-4 mb-4 border border-dashed border-border rounded-2xl px-6 py-8 items-center">
      <Text className="text-muted-foreground text-sm text-center font-medium leading-relaxed">
        {message}
      </Text>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Credits Tab
// ─────────────────────────────────────────────────────────────────────────────

export function CreditsTab({ activeLoans, completedLoans, clientPhone = '' }: CreditsTabProps) {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingBottom: insets.bottom + 32, paddingTop: 12 }}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Préstamos Activos ── */}
      <SectionHeader
        title="Préstamos Activos"
        count={activeLoans.length}
      />

      {activeLoans.length === 0 ? (
        <EmptyState message="No hay préstamos activos en este momento." />
      ) : (
        activeLoans.map((loan) => (
          <LoanAccordionCard key={loan.id} loan={loan} clientPhone={clientPhone} />
        ))
      )}

      {/* ── Spacer between sections ── */}
      <View className="my-3" />

      {/* ── Préstamos Finalizados ── */}
      <SectionHeader
        title="Préstamos Finalizados"
        count={completedLoans.length}
      />

      {completedLoans.length === 0 ? (
        <EmptyState message="Aún no hay préstamos finalizados." />
      ) : (
        completedLoans.map((loan) => (
          <CompletedLoanAccordionCard key={loan.id} loan={loan} />
        ))
      )}
    </ScrollView>
  );
}
