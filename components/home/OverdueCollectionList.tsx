import React from 'react';
import { View, Text, Pressable, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { AlertCircle, ShieldCheck, MessageSquare, Phone } from 'lucide-react-native';
import { OverdueInstallmentItem } from '@/types/dashboard';
import { formatCurrency, getInitials } from '@/lib/format';
import { palette } from '@/lib/theme/colors';
import { sendWhatsAppWithChooser } from '@/lib/whatsapp';

interface OverdueCollectionListProps {
  overdueItems: OverdueInstallmentItem[];
}

function formatLoanId(id: string): string {
  if (!id) return '';
  const numeric = id.replace(/\D/g, '');
  return numeric ? `#${numeric.slice(-4)}` : `#${id.slice(0, 6)}`;
}

export function OverdueCollectionList({ overdueItems }: OverdueCollectionListProps) {
  const router = useRouter();

  const handleOpenWhatsApp = (item: OverdueInstallmentItem) => {
    const formattedPending = formatCurrency(item.pendingAmount, item.currency);
    const text = `Hola ${item.client.firstName}, le recordamos que tiene pendiente de pago la cuota N° ${item.installmentNumber} por un saldo de ${formattedPending} con ${item.daysOverdue} días de mora. Favor cancelar a la brevedad.`;
    sendWhatsAppWithChooser({ phone: item.client.phone, text });
  };

  const handleCall = (phone?: string) => {
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    }
  };

  const handleCardPress = (item: OverdueInstallmentItem) => {
    router.push(`/(app)/loan/${item.loanId}?clientPhone=${encodeURIComponent(item.client.phone || '')}`);
  };

  return (
    <View className="mx-4 mb-6">
      {/* Section Header */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-2">
          <AlertCircle size={20} className="text-red-600 dark:text-red-400" />
          <Text className="text-foreground font-bold text-xl tracking-tight">
            Clientes en Mora
          </Text>
        </View>
        <View className="bg-red-500/10 px-2.5 py-0.5 rounded-full border border-red-500/20">
          <Text className="text-red-600 dark:text-red-400 text-xs font-bold">
            {overdueItems.length} pendientes
          </Text>
        </View>
      </View>

      {/* Empty State */}
      {overdueItems.length === 0 ? (
        <View className="border border-dashed border-border rounded-2xl p-5 items-center bg-green-500/5 my-1">
          <ShieldCheck size={28} color="#22c55e" />
          <Text className="text-green-600 dark:text-green-400 font-bold text-sm mt-2">
            ¡Excelente! Sin cuotas en mora pendientes.
          </Text>
          <Text className="text-muted-foreground text-xs font-medium mt-0.5">
            Todos los cobros están al día.
          </Text>
        </View>
      ) : (
        overdueItems.map((item) => {
          const initials = getInitials(item.client.fullName);
          const loanCodeStr = formatLoanId(item.loanId);

          return (
            <Pressable
              key={item.installmentId}
              onPress={() => handleCardPress(item)}
              className="mb-3 rounded-2xl bg-card border border-border p-4 shadow-sm active:bg-muted/50 gap-3"
            >
              {/* Top Row: Avatar + Client Info + Pending Amount */}
              <View className="flex-row items-center justify-between gap-3">
                {/* Avatar + Client Info */}
                <View className="flex-row items-center gap-3 flex-1">
                  <View className="w-10 h-10 rounded-full bg-red-600 items-center justify-center shrink-0 shadow-sm">
                    <Text className="text-white font-bold text-xs">{initials}</Text>
                  </View>

                  <View className="flex-1">
                    <View className="flex-row items-center gap-2">
                      <Text
                        className="text-foreground font-bold text-base leading-snug"
                        numberOfLines={1}
                      >
                        {item.client.fullName}
                      </Text>
                    </View>
                    <Text className="text-muted-foreground text-xs font-medium mt-0.5">
                      Préstamo {loanCodeStr} • Cuota #{item.installmentNumber}
                    </Text>
                  </View>
                </View>

                {/* Amount */}
                <View className="items-end shrink-0">
                  <Text className="text-foreground font-extrabold text-base">
                    {formatCurrency(item.pendingAmount, item.currency)}
                  </Text>
                  <Text className="text-muted-foreground text-[10px] font-semibold uppercase">
                    Saldo Pendiente
                  </Text>
                </View>
              </View>

              {/* Bottom Row: Mora Pill + Recordatorio (WhatsApp) + Llamar */}
              <View className="flex-row items-center justify-between pt-2.5 border-t border-border/50 gap-2">
                <View className="bg-red-500/10 px-2.5 py-1 rounded-lg border border-red-500/20">
                  <Text className="text-red-600 dark:text-red-400 text-xs font-bold">
                    ⚠️ {item.daysOverdue} {item.daysOverdue === 1 ? 'día' : 'días'} de mora
                  </Text>
                </View>

                <View className="flex-row items-center gap-2">
                  {/* Botón Llamar (Estilo Outline idéntico al del Perfil) */}
                  <Pressable
                    onPress={(e) => {
                      e.stopPropagation();
                      handleCall(item.client.phone);
                    }}
                    className="border border-secondary/40 active:bg-secondary/10 px-3 py-1.5 rounded-xl flex-row items-center gap-1.5"
                  >
                    <Phone size={14} color={palette.azul} />
                    <Text className="text-secondary text-xs font-bold">
                      Llamar
                    </Text>
                  </Pressable>

                  {/* Botón WhatsApp */}
                  <Pressable
                    onPress={(e) => {
                      e.stopPropagation();
                      handleOpenWhatsApp(item);
                    }}
                    className="bg-green-600 active:bg-green-700 px-3 py-1.5 rounded-xl flex-row items-center gap-1.5 shadow-sm"
                  >
                    <MessageSquare size={14} color="#ffffff" />
                    <Text className="text-white text-xs font-bold">
                      WhatsApp
                    </Text>
                  </Pressable>
                </View>
              </View>
            </Pressable>
          );
        })
      )}
    </View>
  );
}
