import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { LoanFilterScope } from '@/types/loan';
import { Layers, CheckCircle2, AlertTriangle, Archive } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { getThemeColors, palette } from '@/lib/theme/colors';

interface FilterOption {
  key: LoanFilterScope;
  label: string;
  icon: React.ComponentType<{ size: number; color: string }>;
  accentColor?: string;
}

const FILTER_OPTIONS: FilterOption[] = [
  {
    key: 'active',
    label: 'Activos',
    icon: Layers,
  },
  {
    key: 'up_to_date',
    label: 'Al Día',
    icon: CheckCircle2,
    accentColor: '#16a34a', // green-600
  },
  {
    key: 'overdue',
    label: 'En Mora',
    icon: AlertTriangle,
    accentColor: '#ef4444', // red-500
  },
  {
    key: 'completed',
    label: 'Finalizados',
    icon: Archive,
    accentColor: '#64748b', // slate-500
  },
];

interface LoanFilterTabsProps {
  selectedFilter: LoanFilterScope;
  onSelectFilter: (filter: LoanFilterScope) => void;
}

export function LoanFilterChips({
  selectedFilter,
  onSelectFilter,
}: LoanFilterTabsProps) {
  const { colorScheme } = useColorScheme();
  const colors = getThemeColors(colorScheme);

  return (
    <View className="flex-row border-b border-border bg-background">
      {FILTER_OPTIONS.map((option) => {
        const isActive = selectedFilter === option.key;
        const Icon = option.icon;

        const activeIndicatorColor =
          option.accentColor || (colorScheme === 'dark' ? palette.azul : palette.celeste);

        const iconColor = isActive ? activeIndicatorColor : colors.tabInactive;

        return (
          <TouchableOpacity
            key={option.key}
            onPress={() => onSelectFilter(option.key)}
            activeOpacity={0.7}
            className="flex-1 items-center pb-3 pt-2 gap-0.5 relative"
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            <Icon size={18} color={iconColor} />
            <Text
              className={`text-xs font-semibold ${
                isActive
                  ? 'text-foreground font-bold'
                  : 'text-muted-foreground'
              }`}
            >
              {option.label}
            </Text>

            {/* Indicador de pestaña activa inferior (idéntico al de ClientProfileTabs) */}
            {isActive && (
              <View
                style={{ backgroundColor: activeIndicatorColor }}
                className="absolute bottom-0 left-2 right-2 h-[2.5px] rounded-full"
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export const LoanFilterTabs = LoanFilterChips;
