import React from 'react';
import { View, Image, Pressable, Alert, Linking, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Text } from '@/components/ui/text';
import { Camera, X } from 'lucide-react-native';
import { palette } from '@/lib/theme/colors';
import type { ClientImagePayload } from '@/types/client';
import { getInitials } from '@/lib/format';

const MAX_IMAGE_BYTES = 20 * 1024 * 1024; // límite del backend (20 MB)

interface ClientPhotoPickerProps {
  /** Nombre del cliente, usado para generar las iniciales del avatar por defecto. */
  clientName: string;
  /** Imagen nueva seleccionada por el usuario (null = sin selección nueva). */
  value: ClientImagePayload | null;
  /** URL de la foto actual del cliente en modo edición. */
  existingUrl?: string | null;
  onChange: (image: ClientImagePayload | null) => void;
}

/**
 * Selector de foto de perfil para el formulario de crear/editar cliente.
 *
 * Muestra un avatar circular:
 * - Sin foto: initiales del nombre + ícono de cámara superpuesto.
 * - Con foto seleccionada/existente: preview circular + ícono de cámara para cambiar
 *   y botón X para quitar la nueva selección (vuelve a la existente en edición).
 *
 * Patrón multipart: el payload devuelto en `onChange` se adjunta al FormData
 * con la clave 'image' antes de enviar al backend.
 */
export function ClientPhotoPicker({
  clientName,
  value,
  existingUrl,
  onChange,
}: ClientPhotoPickerProps) {
  const previewUri = value?.uri ?? existingUrl ?? null;
  const initials = getInitials(clientName || 'CL');

  const openGallery = async () => {
    // En web, expo-image-picker usa un <input type="file"> nativo — no necesita permiso.
    if (Platform.OS !== 'web') {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Permiso necesario',
          'PrestamosYA necesita acceso a tus fotos para adjuntar la foto del cliente.',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Abrir ajustes', onPress: () => Linking.openSettings() },
          ],
        );
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });

    if (result.canceled || result.assets.length === 0) return;

    const asset = result.assets[0];
    if (asset.fileSize && asset.fileSize > MAX_IMAGE_BYTES) {
      Alert.alert(
        'Imagen muy grande',
        'La imagen supera el límite de 20 MB. Selecciona una de menor tamaño.',
      );
      return;
    }

    onChange({
      uri: asset.uri,
      name: asset.fileName ?? `cliente-${Date.now()}.jpg`,
      mimeType: asset.mimeType ?? 'image/jpeg',
    });
  };

  const handleClear = () => {
    // En edición vuelve a mostrar la foto existente; en creación queda vacío.
    onChange(null);
  };

  return (
    <View className="items-center gap-2">
      <View className="relative">
        {/* Avatar circular */}
        <Pressable
          onPress={openGallery}
          className="h-24 w-24 rounded-full overflow-hidden bg-primary/20 items-center justify-center active:opacity-80"
        >
          {previewUri ? (
            <Image
              source={{ uri: previewUri }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <Text className="text-secondary font-bold text-3xl">{initials}</Text>
          )}
        </Pressable>

        {/* Badge de cámara — siempre visible para invitar a tocar */}
        <Pressable
          onPress={openGallery}
          className="absolute bottom-0 right-0 bg-secondary h-8 w-8 rounded-full items-center justify-center border-2 border-background shadow-sm active:opacity-80"
        >
          <Camera size={16} color="#ffffff" />
        </Pressable>

        {/* Botón X para limpiar la nueva selección (solo si el usuario eligió una imagen nueva) */}
        {value && (
          <Pressable
            onPress={handleClear}
            className="absolute -top-1 -right-1 bg-destructive h-6 w-6 rounded-full items-center justify-center border border-background shadow-sm"
          >
            <X size={12} color="#ffffff" />
          </Pressable>
        )}
      </View>

      <Text className="text-muted-foreground text-xs font-medium">
        {previewUri ? 'Toca para cambiar' : 'Foto de perfil (opcional)'}
      </Text>
    </View>
  );
}

