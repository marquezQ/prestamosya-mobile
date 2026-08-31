import React from 'react';
import { View, Pressable, Linking, GestureResponderEvent } from 'react-native';
import { Text } from '@/components/ui/text';
import { Client } from '@/types/client';
import { Phone, MessageSquare } from 'lucide-react-native';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { palette } from '@/lib/theme/colors';

interface ClientCardProps {
  client: Client;
  onPress?: (client: Client) => void;
}

function getClientStatusConfig(status: string) {
  switch (status?.toUpperCase()) {
    case 'DELINQUENT':
      return {
        label: 'En mora',
        badgeBg: 'bg-red-500/10',
        dotBg: 'bg-red-500',
        textColor: 'text-red-600 dark:text-red-400',
      };
    case 'NO_LOAN':
      return {
        label: 'Sin crédito',
        badgeBg: 'bg-muted',
        dotBg: 'bg-muted-foreground',
        textColor: 'text-muted-foreground',
      };
    case 'CURRENT':
    default:
      return {
        label: 'Al día',
        badgeBg: 'bg-green-500/10',
        dotBg: 'bg-green-500',
        textColor: 'text-green-600 dark:text-green-400',
      };
  }
}

export function ClientCard({ client, onPress }: ClientCardProps) {
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const statusConfig = getClientStatusConfig(client.status);

  const handleCall = (e: GestureResponderEvent) => {
    e.stopPropagation();
    if (client.phone) {
      Linking.openURL(`tel:${client.phone}`);
    }
  };

  const handleWhatsApp = (e: GestureResponderEvent) => {
    e.stopPropagation();
    if (client.phone) {
      const rawDigits = client.phone.replace(/\D/g, '');
      const phone = rawDigits.startsWith('591') ? rawDigits : `591${rawDigits}`;
      const url = `whatsapp://send?phone=${phone}`;
      Linking.canOpenURL(url).then((supported) => {
        if (!supported) return Linking.openURL(`https://wa.me/${phone}`);
        return Linking.openURL(url);
      });
    }
  };

  return (
    <Pressable
      onPress={() => onPress?.(client)}
      className="bg-card border border-border rounded-2xl p-3.5 mb-3 flex-row items-center gap-3 shadow-sm active:bg-muted/30"
    >
      {/* Avatar */}
      <Avatar alt={client.fullName} className="h-12 w-12 bg-primary/20 items-center justify-center shrink-0 rounded-full">
        <AvatarFallback>
          <Text className="text-secondary font-bold text-lg">
            {getInitials(client.fullName)}
          </Text>
        </AvatarFallback>
      </Avatar>

      {/* Info */}
      <View className="flex-1 justify-center">
        <Text className="text-foreground font-bold text-base leading-snug mb-1">
          {client.fullName}
        </Text>

        <View className="flex-row items-center gap-2 flex-wrap">
          <Text className="text-muted-foreground text-xs font-medium">
            CI: {client.idNumber}
          </Text>

          <View className="w-1 h-1 rounded-full bg-border" />

          {/* Status Badge */}
          <View className={`flex-row items-center gap-1.5 px-2 py-0.5 rounded-full ${statusConfig.badgeBg}`}>
            <View className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotBg}`} />
            <Text className={`text-xs font-bold uppercase tracking-wider ${statusConfig.textColor}`}>
              {statusConfig.label}
            </Text>
          </View>
        </View>
      </View>

      {/* Actions */}
      <View className="flex-row gap-2 shrink-0">
        <Pressable
          onPress={handleCall}
          className="h-10 w-10 items-center justify-center bg-muted rounded-xl border border-border active:bg-muted/80"
        >
          <Phone size={18} color={palette.azul} />
        </Pressable>

        <Pressable
          onPress={handleWhatsApp}
          className="h-10 w-10 items-center justify-center bg-green-500/10 rounded-xl border border-green-500/20 active:bg-green-500/20"
        >
          <MessageSquare size={18} color="#22c55e" />
        </Pressable>
      </View>
    </Pressable>
  );
}
