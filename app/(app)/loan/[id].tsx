import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { LoanDetailPaymentView } from '@/components/collections/LoanDetailPaymentView';
import { MOCK_LOAN_DETAILS_MAP } from '@/components/collections/mockPaymentData';

export default function LoanDetailScreen() {
  const { id, clientPhone } = useLocalSearchParams<{
    id: string;
    clientPhone?: string;
  }>();

  // Fase mock: si el id no existe en el mapa mostramos el préstamo de ejemplo.
  // Al conectar el backend esto será GET /loans/:id vía useLoanById(id).
  const loanDetail =
    MOCK_LOAN_DETAILS_MAP[id] ?? MOCK_LOAN_DETAILS_MAP['uuid-loan-1'];

  return (
    <LoanDetailPaymentView
      loanDetail={loanDetail}
      clientPhone={clientPhone}
    />
  );
}
