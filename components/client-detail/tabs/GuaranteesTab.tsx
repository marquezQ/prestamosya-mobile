import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { Shield, Car, Home, CheckCircle2 } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ClientGuaranteeSummary } from '@/types/client';
import { palette } from '@/lib/theme/colors';

interface GuaranteesTabProps {
  guarantees: ClientGuaranteeSummary[];
}

function getGuaranteeIcon(type: string) {
  switch (type?.toUpperCase()) {
    case 'VEHICLE':
      return Car;
    case 'PROPERTY':
    case 'REAL_ESTATE':
      return Home;
    default:
      return Shield;
  }
}

function getGuaranteeStatusLabel(status: string) {
  switch (status?.toUpperCase()) {
    case 'IN_USE':
      return 'En uso';
    case 'RELEASED':
      return 'Liberada';
    case 'EXCLUDED':
      return 'Excluida';
    default:
      return status || 'Registrada';
  }
}

export function GuaranteesTab({ guarantees }: GuaranteesTabProps) {
  const insets = useSafeAreaInsets();

  if (!guarantees || guarantees.length === 0) {
    return (
      <View
        className="flex-1 bg-background items-center justify-center px-8"
        style={{ paddingBottom: insets.bottom + 24 }}
      >
        <View className="bg-card border border-border rounded-2xl p-8 items-center w-full shadow-sm">
          <View className="bg-primary/10 rounded-full p-5 mb-4">
            <Shield size={36} color={palette.azul} />
          </View>

          <Text className="text-foreground font-bold text-xl text-center mb-2">
            Sin Garantías Registradas
          </Text>
          <Text className="text-muted-foreground text-sm text-center leading-relaxed">
            Las garantías vinculadas a los préstamos de este cliente aparecerán aquí.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingBottom: insets.bottom + 32, paddingTop: 16 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-row items-center justify-between mx-4 mb-3">
        <Text className="text-foreground font-bold text-xl tracking-tight">
          Garantías del Cliente
        </Text>
        <View className="bg-muted px-2.5 py-0.5 rounded-full">
          <Text className="text-muted-foreground text-xs font-bold">{guarantees.length}</Text>
        </View>
      </View>

      {guarantees.map((item) => {
        const Icon = getGuaranteeIcon(item.type);
        const statusLabel = getGuaranteeStatusLabel(item.status);

        return (
          <View
            key={item.id}
            className="mx-4 mb-3 rounded-2xl bg-card border border-border p-4 shadow-sm"
          >
            <View className="flex-row items-start gap-3">
              <View className="bg-primary/15 p-3 rounded-xl">
                <Icon size={22} color={palette.azul} />
              </View>

              <View className="flex-1">
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="text-foreground font-bold text-base leading-snug flex-1 mr-2">
                    {item.description}
                  </Text>
                  <View className="bg-green-500/10 px-2.5 py-0.5 rounded-full">
                    <Text className="text-xs font-bold text-green-600 dark:text-green-400">
                      {statusLabel}
                    </Text>
                  </View>
                </View>

                <Text className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-0.5">
                  VALOR ESTIMADO
                </Text>
                <Text className="text-secondary font-bold text-lg">
                  Bs.- {(item.estimatedValue ?? 0).toLocaleString('es-BO', { minimumFractionDigits: 2 })}
                </Text>
              </View>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}
