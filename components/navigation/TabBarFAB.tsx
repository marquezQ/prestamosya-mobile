import { View } from "react-native";
import { Plus } from "lucide-react-native";
import { palette } from "@/lib/theme";

interface TabBarFABProps {
  size: number;
}

export function TabBarFAB({ size }: TabBarFABProps) {
  return (
    <View
      style={{
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: palette.verde,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 24,
      }}
    >
      <Plus size={size + 2} color={palette.celeste} strokeWidth={2.5} />
    </View>
  );
}
