import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { CreditCard, Shield, MapPin } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { getThemeColors } from '@/lib/theme';

export type ClientProfileTab = 'credits' | 'guarantees' | 'location';

interface TabConfig {
  key: ClientProfileTab;
  label: string;
  Icon: React.ComponentType<{ size: number; color: string }>;
}

const TABS: TabConfig[] = [
  { key: 'credits', label: 'Créditos', Icon: CreditCard },
  { key: 'guarantees', label: 'Garantías', Icon: Shield },
  { key: 'location', label: 'Ubicación', Icon: MapPin },
];

interface ClientProfileTabsProps {
  activeTab: ClientProfileTab;
  onTabChange: (tab: ClientProfileTab) => void;
}

export function ClientProfileTabs({ activeTab, onTabChange }: ClientProfileTabsProps) {
  const { colorScheme } = useColorScheme();
  const colors = getThemeColors(colorScheme);

  return (
    <View className="flex-row border-b border-border bg-background">
      {TABS.map(({ key, label, Icon }) => {
        const isActive = activeTab === key;

        return (
          <Pressable
            key={key}
            onPress={() => onTabChange(key)}
            className="flex-1 items-center pb-3 pt-2 gap-0.5"
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            <Icon
              size={20}
              color={isActive ? colors.tabActive : colors.tabInactive}
            />
            <Text
              className={`text-sm font-semibold ${
                isActive ? 'text-secondary dark:text-primary' : 'text-muted-foreground'
              }`}
            >
              {label}
            </Text>
            {/* Indicador activo */}
            {isActive && (
              <View
                className="absolute bottom-0 left-3 right-3 h-[2.5px] bg-secondary dark:bg-primary rounded-full"
              />
            )}
          </Pressable>
        );
      })}
    </View>
  );
}
