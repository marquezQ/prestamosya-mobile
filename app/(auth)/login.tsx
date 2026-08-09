import { useState } from "react";
import { View, TouchableWithoutFeedback, Keyboard, ActivityIndicator, Platform } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLogin } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { KeyboardAwareScrollView } from "@/components/ui/KeyboardAwareScrollView";
import { Banknote } from "lucide-react-native";
import { Icon } from "@/components/ui/icon";

// Esquema de validación usando Zod con límite de 15 caracteres
const loginSchema = z.object({
  username: z
    .string()
    .min(3, "El usuario debe tener al menos 3 caracteres")
    .max(15, "El usuario no puede exceder los 15 caracteres"),
  password: z
    .string()
    .min(5, "La contraseña debe tener al menos 5 caracteres"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const { mutate: login, isPending } = useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginForm) => {
    setErrorMessage(null);
    login(data, {
      onError: (error) => {
        setErrorMessage(error.message || "Credenciales incorrectas");
      },
    });
  };

  const formContent = (
    <View className="py-4">
      {/* Contenedor tipo Tarjeta (Card) */}
      <View className="bg-card border border-border/50 rounded-3xl p-6 sm:p-8 shadow-sm">
        
        {/* Header con Ícono y Textos */}
        <View className="items-center mb-8">
          <View className="w-20 h-20 rounded-full bg-primary/15 items-center justify-center mb-5">
            <Icon as={Banknote} className="text-primary" size={40} />
          </View>
          <Text className="text-3xl font-extrabold text-foreground tracking-tight">
            PrestamosYA
          </Text>
          <Text className="text-muted-foreground mt-2 text-center text-sm leading-5">
            Ingresa tus credenciales para acceder a tu panel de gestión y cobros.
          </Text>
        </View>

        {/* Formulario */}
        <View className="gap-5">
          {/* Mensaje de Error */}
          {errorMessage && (
            <View className="bg-destructive/15 px-4 py-3 rounded-xl border border-destructive/30">
              <Text className="text-destructive text-center text-sm font-semibold">
                {errorMessage}
              </Text>
            </View>
          )}

          <View className="gap-2.5">
            <Label nativeID="username" className="text-foreground ml-1">
              Nombre de usuario
            </Label>
            <Controller
              control={control}
              name="username"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <Input
                    placeholder="Ej. admin"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isPending}
                    aria-labelledby="username"
                    className="bg-background"
                  />
                  {errors.username && (
                    <Text className="text-destructive text-xs mt-1.5 ml-1 font-medium">
                      {errors.username.message}
                    </Text>
                  )}
                </View>
              )}
            />
          </View>

          <View className="gap-2.5">
            <Label nativeID="password" className="text-foreground ml-1">
              Contraseña
            </Label>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <Input
                    placeholder="••••••••"
                    secureTextEntry
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    editable={!isPending}
                    aria-labelledby="password"
                    className="bg-background"
                  />
                  {errors.password && (
                    <Text className="text-destructive text-xs mt-1.5 ml-1 font-medium">
                      {errors.password.message}
                    </Text>
                  )}
                </View>
              )}
            />
          </View>

          <Button 
            onPress={handleSubmit(onSubmit)} 
            disabled={isPending}
            className="mt-6 bg-primary rounded-xl h-12 shadow-sm"
          >
            {isPending ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-primary-foreground font-bold text-base">
                Iniciar Sesión
              </Text>
            )}
          </Button>
        </View>
        
      </View>
    </View>
  );

  return (
    <>
      <KeyboardAwareScrollView
        className="flex-1 bg-muted/30"
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingHorizontal: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        {Platform.OS === 'web' ? (
          formContent
        ) : (
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            {formContent}
          </TouchableWithoutFeedback>
        )}
      </KeyboardAwareScrollView>
    </>
  );
}
