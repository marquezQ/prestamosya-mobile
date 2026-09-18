import { useState } from "react";
import { View, Pressable, ActivityIndicator } from "react-native";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { KeyRound, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useChangePassword } from "@/hooks/useChangePassword";
import { getApiErrorMessage } from "@/services/api";
import { Icon } from "@/components/ui/icon";
import { KeyboardAwareScrollView } from "@/components/ui/KeyboardAwareScrollView";

// ─── Schema ────────────────────────────────────────────────────────────────────
const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "La contraseña actual es requerida"),
    newPassword: z
      .string()
      .min(6, "La nueva contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string().min(1, "Confirma la nueva contraseña"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

interface ChangePasswordFormProps {
  onSuccessCallback?: () => void;
}

// ─── Component ─────────────────────────────────────────────────────────────────
export function ChangePasswordForm({ onSuccessCallback }: ChangePasswordFormProps) {
  const { mutate: changePassword, isPending } = useChangePassword();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: ChangePasswordFormValues) => {
    setSuccessMsg(false);
    setErrorMsg(null);

    changePassword(
      {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      },
      {
        onSuccess: () => {
          setSuccessMsg(true);
          reset();
          if (onSuccessCallback) {
            setTimeout(() => {
              onSuccessCallback();
            }, 1500);
          }
        },
        onError: (err) => {
          setErrorMsg(
            getApiErrorMessage(err, "No se pudo cambiar la contraseña. Inténtalo de nuevo.")
          );
        },
      }
    );
  };

  const isFormDisabled = isPending || successMsg;

  return (
    <View className="flex-col">
      {/* Scrollable Inputs */}
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 8 }}
      >
        <View className="gap-3">
          {/* Contraseña actual */}
          <View className="gap-1">
            <Label nativeID="currentPassword-label">Contraseña actual</Label>
            <Controller
              control={control}
              name="currentPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <View className="relative">
                  <Input
                    placeholder="••••••••"
                    secureTextEntry={!showCurrent}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isFormDisabled}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    className="pr-12"
                    aria-labelledby="currentPassword-label"
                  />
                  <Pressable
                    onPress={() => !isFormDisabled && setShowCurrent((v) => !v)}
                    className="absolute right-0 top-0 bottom-0 px-3 justify-center"
                    accessibilityLabel={showCurrent ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    <Icon
                      as={showCurrent ? EyeOff : Eye}
                      size={20}
                      className="text-muted-foreground"
                    />
                  </Pressable>
                </View>
              )}
            />
            {errors.currentPassword && (
              <Text className="text-destructive text-xs mt-0.5">{errors.currentPassword.message}</Text>
            )}
          </View>

          {/* Nueva contraseña */}
          <View className="gap-1">
            <Label nativeID="newPassword-label">Nueva contraseña</Label>
            <Controller
              control={control}
              name="newPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <View className="relative">
                  <Input
                    placeholder="••••••••"
                    secureTextEntry={!showNew}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isFormDisabled}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    className="pr-12"
                    aria-labelledby="newPassword-label"
                  />
                  <Pressable
                    onPress={() => !isFormDisabled && setShowNew((v) => !v)}
                    className="absolute right-0 top-0 bottom-0 px-3 justify-center"
                    accessibilityLabel={showNew ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    <Icon
                      as={showNew ? EyeOff : Eye}
                      size={20}
                      className="text-muted-foreground"
                    />
                  </Pressable>
                </View>
              )}
            />
            {errors.newPassword && (
              <Text className="text-destructive text-xs mt-0.5">{errors.newPassword.message}</Text>
            )}
          </View>

          {/* Confirmar contraseña */}
          <View className="gap-1">
            <Label nativeID="confirmPassword-label">Confirmar nueva contraseña</Label>
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <View className="relative">
                  <Input
                    placeholder="••••••••"
                    secureTextEntry={!showConfirm}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isFormDisabled}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    className="pr-12"
                    aria-labelledby="confirmPassword-label"
                  />
                  <Pressable
                    onPress={() => !isFormDisabled && setShowConfirm((v) => !v)}
                    className="absolute right-0 top-0 bottom-0 px-3 justify-center"
                    accessibilityLabel={showConfirm ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    <Icon
                      as={showConfirm ? EyeOff : Eye}
                      size={20}
                      className="text-muted-foreground"
                    />
                  </Pressable>
                </View>
              )}
            />
            {errors.confirmPassword && (
              <Text className="text-destructive text-xs mt-0.5">{errors.confirmPassword.message}</Text>
            )}
          </View>
        </View>
      </KeyboardAwareScrollView>

      {/* Sticky Bottom Container: Feedback + Botón Guardar (SIEMPRE VISIBLE SIN SCROLL) */}
      <View className="pt-3 border-t border-border/40 mt-2">
        {/* Banner Exitoso */}
        {successMsg && (
          <View className="flex-row items-center gap-2 p-3 rounded-2xl bg-green-500/15 border border-green-500/30 mb-2">
            <CheckCircle2 size={18} color="#22c55e" />
            <View className="flex-1">
              <Text className="text-green-600 dark:text-green-400 font-bold text-xs">
                ¡Contraseña actualizada con éxito!
              </Text>
              <Text className="text-green-700/80 dark:text-green-300/80 text-[11px]">
                Cerrando ventana...
              </Text>
            </View>
          </View>
        )}

        {/* Banner Error */}
        {errorMsg && (
          <View className="flex-row items-center gap-2 p-3 rounded-2xl bg-destructive/15 border border-destructive/30 mb-2">
            <AlertCircle size={18} color="#ef4444" />
            <View className="flex-1">
              <Text className="text-destructive font-bold text-xs">No se pudo actualizar</Text>
              <Text className="text-destructive/90 text-[11px]">{errorMsg}</Text>
            </View>
          </View>
        )}

        {/* Botón Guardar */}
        <Button
          onPress={handleSubmit(onSubmit)}
          disabled={isFormDisabled}
          className={`h-12 flex-row items-center justify-center gap-2 ${
            successMsg ? "bg-green-600" : ""
          }`}
        >
          {isPending ? (
            <>
              <ActivityIndicator color="#fff" size="small" />
              <Text className="text-primary-foreground text-sm font-bold">
                Cambiando contraseña…
              </Text>
            </>
          ) : successMsg ? (
            <>
              <CheckCircle2 color="#fff" size={18} />
              <Text className="text-white text-sm font-bold">¡Contraseña Guardada!</Text>
            </>
          ) : (
            <>
              <KeyRound color="#fff" size={16} />
              <Text className="text-primary-foreground text-sm font-bold">
                Guardar contraseña
              </Text>
            </>
          )}
        </Button>
      </View>
    </View>
  );
}
