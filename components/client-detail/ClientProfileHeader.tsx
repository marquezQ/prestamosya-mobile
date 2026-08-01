import React from 'react';
import { View, Pressable, Linking, Platform } from 'react-native';
import { Text } from '@/components/ui/text';
import { Client } from '@/types/client';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Phone, MessageCircle, CheckCircle2 } from 'lucide-react-native';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ClientProfileHeaderProps {
  client: Client;
}

export function ClientProfileHeader({ client }: ClientProfileHeaderProps) {
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
      // Remover espacios y caracteres no numéricos
      const phone = client.phone.replace(/\D/g, '');
      const url = `whatsapp://send?phone=${phone}`;
      
      Linking.canOpenURL(url)
        .then((supported) => {
          if (!supported) {
            // Fallback a versión web si no tiene whatsapp instalado
            return Linking.openURL(`https://wa.me/${phone}`);
          }
          return Linking.openURL(url);
        })
        .catch((err) => console.error('An error occurred', err));
    }
  };

  const memberSince = format(new Date(client.createdAt), 'MMMM yyyy', { locale: es });
  // Capitalize first letter
  const formattedMemberSince = memberSince.charAt(0).toUpperCase() + memberSince.slice(1);

  return (
    <View className="items-center px-4 py-6">
      {/* Avatar Section */}
      <View className="relative mb-4">
        <Avatar alt={client.fullName} className="h-20 w-20 bg-primary/20 items-center justify-center">
          <AvatarFallback>
            <Text className="text-primary font-bold text-3xl">
              {getInitials(client.fullName)}
            </Text>
          </AvatarFallback>
        </Avatar>
        <View className="absolute bottom-0 right-0 bg-background rounded-full">
          <CheckCircle2 size={24} className="text-secondary" />
        </View>
      </View>

      {/* Name and ID Section */}
      <Text className="text-2xl font-bold text-foreground text-center mb-1">
        {client.fullName}
      </Text>
      <Text className="text-muted-foreground text-sm text-center mb-6">
        Cliente desde {formattedMemberSince} • CI: {client.idNumber}
      </Text>

      {/* Actions */}
      <View className="flex-row w-full gap-4">
        <Button
          variant="outline"
          className="flex-1 flex-row items-center justify-center gap-2"
          onPress={handleCall}
          disabled={!client.phone}
        >
          <Phone size={18} className="text-foreground" />
          <Text className="font-semibold text-foreground">Llamar</Text>
        </Button>
        <Button
          className="flex-1 flex-row items-center justify-center gap-2 bg-accent active:bg-accent/80"
          onPress={handleWhatsApp}
          disabled={!client.phone}
        >
          <MessageCircle size={18} className="text-accent-foreground" />
          <Text className="font-semibold text-accent-foreground">WhatsApp</Text>
        </Button>
      </View>
    </View>
  );
}
