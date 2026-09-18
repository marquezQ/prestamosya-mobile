import { View, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { Sun, Moon, User as UserIcon, UserCog, LogOut } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { Icon } from "@/components/ui/icon";
import { useLogout } from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function HeaderActions() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const { mutate: logout } = useLogout();
  const router = useRouter();

  return (
    <View className="flex-row items-center gap-4 pr-4">
      <Pressable
        onPress={toggleColorScheme}
        className="rounded-full bg-muted p-2"
        accessibilityLabel={colorScheme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      >
        <Icon
          as={colorScheme === "dark" ? Sun : Moon}
          className="text-foreground"
          size={20}
        />
      </Pressable>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Pressable
            className="rounded-full bg-muted p-2"
            accessibilityLabel="Menú de usuario"
          >
            <Icon
              as={UserIcon}
              className="text-foreground"
              size={20}
            />
          </Pressable>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent className="w-56 mt-2" align="end">
          <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {/* Navega a la pantalla de perfil (fullscreen, fuera de tabs) */}
          <DropdownMenuItem onPress={() => router.push("/(app)/profile")}>
            <Icon as={UserCog} className="text-foreground mr-2" size={16} />
            <Text>Editar perfil</Text>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem variant="destructive" onPress={() => logout()}>
            <Icon as={LogOut} className="text-destructive mr-2" size={16} />
            <Text className="text-destructive">Cerrar sesión</Text>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </View>
  );
}
