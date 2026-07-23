import { View, Image } from "react-native";
import { Text } from "@/components/ui/text";

export function HeaderLogo() {
  return (
    <View className="flex-row items-center gap-2 pl-2">
      <Image
        source={require("@/assets/LogoP.png")}
        style={{ width: 32, height: 32 }}
        resizeMode="contain"
      />
      <Text className="text-xl font-bold text-secondary dark:text-primary">
        PrestamosYA
      </Text>
    </View>
  );
}
