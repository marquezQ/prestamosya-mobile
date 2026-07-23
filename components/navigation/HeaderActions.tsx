import { View, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { Sun, Moon, User as UserIcon, Settings, LogOut } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { Icon } from "@/components/ui/icon";
import { useLogout } from "@/hooks/useAuth";
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

  return (
    <View className="flex-row items-center gap-4 pr-4">
      <Pressable
        onPress={toggleColorScheme}
        className="rounded-full bg-muted p-2"
      >
        <Icon
          as={colorScheme === "dark" ? Sun : Moon}
          className="text-foreground"
          size={20}
        />
      </Pressable>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Pressable className="rounded-full bg-muted p-2">
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
          
          <DropdownMenuItem>
            <Icon as={Settings} className="text-foreground mr-2" size={16} />
            <Text>Configuración</Text>
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
