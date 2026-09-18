import { View, ActivityIndicator } from "react-native";
import { Text } from "@/components/ui/text";
import { User as UserIcon, ShieldCheck, Calendar, BadgeCheck } from "lucide-react-native";
import { useUserProfile } from "@/hooks/useUserProfile";
import { getInitials } from "@/lib/format";
import { parseISO, format } from "date-fns";
import { es } from "date-fns/locale";
import { palette } from "@/lib/theme/colors";

const ROLE_LABELS: Record<string, string> = {
  admin: "Administrador",
  cashier: "Cajero",
  super_admin: "Super Admin",
};

export function UserInfoSection() {
  const { data: user, isLoading, isError } = useUserProfile();

  if (isLoading) {
    return (
      <View className="bg-card border border-border/60 rounded-3xl p-6 items-center justify-center min-h-[160px]">
        <ActivityIndicator color={palette.celeste} />
      </View>
    );
  }

  if (isError || !user) {
    return (
      <View className="bg-card border border-border/60 rounded-3xl p-6 items-center justify-center min-h-[160px]">
        <UserIcon size={32} color={palette.azul} />
        <Text className="text-muted-foreground text-sm mt-2">
          No se pudo cargar la información del perfil.
        </Text>
      </View>
    );
  }

  const initials = getInitials(user.name);
  const roleLabel = ROLE_LABELS[user.role] ?? user.role;
  const memberSince = user.createdAt
    ? format(parseISO(user.createdAt), "MMMM yyyy", { locale: es })
    : null;

  return (
    <View className="bg-card border border-border/60 rounded-3xl p-6">
      {/* Avatar con iniciales */}
      <View className="items-center mb-5">
        <View className="w-20 h-20 rounded-full bg-secondary/15 border-2 border-secondary/30 items-center justify-center mb-3">
          <Text className="text-secondary font-bold text-2xl">{initials}</Text>
        </View>
        <Text className="text-foreground font-bold text-xl">{user.name}</Text>
        <Text className="text-muted-foreground text-base mt-0.5">@{user.username}</Text>
      </View>

      {/* Divider */}
      <View className="h-px bg-border/60 mb-4" />

      {/* Info rows */}
      <View className="gap-3">
        <View className="flex-row items-center gap-3">
          <View className="w-8 h-8 rounded-xl bg-primary/10 items-center justify-center">
            <ShieldCheck size={16} color={palette.celeste} />
          </View>
          <View className="flex-1">
            <Text className="text-muted-foreground text-xs font-bold uppercase tracking-wider">
              Rol
            </Text>
            <Text className="text-foreground text-base font-semibold">{roleLabel}</Text>
          </View>
          {/* Indicador de cuenta activa */}
          {user.isActive !== undefined && (
            <View
              className={`px-2 py-0.5 rounded-full ${
                user.isActive ? "bg-green-500/15" : "bg-destructive/15"
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  user.isActive ? "text-green-600" : "text-destructive"
                }`}
              >
                {user.isActive ? "Activo" : "Inactivo"}
              </Text>
            </View>
          )}
        </View>

        {memberSince && (
          <View className="flex-row items-center gap-3">
            <View className="w-8 h-8 rounded-xl bg-primary/10 items-center justify-center">
              <Calendar size={16} color={palette.celeste} />
            </View>
            <View className="flex-1">
              <Text className="text-muted-foreground text-xs font-bold uppercase tracking-wider">
                Miembro desde
              </Text>
              <Text className="text-foreground text-base font-semibold capitalize">
                {memberSince}
              </Text>
            </View>
          </View>
        )}

        <View className="flex-row items-center gap-3">
          <View className="w-8 h-8 rounded-xl bg-primary/10 items-center justify-center">
            <BadgeCheck size={16} color={palette.celeste} />
          </View>
          <View className="flex-1">
            <Text className="text-muted-foreground text-xs font-bold uppercase tracking-wider">
              Nombre de usuario
            </Text>
            <Text className="text-foreground text-base font-semibold">{user.username}</Text>
          </View>
        </View>
      </View>

      {/* Nota: el nombre solo puede ser editado por el super admin */}
      <View className="mt-4 p-3 rounded-2xl bg-muted/40 border border-border/40">
        <Text className="text-muted-foreground text-xs text-center">
          Los datos del perfil son gestionados por el administrador.
        </Text>
      </View>
    </View>
  );
}
