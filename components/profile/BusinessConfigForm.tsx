import { useState } from "react";
import { View, ActivityIndicator, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, Save } from "lucide-react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useBusinessConfig, useUpdateBusinessConfig } from "@/hooks/useBusinessConfig";
import { BusinessConfigUpdateInput, PeriodType, PrimaryCurrency } from "@/types/businessConfig.types";
import { getApiErrorMessage } from "@/services/api";
import { palette } from "@/lib/theme/colors";
import { KeyboardAwareScrollView } from "@/components/ui/KeyboardAwareScrollView";

const PERIOD_OPTIONS: { value: PeriodType; label: string }[] = [
  { value: "monthly", label: "Mensual" },
  { value: "weekly", label: "Semanal" },
  { value: "biweekly", label: "Quincenal" },
];

const CURRENCY_OPTIONS: { value: PrimaryCurrency; label: string }[] = [
  { value: "BOB", label: "Bs. (BOB)" },
  { value: "USD", label: "$ (USD)" },
];

const businessConfigSchema = z.object({
  businessName: z.string().min(1, "El nombre es requerido").max(100),
  primaryCurrency: z.enum(["BOB", "USD"]),
  exchangeRate: z
    .string()
    .min(1, "Requerido")
    .refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) > 0, {
      message: "Debe ser > 0",
    }),
  defaultInterestRate: z
    .string()
    .min(1, "Requerido")
    .refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) >= 0, {
      message: "Debe ser ≥ 0",
    }),
  defaultPeriodType: z.enum(["monthly", "weekly", "biweekly"]),
  graceDays: z
    .string()
    .min(1, "Requerido")
    .refine((v) => Number.isInteger(Number(v)) && Number(v) >= 0, {
      message: "Entero ≥ 0",
    }),
});

type BusinessConfigFormValues = z.infer<typeof businessConfigSchema>;

interface BusinessConfigFormProps {
  onSuccessCallback?: () => void;
}

