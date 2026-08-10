import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { Client } from '@/types/client';
import { Phone, MessageSquare } from 'lucide-react-native';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface ClientCardProps {
  client: Client;
  onPress?: (client: Client) => void;
}

export function ClientCard({ client, onPress }: ClientCardProps) {
  // Helpers para iniciales
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Determinamos si está al día en base a su estado real de la base de datos
  const isUpToDate = client.status !== 'OVERDUE';

  return (
    <Pressable
      onPress={() => onPress?.(client)}
      className="bg-card border border-border rounded-2xl p-4 mb-4 flex-col shadow-sm"
    >
      {/* Cabecera de la tarjeta */}
      <View className="flex-row items-start gap-3 mb-2">
        <Avatar alt={client.fullName} className="h-12 w-12 bg-primary/20 items-center justify-center shrink-0">
          <AvatarFallback>
            <Text className="text-primary font-bold text-lg">
              {getInitials(client.fullName)}
            </Text>
          </AvatarFallback>
        </Avatar>
        
        <View className="flex-1 justify-center">
          <View className="flex-row justify-between items-start mb-0.5">
            <Text className="text-foreground font-bold text-lg leading-snug flex-1 mr-2">
              {client.fullName}
            </Text>
            
            {/* Badge de estado (Mockeado) */}
            <View
              className={`flex-row items-center gap-1.5 px-2 py-0.5 rounded-full shrink-0 ${
                isUpToDate ? 'bg-green-500/10' : 'bg-red-500/10'
              }`}
            >
              <View
                className={`w-1.5 h-1.5 rounded-full ${
                  isUpToDate ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              <Text
                className={`text-xs font-bold uppercase tracking-wider ${
                  isUpToDate ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}
              >
                {isUpToDate ? 'Al día' : 'En mora'}
              </Text>
            </View>
          </View>

          <Text className="text-muted-foreground text-sm font-medium">
            CI: {client.idNumber}
          </Text>
        </View>
      </View>

      {/* Cuerpo y Acciones */}
      <View className="flex-row items-end justify-between mt-2">
        <View>
          <Text className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-1">
            SALDO PENDIENTE
          </Text>
          <Text
            className={`text-2xl font-bold ${
              isUpToDate ? 'text-secondary' : 'text-red-600 dark:text-red-400'
            }`}
          >
            0.00 Bs
          </Text>
        </View>

        <View className="flex-row gap-2">
          <Pressable className="h-12 w-12 items-center justify-center bg-muted rounded-xl border border-border">
            <Phone size={20} className="text-secondary" />
          </Pressable>
          <Pressable className="h-12 w-12 items-center justify-center bg-green-500/10 rounded-xl border border-green-500/20">
            <MessageSquare size={20} className="text-green-600 dark:text-green-500" />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}
