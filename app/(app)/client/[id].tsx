import React from 'react';
import { View, ActivityIndicator, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { useClientById } from '@/hooks/useClientById';
import { ClientDetailView } from '@/components/client-detail/ClientDetailView';
import { ArrowLeft } from 'lucide-react-native';

export default function ClientProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const { data, isLoading, isError } = useClientById(id as string);

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      {/* Custom Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-border bg-background">
        <Pressable 
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center -ml-2 rounded-full active:bg-muted"
        >
          <ArrowLeft size={24} className="text-foreground" />
        </Pressable>
        <Text className="font-bold text-lg text-foreground ml-2">
          Perfil de Cliente
        </Text>
      </View>

      {/* Content */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center p-4">
          <ActivityIndicator size="large" className="text-primary" />
          <Text className="text-muted-foreground mt-4 font-medium">
            Cargando perfil...
          </Text>
        </View>
      ) : isError || !data?.client ? (
        <View className="flex-1 items-center justify-center p-4">
          <Text className="text-destructive font-bold text-lg mb-2">
            Error al cargar
          </Text>
          <Text className="text-muted-foreground text-center">
            No se pudo obtener la información del cliente.
          </Text>
        </View>
      ) : (
        <ClientDetailView client={data.client} />
      )}
    </View>
  );
}