export function BusinessConfigForm({ onSuccessCallback }: BusinessConfigFormProps) {
  const { data: config, isLoading } = useBusinessConfig();
  const { mutate: updateConfig, isPending } = useUpdateBusinessConfig();
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<BusinessConfigFormValues>({
    resolver: zodResolver(businessConfigSchema),
    values: config
      ? {
          businessName: config.businessName,
          primaryCurrency: config.primaryCurrency,
          exchangeRate: String(config.exchangeRate),
          defaultInterestRate: String(config.defaultInterestRate),
          defaultPeriodType: config.defaultPeriodType,
          graceDays: String(config.graceDays),
        }
      : undefined,
  });

  const onSubmit = (values: BusinessConfigFormValues) => {
    setSaveSuccess(false);
    setSaveError(null);

    const payload: BusinessConfigUpdateInput = {
      businessName: values.businessName,
      primaryCurrency: values.primaryCurrency,
      exchangeRate: parseFloat(values.exchangeRate),
      defaultInterestRate: parseFloat(values.defaultInterestRate),
      defaultPeriodType: values.defaultPeriodType,
      graceDays: parseInt(values.graceDays, 10),
    };

    updateConfig(payload, {
      onSuccess: () => {
        setSaveSuccess(true);
        reset(values);
        if (onSuccessCallback) {
          setTimeout(() => {
            onSuccessCallback();
          }, 1500);
        }
      },
      onError: (err) => {
        setSaveError(getApiErrorMessage(err, "No se pudo guardar la configuración."));
      },
    });
  };

  const isFormDisabled = isPending || saveSuccess;

  if (isLoading) {
    return (
      <View className="p-6 items-center justify-center min-h-[180px]">
        <ActivityIndicator color={palette.celeste} />
        <Text className="text-muted-foreground text-sm mt-3">Cargando configuración…</Text>
      </View>
    );
  }

  return (
    <View className="flex-col">
      {/* Scrollable inputs grid (compact 2 columns layout) */}
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 8 }}
      >
        <View className="gap-3">
          {/* Fila 1: Nombre del negocio */}
          <View className="gap-1">
            <Label nativeID="businessName-label">Nombre del negocio</Label>
            <Controller
              control={control}
              name="businessName"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="Mi empresa de préstamos"
                  autoCapitalize="words"
                  editable={!isFormDisabled}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  aria-labelledby="businessName-label"
                />
              )}
            />
            {errors.businessName && (
              <Text className="text-destructive text-xs mt-0.5">{errors.businessName.message}</Text>
            )}
          </View>

          {/* Fila 2: Moneda principal (chip) + Tipo de cambio (input) side by side */}
          <View className="flex-row gap-3 items-start">
            {/* Moneda Principal */}
            <View className="flex-1 gap-1">
              <Label nativeID="currency-label">Moneda principal</Label>
              <Controller
                control={control}
                name="primaryCurrency"
                render={({ field: { value, onChange } }) => (
                  <View className="flex-row gap-1.5 h-[42px]">
                    {CURRENCY_OPTIONS.map((opt) => {
                      const isSelected = value === opt.value;
                      return (
                        <Pressable
                          key={opt.value}
                          disabled={isFormDisabled}
                          onPress={() => onChange(opt.value)}
                          className={`flex-1 justify-center rounded-xl border items-center ${
                            isSelected
                              ? "bg-secondary border-secondary"
                              : "bg-muted/50 border-border active:bg-muted"
                          } ${isFormDisabled ? "opacity-60" : ""}`}
                        >
                          <Text
                            className={`text-xs font-bold ${
                              isSelected ? "text-white" : "text-foreground"
                            }`}
                          >
                            {opt.label}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                )}
              />
            </View>

            {/* Tipo de cambio */}
            <View className="flex-1 gap-1">
              <Label nativeID="exchangeRate-label">T. Cambio (BOB/USD)</Label>
              <Controller
                control={control}
                name="exchangeRate"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="6.96"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isFormDisabled}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    keyboardType="decimal-pad"
                    aria-labelledby="exchangeRate-label"
                  />
                )}
              />
              {errors.exchangeRate && (
                <Text className="text-destructive text-xs mt-0.5">{errors.exchangeRate.message}</Text>
              )}
            </View>
          </View>

          {/* Fila 3: Tasa de interés (%) + Días de gracia (mora) side by side */}
          <View className="flex-row gap-3 items-start">
            {/* Tasa de Interés */}
            <View className="flex-1 gap-1">
              <Label nativeID="interestRate-label">Tasa de interés (%)</Label>
              <Controller
                control={control}
                name="defaultInterestRate"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="10"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isFormDisabled}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    keyboardType="decimal-pad"
                    aria-labelledby="interestRate-label"
                  />
                )}
              />
              {errors.defaultInterestRate && (
                <Text className="text-destructive text-xs mt-0.5">
                  {errors.defaultInterestRate.message}
                </Text>
              )}
            </View>

            {/* Días de gracia */}
            <View className="flex-1 gap-1">
              <Label nativeID="graceDays-label">Días de gracia (mora)</Label>
              <Controller
                control={control}
                name="graceDays"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="3"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isFormDisabled}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    keyboardType="number-pad"
                    aria-labelledby="graceDays-label"
                  />
                )}
              />
              {errors.graceDays && (
                <Text className="text-destructive text-xs mt-0.5">{errors.graceDays.message}</Text>
              )}
            </View>
          </View>

          {/* Fila 4: Período por defecto — chips */}
          <View className="gap-1">
            <Label nativeID="periodType-label">Frecuencia de pago por defecto</Label>
            <Controller
              control={control}
              name="defaultPeriodType"
              render={({ field: { value, onChange } }) => (
                <View className="flex-row gap-2 h-[42px]">
                  {PERIOD_OPTIONS.map((opt) => {
                    const isSelected = value === opt.value;
                    return (
                      <Pressable
                        key={opt.value}
                        disabled={isFormDisabled}
                        onPress={() => onChange(opt.value)}
                        className={`flex-1 justify-center rounded-xl border items-center ${
                          isSelected
                            ? "bg-secondary border-secondary"
                            : "bg-muted/50 border-border active:bg-muted"
                        } ${isFormDisabled ? "opacity-60" : ""}`}
                      >
                        <Text
                          className={`text-xs font-bold ${
                            isSelected ? "text-white" : "text-foreground"
                          }`}
                        >
                          {opt.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              )}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>

      {/* Sticky Bottom Container: Feedback + Botón Guardar Cambios (SIEMPRE VISIBLE SIN SCROLL) */}
      <View className="pt-3 border-t border-border/40 mt-2">
        {/* Banner Exitoso */}
        {saveSuccess && (
          <View className="flex-row items-center gap-2 p-3 rounded-2xl bg-green-500/15 border border-green-500/30 mb-2">
            <CheckCircle2 size={18} color="#22c55e" />
            <View className="flex-1">
              <Text className="text-green-600 dark:text-green-400 font-bold text-xs">
                ¡Configuración guardada correctamente!
              </Text>
              <Text className="text-green-700/80 dark:text-green-300/80 text-[11px]">
                Cerrando ventana...
              </Text>
            </View>
          </View>
        )}

        {/* Banner Error */}
        {saveError && (
          <View className="flex-row items-center gap-2 p-3 rounded-2xl bg-destructive/15 border border-destructive/30 mb-2">
            <AlertCircle size={18} color="#ef4444" />
            <View className="flex-1">
              <Text className="text-destructive font-bold text-xs">Error al guardar</Text>
              <Text className="text-destructive/90 text-[11px]">{saveError}</Text>
            </View>
          </View>
        )}

        {/* Botón Guardar (Sticky al pie del modal) */}
        <Button
          onPress={handleSubmit(onSubmit)}
          disabled={isPending || (!isDirty && !saveSuccess)}
          className={`h-12 flex-row items-center justify-center gap-2 ${
            saveSuccess ? "bg-green-600" : ""
          }`}
        >
          {isPending ? (
            <>
              <ActivityIndicator color="#fff" size="small" />
              <Text className="text-primary-foreground text-sm font-bold">
                Guardando cambios…
              </Text>
            </>
          ) : saveSuccess ? (
            <>
              <CheckCircle2 color="#fff" size={18} />
              <Text className="text-white text-sm font-bold">¡Guardado con éxito!</Text>
            </>
          ) : (
            <>
              <Save size={16} color="#fff" />
              <Text className="text-primary-foreground text-sm font-bold">Guardar cambios</Text>
            </>
          )}
        </Button>
      </View>
    </View>
  );
}
