import React from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Client } from '@/types/client';

import { ClientProfileHeader } from './ClientProfileHeader';
import { ActiveLoanCard } from './ActiveLoanCard';
import { ClientStatsRow } from './ClientStatsRow';
import { ClientAddressMap } from './ClientAddressMap';
import { OtherActiveLoansSection } from './OtherActiveLoansSection';
import { CompletedLoansSection } from './CompletedLoansSection';

// Mock Data (will be replaced by actual backend data via props later)
import { MOCK_ACTIVE_LOANS, MOCK_COMPLETED_LOANS, MOCK_CLIENT_STATS } from './constants';

interface ClientDetailViewProps {
  client: Client;
  // TODO: Add activeLoans, completedLoans, stats, etc. when backend is ready
}

export function ClientDetailView({ client }: ClientDetailViewProps) {
  const insets = useSafeAreaInsets();
  
  // En el futuro, estos datos vendrán de la prop client (de la respuesta del backend)
  const activeLoans = MOCK_ACTIVE_LOANS;
  const completedLoans = MOCK_COMPLETED_LOANS;
  const stats = MOCK_CLIENT_STATS;

  const mainActiveLoan = activeLoans.length > 0 ? activeLoans[0] : null;
  const otherActiveLoans = activeLoans.slice(1);

  return (
    <ScrollView 
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      showsVerticalScrollIndicator={false}
    >
      <ClientProfileHeader client={client} />
      
      {mainActiveLoan && (
        <ActiveLoanCard loan={mainActiveLoan} />
      )}

      <ClientStatsRow stats={stats} />
      
      <ClientAddressMap 
        address={client.address} 
        latitude={client.latitude} 
        longitude={client.longitude} 
      />

      <OtherActiveLoansSection loans={otherActiveLoans} />
      
      <CompletedLoansSection loans={completedLoans} />
    </ScrollView>
  );
}
