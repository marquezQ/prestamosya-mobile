import React, { useState } from 'react';
import { View } from 'react-native';
import { Client } from '@/types/client';

import { ClientProfileHeader } from './ClientProfileHeader';
import { ClientProfileTabs, type ClientProfileTab } from './ClientProfileTabs';
import { CreditsTab } from './tabs/CreditsTab';
import { GuaranteesTab } from './tabs/GuaranteesTab';
import { LocationTab } from './tabs/LocationTab';

// Mock Data (will be replaced by actual backend data via props later)
import { MOCK_ACTIVE_LOANS, MOCK_COMPLETED_LOANS, MOCK_CLIENT_STATS } from './constants';

interface ClientDetailViewProps {
  client: Client;
  // TODO: Add activeLoans, completedLoans, stats, etc. when backend is ready
}

export function ClientDetailView({ client }: ClientDetailViewProps) {
  const [activeTab, setActiveTab] = useState<ClientProfileTab>('credits');

  // En el futuro, estos datos vendrán de la prop client (de la respuesta del backend)
  const activeLoans = MOCK_ACTIVE_LOANS;
  const completedLoans = MOCK_COMPLETED_LOANS;
  const stats = MOCK_CLIENT_STATS;

  return (
    <View className="flex-1 bg-background">
      {/* Hero / Header — siempre visible */}
      <ClientProfileHeader client={client} />

      {/* Barra de pestañas persistente */}
      <ClientProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Contenido de la pestaña activa */}
      {activeTab === 'credits' && (
        <CreditsTab
          activeLoans={activeLoans}
          completedLoans={completedLoans}
          stats={stats}
        />
      )}
      {activeTab === 'guarantees' && <GuaranteesTab />}
      {activeTab === 'location' && (
        <LocationTab
          address={client.address}
          latitude={client.latitude}
          longitude={client.longitude}
        />
      )}
    </View>
  );
}
