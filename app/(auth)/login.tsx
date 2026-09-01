import { useState } from "react";
import {
  View,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  Platform,
  Pressable,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLogin } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { KeyboardAwareScrollView } from "@/components/ui/KeyboardAwareScrollView";
import { User, Lock, Eye, EyeOff } from "lucide-react-native";

// #206ba5 es el color exacto de los bordes de prestamosYA.jpeg → sin costuras
const BG = "#206ba5";
const AZUL = "#2368A3";

const { width: SCREEN_W } = Dimensions.get("window");

const loginSchema = z.object({
  username: z
    .string()
    .min(3, "El usuario debe tener al menos 3 caracteres")
    .max(15, "El usuario no puede exceder los 15 caracteres"),
  password: z.string().min(5, "La contraseña debe tener al menos 5 caracteres"),
});

type LoginForm = z.infer<typeof loginSchema>;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },

  // ── Zona azul superior ────────────────────────────────────────
  hero: {
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: "center",
  },
  brandImage: {
    width: SCREEN_W,
    height: 160,
  },
  tagline: {
    marginTop: 16,
    color: "rgba(255,255,255,0.82)",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 24,
  },

  // ── Sección blanca (no llega al fondo) ───────────────────────
  sheet: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginHorizontal: 0,     // sigue de borde a borde
    paddingTop: 30,
    paddingHorizontal: 28,
    paddingBottom: 36,
    shadowColor: "#000",
    shadowOpacity: 0.10,
    shadowOffset: { width: 0, height: -3 },
    shadowRadius: 12,
    elevation: 10,
  },
  sheetTitle: {
    color: "#09090b",
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  sheetSub: {
    color: "#71717a",
    fontSize: 14,
    marginBottom: 24,
    lineHeight: 19,
  },

  // ── Campos ───────────────────────────────────────────────────
  fieldLabel: {
    color: "#3f3f46",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 7,
    marginLeft: 2,
  },
  fieldWrap: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  iconLeft:  { position: "absolute", left: 14, zIndex: 10 },
  iconRight: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    paddingHorizontal: 14,
    justifyContent: "center",
    zIndex: 10,
  },
  input: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#e4e4e7",
    backgroundColor: "#f9f9fb",
    paddingLeft: 44,
    paddingRight: 12,
    fontSize: 15,
    color: "#09090b",
    fontWeight: "500",
  },
  inputPR: { paddingRight: 48 },
  fieldError: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: -12,
    marginBottom: 12,
    marginLeft: 2,
    fontWeight: "500",
  },
  errorBox: {
    backgroundColor: "rgba(239,68,68,0.08)",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.25)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 13,
    textAlign: "center",
    fontWeight: "600",
  },

  // ── Botón ────────────────────────────────────────────────────
  btn: {
    backgroundColor: AZUL,
    borderRadius: 16,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    shadowColor: AZUL,
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    elevation: 6,
  },
  btnDisabled: { opacity: 0.65 },
  btnText: { color: "#ffffff", fontSize: 16, fontWeight: "700", letterSpacing: 0.2 },

  // ── Franja azul inferior con versión ─────────────────────────
  footer: {
    backgroundColor: BG,
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 24,
  },
  footerText: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 11,
    fontWeight: "500",
  },
});

export default function LoginScreen() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: login, isPending } = useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = (data: LoginForm) => {
    setErrorMessage(null);
    login(data, {
      onError: (error) => {
        setErrorMessage(error.message || "Credenciales incorrectas");
      },
    });
  };

  const inner = (
    <View style={s.root}>
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Zona azul: imagen grande sin márgenes + tagline ── */}
        <View style={s.hero}>
          <Image
            source={require("@/assets/prestamosYA.jpeg")}
            resizeMode="contain"
            style={s.brandImage}
          />
          <Text style={s.tagline}>
            Gestión de préstamos y cobros en tus manos
          </Text>
        </View>

        {/* ── Sección blanca: solo esquinas superiores redondeadas ── */}
        <View style={s.sheet}>
          <Text style={s.sheetTitle}>Bienvenido</Text>
          <Text style={s.sheetSub}>Ingresa tus credenciales para acceder</Text>

          {errorMessage && (
            <View style={s.errorBox}>
              <Text style={s.errorText}>{errorMessage}</Text>
            </View>
          )}

          {/* Usuario */}
          <Text style={s.fieldLabel}>Usuario</Text>
          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <View style={s.fieldWrap}>
                  <View style={s.iconLeft}><User size={18} color={AZUL} /></View>
                  <Input
                    placeholder="Ej. admin"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isPending}
                    aria-labelledby="username"
                    style={s.input}
                    className="border-0"
                  />
                </View>
                {errors.username && (
                  <Text style={s.fieldError}>{errors.username.message}</Text>
                )}
              </>
            )}
          />

          {/* Contraseña */}
          <Text style={s.fieldLabel}>Contraseña</Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <View style={s.fieldWrap}>
                  <View style={s.iconLeft}><Lock size={18} color={AZUL} /></View>
                  <Input
                    placeholder="••••••••"
                    secureTextEntry={!showPassword}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    editable={!isPending}
                    aria-labelledby="password"
                    style={[s.input, s.inputPR]}
                    className="border-0"
                  />
                  <Pressable onPress={() => setShowPassword(!showPassword)} style={s.iconRight}>
                    {showPassword
                      ? <EyeOff size={18} color="#71717a" />
                      : <Eye size={18} color="#71717a" />}
                  </Pressable>
                </View>
                {errors.password && (
                  <Text style={s.fieldError}>{errors.password.message}</Text>
                )}
              </>
            )}
          />

          {/* Botón */}
          <Pressable
            onPress={handleSubmit(onSubmit)}
            disabled={isPending}
            style={[s.btn, isPending && s.btnDisabled]}
          >
            {isPending
              ? <ActivityIndicator color="#ffffff" size="small" />
              : <Text style={s.btnText}>Iniciar Sesión</Text>}
          </Pressable>
        </View>

        {/* ── Franja azul inferior con versión ── */}
        <View style={s.footer}>
          <Text style={s.footerText}>PrestamosYA Mobile · v1.0.0</Text>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );

  if (Platform.OS === "web") return inner;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>{inner}</TouchableWithoutFeedback>
  );
}
