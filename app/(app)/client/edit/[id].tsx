import React from 'react';
import { View, ActivityIndicator, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { useClientById } from '@/hooks/useClientById';
import { ClientForm } from '@/components/clients/ClientForm';
import { KeyboardAwareScrollView } from '@/components/ui/KeyboardAwareScrollView';
import { ArrowLeft } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { getThemeColors } from '@/lib/theme/colors';

export default function EditClientScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const colors = getThemeColors(colorScheme);

  const { data, isLoading, isError } = useClientById(id as string);

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      {/* Custom Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-border bg-background">
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center -ml-2 rounded-full active:bg-muted"
        >
          <ArrowLeft size={24} color={colors.foreground} />
        </Pressable>
        <Text className="font-bold text-lg text-foreground ml-2">
          Editar Cliente
        </Text>
      </View>

      {/* Content */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center p-4">
          <ActivityIndicator size="large" className="text-primary" />
          <Text className="text-muted-foreground mt-4 font-medium">
            Cargando datos del cliente...
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
        <KeyboardAwareScrollView
          contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 32 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <ClientForm
            clientToEdit={data.client}
            onSuccess={() => router.back()}
          />
        </KeyboardAwareScrollView>
      )}
    </View>
  );
}
