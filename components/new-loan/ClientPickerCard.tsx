import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Check } from 'lucide-react-native';

interface ClientPickerCardProps {
  fullName: string;
  idNumber: string;
  isSelected: boolean;
  onPress: () => void;
}

export function ClientPickerCard({
  fullName,
  idNumber,
  isSelected,
  onPress,
}: ClientPickerCardProps) {
  const initials = getInitials(fullName);

  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center bg-card border rounded-xl px-4 py-3 mb-3 ${
        isSelected
          ? 'border-primary border-2'
          : 'border-border'
      }`}
    >
      {/* Avatar */}
      <Avatar
        alt={fullName}
        className="h-10 w-10 bg-primary/20 items-center justify-center shrink-0"
      >
        <AvatarFallback>
          <Text className="text-primary font-bold text-sm">{initials}</Text>
        </AvatarFallback>
      </Avatar>

      {/* Info */}
      <View className="flex-1 ml-3">
        <Text className="text-foreground font-bold text-base leading-snug">
          {fullName}
        </Text>
        <Text className="text-muted-foreground text-xs font-medium mt-0.5">
          CI: {idNumber}
        </Text>
      </View>

      {/* Check indicator */}
      {isSelected && (
        <View className="w-7 h-7 rounded-full bg-primary items-center justify-center ml-2">
          <Check size={16} color="#ffffff" />
        </View>
      )}
    </Pressable>
  );
}

function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}
