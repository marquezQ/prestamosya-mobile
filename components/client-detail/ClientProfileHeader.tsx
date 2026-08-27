import React from 'react';
import { View, Linking } from 'react-native';
import { Text } from '@/components/ui/text';
import { Client } from '@/types/client';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Phone, MessageCircle, CheckCircle2, Pencil } from 'lucide-react-native';
import { Button } from '@/components/ui/button';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { palette, getThemeColors } from '@/lib/theme/colors';
import { useColorScheme } from 'nativewind';

interface ClientProfileHeaderProps {
  client: Client;
  onEdit?: () => void;
}

export function ClientProfileHeader({ client, onEdit }: ClientProfileHeaderProps) {
  const { colorScheme } = useColorScheme();
  const colors = getThemeColors(colorScheme);

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleCall = () => {
    if (client.phone) {
      Linking.openURL(`tel:${client.phone}`);
    }
  };

  const handleWhatsApp = () => {
    if (client.phone) {
      const phone = client.phone.replace(/\D/g, '');
      const url = `whatsapp://send?phone=${phone}`;

      Linking.canOpenURL(url)
        .then((supported) => {
          if (!supported) {
            return Linking.openURL(`https://wa.me/${phone}`);
          }
          return Linking.openURL(url);
        })
        .catch((err) => console.error('An error occurred', err));
    }
  };

  // parseISO maneja timestamps ISO completos; new Date() sobre strings de solo
  // fecha los interpretaría como UTC y desplazaría el día en Bolivia (UTC-4).
  const memberSince = format(parseISO(client.createdAt), 'MMMM yyyy', { locale: es });
  const formattedMemberSince = memberSince.charAt(0).toUpperCase() + memberSince.slice(1);

  return (
    <View className="items-center px-4 pt-3.5 pb-3 bg-card border-b border-border/40">
      {/* Avatar Section */}
      <View className="relative mb-2">
        <Avatar alt={client.fullName} className="h-16 w-16 bg-primary/20 items-center justify-center rounded-full">
          <AvatarFallback>
            <Text className="text-secondary font-bold text-2xl">
              {getInitials(client.fullName)}
            </Text>
          </AvatarFallback>
        </Avatar>
        <View className="absolute bottom-0 right-0 bg-background rounded-full p-0.5 border border-border">
          <CheckCircle2 size={16} color={palette.azul} />
        </View>
      </View>

      {/* Name and ID Section */}
      <Text className="text-xl font-bold text-foreground text-center mb-0.5">
        {client.fullName}
      </Text>
      <Text className="text-muted-foreground text-xs text-center mb-3 font-medium">
        Cliente ID: {client.idNumber} • Desde {formattedMemberSince}
      </Text>

      {/* Actions */}
      <View className="flex-row w-full gap-2.5">
        <Button
          variant="outline"
          className="flex-1 flex-row items-center justify-center gap-1.5 h-10 rounded-xl border-secondary/40 active:bg-secondary/10"
          onPress={handleCall}
          disabled={!client.phone}
        >
          <Phone size={16} color={palette.azul} />
          <Text className="font-bold text-secondary text-sm">Llamar</Text>
        </Button>
        <Button
          className="flex-1 flex-row items-center justify-center gap-1.5 bg-green-600 active:bg-green-700 h-10 rounded-xl"
          onPress={handleWhatsApp}
          disabled={!client.phone}
        >
          <MessageCircle size={16} color="#ffffff" />
          <Text className="font-bold text-white text-sm">WhatsApp</Text>
        </Button>
        {onEdit && (
          <Button
            variant="outline"
            className="flex-1 flex-row items-center justify-center gap-1.5 h-10 rounded-xl border-border active:bg-muted"
            onPress={onEdit}
          >
            <Pencil size={16} color={palette.azul} />
            <Text className="font-bold text-secondary text-sm">Editar</Text>
          </Button>
        )}
      </View>
    </View>
  );
}

