import { useState } from "react";
import { View, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft, KeyRound } from "lucide-react-native";
import { Button } from "@/components/ui/button";
import { UserInfoSection } from "@/components/profile/UserInfoSection";
import { BusinessConfigSection } from "@/components/profile/BusinessConfigSection";
import { BusinessConfigModal } from "@/components/profile/BusinessConfigModal";
import { ChangePasswordModal } from "@/components/profile/ChangePasswordModal";
import { KeyboardAwareScrollView } from "@/components/ui/KeyboardAwareScrollView";
import { getThemeColors, palette } from "@/lib/theme/colors";
import { useColorScheme } from "nativewind";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const colors = getThemeColors(colorScheme);

  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  return (
    <View className="flex-1 bg-background">
      {/* Custom Header */}
      <View
        style={{ paddingTop: Math.max(insets.top, 16) }}
        className="px-4 pb-4 bg-card border-b border-border/60 flex-row items-center gap-3"
      >
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 rounded-2xl bg-muted/60 items-center justify-center active:bg-muted"
          accessibilityLabel="Volver"
        >
          <ArrowLeft size={20} color={colors.foreground} />
        </Pressable>
        <View className="flex-1">
          <Text className="text-foreground font-bold text-xl">Mi Perfil</Text>
          <Text className="text-muted-foreground text-xs">Información y configuración</Text>
        </View>
      </View>

      {/* Scrollable Content */}
      <KeyboardAwareScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="gap-6">
          {/* 1 — Información del usuario (solo lectura) */}
          <UserInfoSection />

          {/* 2 — Seguridad: Botón para cambiar contraseña en modal */}
          <View className="bg-card border border-border/60 rounded-3xl p-5 flex-row items-center justify-between">
            <View className="flex-row items-center gap-3 flex-1 pr-2">
              <View className="w-10 h-10 rounded-2xl bg-primary/10 items-center justify-center">
                <KeyRound size={20} color={palette.celeste} />
              </View>
              <View className="flex-1">
                <Text className="text-foreground font-bold text-base">Seguridad</Text>
                <Text className="text-muted-foreground text-xs">Actualiza tu contraseña</Text>
              </View>
            </View>
            <Button
              onPress={() => setIsPasswordModalOpen(true)}
              variant="outline"
              className="border-primary/40"
            >
              <Text className="text-primary font-bold text-sm">Cambiar contraseña</Text>
            </Button>
          </View>

          {/* 3 — Configuración del Negocio (Informativo + Botón cambiar valores) */}
          <BusinessConfigSection onEditPress={() => setIsConfigModalOpen(true)} />
        </View>
      </KeyboardAwareScrollView>

      {/* Modales de edición */}
      <BusinessConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
      />
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </View>
  );
}
