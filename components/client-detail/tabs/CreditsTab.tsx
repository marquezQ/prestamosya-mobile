import React from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActiveLoanCard } from '../ActiveLoanCard';
import { ClientStatsRow } from '../ClientStatsRow';
import { OtherActiveLoansSection } from '../OtherActiveLoansSection';
import { CompletedLoansSection } from '../CompletedLoansSection';
import { ActiveLoanSummary, CompletedLoanSummary, ClientStats } from '@/types/client';

interface CreditsTabProps {
  activeLoans: ActiveLoanSummary[];
  completedLoans: CompletedLoanSummary[];
  stats: ClientStats;
}

export function CreditsTab({ activeLoans, completedLoans, stats }: CreditsTabProps) {
  const insets = useSafeAreaInsets();
  const mainActiveLoan = activeLoans.length > 0 ? activeLoans[0] : null;
  const otherActiveLoans = activeLoans.slice(1);

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingBottom: insets.bottom + 24, paddingTop: 16 }}
      showsVerticalScrollIndicator={false}
    >
      {mainActiveLoan && <ActiveLoanCard loan={mainActiveLoan} />}
      <ClientStatsRow stats={stats} />
      <OtherActiveLoansSection loans={otherActiveLoans} />
      <CompletedLoansSection loans={completedLoans} />
    </ScrollView>
  );
}
