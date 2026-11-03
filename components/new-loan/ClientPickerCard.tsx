import React from 'react';
import { View, Pressable, Image } from 'react-native';
import { Text } from '@/components/ui/text';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Check } from 'lucide-react-native';
import { getInitials } from '@/lib/format';

interface ClientPickerCardProps {
  fullName: string;
  idNumber: string;
  photoUrl?: string | null;
  isSelected: boolean;
  onPress: () => void;
}

export function ClientPickerCard({
  fullName,
  idNumber,
  photoUrl,
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
        className="h-12 w-12 bg-primary/20 items-center justify-center shrink-0 rounded-full"
      >
        {photoUrl ? (
          <Image
            source={{ uri: photoUrl }}
            className="w-full h-full rounded-full"
            resizeMode="cover"
          />
        ) : (
          <AvatarFallback>
            <Text className="text-primary font-bold text-lg">{initials}</Text>
          </AvatarFallback>
        )}
      </Avatar>

      {/* Info */}
      <View className="flex-1 ml-3">
        <Text className="text-foreground font-bold text-lg leading-snug">
          {fullName}
        </Text>
        <Text className="text-muted-foreground text-sm font-medium mt-0.5">
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
