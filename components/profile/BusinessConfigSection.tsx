import { View, ActivityIndicator, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import {
  Building2,
  DollarSign,
  Clock,
  AlertTriangle,
  Info,
  Pencil,
  Percent,
  Calendar,
} from "lucide-react-native";
import { useBusinessConfig } from "@/hooks/useBusinessConfig";
import { palette } from "@/lib/theme/colors";

const PERIOD_LABELS: Record<string, string> = {
  monthly: "Mensual",
  weekly: "Semanal",
  biweekly: "Quincenal",
  daily: "Diario",
};

interface BusinessConfigSectionProps {
  onEditPress: () => void;
}

export function BusinessConfigSection({ onEditPress }: BusinessConfigSectionProps) {
  const { data: config, isLoading, isError } = useBusinessConfig();

  if (isLoading) {
    return (
      <View className="bg-card border border-border/60 rounded-3xl p-6 items-center justify-center min-h-[200px]">
        <ActivityIndicator color={palette.celeste} />
        <Text className="text-muted-foreground text-sm mt-3">
          Cargando configuración del negocio…
        </Text>
      </View>
    );
  }

  if (isError || !config) {
    return (
      <View className="bg-card border border-border/60 rounded-3xl p-6 items-center justify-center min-h-[160px]">
        <Building2 size={32} color={palette.azul} />
        <Text className="text-muted-foreground text-sm mt-2 text-center">
          No se pudo cargar la configuración del negocio.
        </Text>
      </View>
    );
  }

  const periodLabel = PERIOD_LABELS[config.defaultPeriodType] ?? config.defaultPeriodType;

  return (
    <View className="bg-card border border-border/60 rounded-3xl p-6">
      {/* Header */}
      <View className="flex-row items-center gap-3 mb-5">
        <View className="w-10 h-10 rounded-2xl bg-secondary/10 items-center justify-center">
          <Building2 size={20} color={palette.azul} />
        </View>
        <View className="flex-1">
          <Text className="text-foreground font-bold text-lg">{config.businessName}</Text>
          <Text className="text-muted-foreground text-xs">Configuración general del sistema</Text>
        </View>
      </View>

      <View className="h-px bg-border/60 mb-5" />

      <View className="gap-4">
        {/* 1. Moneda & Tipo de Cambio (Informativo) */}
        <View className="p-4 rounded-2xl bg-muted/30 border border-border/40 gap-2">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <DollarSign size={16} color={palette.celeste} />
              <Text className="text-foreground font-semibold text-sm">Moneda & Cambio</Text>
            </View>
            <View className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20">
              <Text className="text-blue-500 text-[10px] font-bold uppercase tracking-wider">
                Informativo
              </Text>
            </View>
          </View>

          <View className="flex-row justify-between items-center mt-1">
            <View>
              <Text className="text-muted-foreground text-xs">Moneda principal</Text>
              <Text className="text-foreground font-bold text-base">{config.primaryCurrency}</Text>
            </View>
            <View className="items-end">
              <Text className="text-muted-foreground text-xs">Tipo de cambio</Text>
              <Text className="text-foreground font-bold text-base">
                1 USD = {config.exchangeRate} BOB
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-1.5 mt-1 pt-2 border-t border-border/30">
            <Info size={13} color="#94a3b8" />
            <Text className="text-muted-foreground text-xs flex-1">
              El tipo de cambio es únicamente referencial para consultas y equivalencias.
            </Text>
          </View>
        </View>

        {/* 2. Valores por defecto (Informativo) */}
        <View className="p-4 rounded-2xl bg-muted/30 border border-border/40 gap-2">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Percent size={16} color={palette.celeste} />
              <Text className="text-foreground font-semibold text-sm">Préstamos por Defecto</Text>
            </View>
            <View className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20">
              <Text className="text-blue-500 text-[10px] font-bold uppercase tracking-wider">
                Informativo
              </Text>
            </View>
          </View>

          <View className="flex-row justify-between items-center mt-1">
            <View>
              <Text className="text-muted-foreground text-xs">Tasa de interés</Text>
              <Text className="text-foreground font-bold text-base">{config.defaultInterestRate}%</Text>
            </View>
            <View className="items-end">
              <Text className="text-muted-foreground text-xs">Frecuencia de pago</Text>
              <Text className="text-foreground font-bold text-base">{periodLabel}</Text>
            </View>
          </View>

          <View className="flex-row items-center gap-1.5 mt-1 pt-2 border-t border-border/30">
            <Info size={13} color="#94a3b8" />
            <Text className="text-muted-foreground text-xs flex-1">
              Son valores iniciales sugeridos al crear un préstamo.
            </Text>
          </View>
        </View>

        {/* 3. Días de Gracia y Mora (¡IMPORTANTE!) */}
        <View className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 gap-2">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <AlertTriangle size={18} color="#f59e0b" />
              <Text className="text-amber-500 font-bold text-sm">Días de Gracia (Mora)</Text>
            </View>
            <View className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40">
              <Text className="text-amber-500 text-[10px] font-bold uppercase tracking-wider">
                Importante
              </Text>
            </View>
          </View>

          <View className="flex-row items-baseline gap-2 mt-1">
            <Text className="text-foreground font-extrabold text-2xl">{config.graceDays}</Text>
            <Text className="text-muted-foreground font-semibold text-sm">
              {config.graceDays === 1 ? "día de tolerancia" : "días de tolerancia"}
            </Text>
          </View>

          <Text className="text-amber-600 dark:text-amber-400 text-xs leading-5 mt-1 font-medium">
            Especifica el margen de días de tolerancia tras la fecha de vencimiento de una cuota. Cumplido este plazo, el sistema marcará automáticamente la cuota y al deudor en <Text className="font-bold underline">MORA</Text>.
          </Text>
        </View>
      </View>

      {/* Botón para abrir el modal de edición */}
      <Button onPress={onEditPress} variant="outline" className="mt-5 h-12 flex-row items-center gap-2 border-secondary/40">
        <Pencil size={16} color={palette.azul} />
        <Text className="text-secondary font-bold text-base">Cambiar valores</Text>
      </Button>
    </View>
  );
}
