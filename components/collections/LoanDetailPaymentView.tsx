import React, { useState } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Banknote, BadgeCheck, CheckCircle2 } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LoanDetailData } from '@/types/loan';
import { RegisterPaymentModal } from './RegisterPaymentModal';
import { SettleLoanModal } from './SettleLoanModal';
import { RegisterPaymentResponseData, SettleLoanResponseData } from '@/types/payment';
import { formatBs } from '@/lib/format';
import { LoanClientHeaderCard } from './loan-detail/LoanClientHeaderCard';
import { LoanMetricsCard } from './loan-detail/LoanMetricsCard';
import { LoanScheduleTable } from './loan-detail/LoanScheduleTable';
import { LoanPaymentHistoryList } from './loan-detail/LoanPaymentHistoryList';

interface LoanDetailPaymentViewProps {
  loanDetail: LoanDetailData;
  /** Teléfono desde parámetros de ruta; el nombre y CI vienen en loanDetail. */
  clientPhone?: string;
}

export function LoanDetailPaymentView({
  loanDetail,
  clientPhone = '',
}: LoanDetailPaymentViewProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSettleModalOpen, setIsSettleModalOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState<{
    title: string;
    detail: string;
  } | null>(null);

  const { loan, installments, payments } = loanDetail;

  const isLoanActive =
    loan.status === 'ACTIVE' && loan.outstandingBalance > 0;

  const nextPendingInstallment = installments.find(
    (ins) => ins.status === 'PENDING' || ins.status === 'OVERDUE' || ins.status === 'PARTIAL'
  );
  const defaultAmount = nextPendingInstallment
    ? nextPendingInstallment.totalAmount - nextPendingInstallment.paidAmount
    : loan.outstandingBalance;

  // El backend distribuye el pago FIFO y devuelve las cuotas afectadas.
  const handlePaymentRegistered = (result: RegisterPaymentResponseData) => {
    const appliedSummary = result.affectedInstallments
      .map(
        (ins) =>
          `Cuota #${ins.installmentNumber} ${
            ins.newStatus === 'PAID'
              ? 'pagada'
              : `parcial (${formatBs(ins.amountApplied)})`
          }`
      )
      .join(' · ');

    setSuccessBanner({
      title: `¡Pago de ${formatBs(result.amount)} registrado!`,
      detail: `${appliedSummary} — Saldo restante: ${formatBs(result.outstandingBalance)}`,
    });
    setTimeout(() => setSuccessBanner(null), 6000);
  };

  // Tras la liquidación el préstamo queda en COMPLETED; redirigimos al usuario.
  const handleLoanSettled = (_result: SettleLoanResponseData) => {
    setSuccessBanner({
      title: '¡Préstamo liquidado exitosamente!',
      detail: 'El saldo quedó en Bs.- 0,00. Redirigiendo...',
    });
    setTimeout(() => router.back(), 2500);
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      {/* Screen Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-border bg-background">
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center -ml-2 rounded-full active:bg-muted"
        >
          <ArrowLeft size={24} className="text-foreground" />
        </Pressable>
        <Text className="font-bold text-lg text-foreground ml-2">
          Detalle del Préstamo
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: insets.bottom + 90 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Alert Banner */}
        {successBanner && (
          <View className="mx-4 mt-3 bg-green-500/15 border border-green-500/30 rounded-2xl p-4 flex-row items-start gap-3">
            <CheckCircle2 size={20} color="#22c55e" />
            <View className="flex-1">
              <Text className="text-green-700 dark:text-green-300 font-bold text-sm">
                {successBanner.title}
              </Text>
              <Text className="text-green-700 dark:text-green-300 text-xs font-medium mt-0.5">
                {successBanner.detail}
              </Text>
            </View>
          </View>
        )}

        <LoanClientHeaderCard
          clientName={loan.clientName}
          clientPhone={clientPhone}
          clientIdNumber={loan.clientIdNumber}
        />

        <LoanMetricsCard
          totalPaid={loan.totalPaid}
          totalAmount={loan.totalAmount}
          outstandingBalance={loan.outstandingBalance}
        />

        {/* Section Title */}
        <View className="mx-4 mt-5 mb-3 flex-row items-center justify-between">
          <Text className="text-foreground font-bold text-xl tracking-tight">
            Cronograma del Préstamo
          </Text>
          <View className="bg-muted px-2.5 py-0.5 rounded-full">
            <Text className="text-muted-foreground text-xs font-bold">
              {installments.length} cuotas
            </Text>
          </View>
        </View>

        <LoanScheduleTable installments={installments} />

        <LoanPaymentHistoryList payments={payments} />
      </ScrollView>

      {/* Persistent Action Bar */}
      <View
        className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t border-border shadow-lg gap-2.5"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
      >
        <Button
          onPress={() => setIsPaymentModalOpen(true)}
          disabled={!isLoanActive}
          className="bg-secondary active:bg-secondary/90 h-14 rounded-2xl flex-row items-center justify-center gap-2 shadow-md"
        >
          <Banknote size={22} color="#ffffff" />
          <Text className="text-white font-bold text-lg">Registrar Pago</Text>
        </Button>

        {isLoanActive && (
          <Button
            variant="outline"
            onPress={() => setIsSettleModalOpen(true)}
            className="h-12 rounded-2xl flex-row items-center justify-center gap-2 border-secondary/40 active:bg-secondary/10"
          >
            <BadgeCheck size={18} color="#2368A3" />
            <Text className="text-secondary font-bold text-base">Liquidar Préstamo</Text>
          </Button>
        )}
      </View>

      {/* Payment Modal */}
      <RegisterPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        loanId={loan.id}
        clientName={loan.clientName}
        clientPhone={clientPhone}
        installments={installments}
        defaultAmount={defaultAmount}
        onPaymentSuccess={handlePaymentRegistered}
      />

      {/* Settle Modal */}
      <SettleLoanModal
        isOpen={isSettleModalOpen}
        onClose={() => setIsSettleModalOpen(false)}
        loanId={loan.id}
        clientName={loan.clientName}
        clientPhone={clientPhone}
        outstandingBalance={loan.outstandingBalance}
        onSettleSuccess={handleLoanSettled}
      />
    </View>
  );
}
