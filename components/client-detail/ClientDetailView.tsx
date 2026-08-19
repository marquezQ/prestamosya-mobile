import React, { useState } from 'react';
import { View } from 'react-native';
import { Client } from '@/types/client';

import { ClientProfileHeader } from './ClientProfileHeader';
import { ClientProfileTabs, type ClientProfileTab } from './ClientProfileTabs';
import { CreditsTab } from './tabs/CreditsTab';
import { GuaranteesTab } from './tabs/GuaranteesTab';
import { LocationTab } from './tabs/LocationTab';



import { ClientLoanSummary, ClientGuaranteeSummary } from '@/types/client';

interface ClientDetailViewProps {
  client: Client;
  activeLoans?: ClientLoanSummary[];
  completedLoans?: ClientLoanSummary[];
  guarantees?: ClientGuaranteeSummary[];
}

export function ClientDetailView({
  client,
  activeLoans = [],
  completedLoans = [],
  guarantees = [],
}: ClientDetailViewProps) {
  const [activeTab, setActiveTab] = useState<ClientProfileTab>('credits');

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
        />
      )}
      {activeTab === 'guarantees' && <GuaranteesTab guarantees={guarantees} />}
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
