import React from 'react';
import { View, Image, Pressable, Alert, Linking } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Text } from '@/components/ui/text';
import { ImagePlus, X } from 'lucide-react-native';
import { palette } from '@/lib/theme/colors';
import type { GuaranteeImagePayload } from '@/types/guarantee';

const MAX_IMAGE_BYTES = 20 * 1024 * 1024; // límite del backend

interface GuaranteePhotoPickerProps {
  /** Imagen nueva seleccionada por el usuario (null = sin selección). */
  value: GuaranteeImagePayload | null;
  /** Foto actual en modo edición; se muestra mientras no se elija una nueva. */
  existingUrl?: string | null;
  onChange: (image: GuaranteeImagePayload | null) => void;
}

export function GuaranteePhotoPicker({ value, existingUrl, onChange }: GuaranteePhotoPickerProps) {
  const previewUri = value?.uri ?? existingUrl ?? null;

  const openGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        'Permiso necesario',
        'PrestamosYA necesita acceso a tus fotos para adjuntar la imagen de la garantía.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Abrir ajustes', onPress: () => Linking.openSettings() },
        ],
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      // Sin allowsEditing: la imagen original pasa intacta (el crop nativo
      // forzado con aspect fijo rechaza imágenes muy largas). El recorte
      // visual lo hacen el card y el visor con resizeMode.
      quality: 0.7,
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
      name: asset.fileName ?? `garantia-${Date.now()}.jpg`,
      mimeType: asset.mimeType ?? 'image/jpeg',
    });
  };

  const handleClear = () => {
    // En edición vuelve a la foto existente; en creación queda vacío.
    onChange(null);
  };

  if (!previewUri) {
    return (
      <Pressable
        onPress={openGallery}
        className="h-40 rounded-xl border border-dashed border-border bg-muted/30 items-center justify-center gap-2 active:bg-muted/50"
      >
        <View className="bg-primary/10 rounded-full p-3">
          <ImagePlus size={22} color={palette.azul} />
        </View>
        <Text className="text-secondary text-sm font-bold">Agregar foto</Text>
        <Text className="text-muted-foreground text-xs font-medium">
          Desde tu galería · máx. 20 MB
        </Text>
      </Pressable>
    );
  }

  return (
    <View>
      <Pressable
        onPress={openGallery}
        className="relative rounded-xl overflow-hidden border border-border bg-muted active:opacity-80"
      >
        <Image
          source={{ uri: previewUri }}
          className="w-full aspect-[4/3]"
          resizeMode="cover"
        />
        {/* Hint de reemplazo */}
        <View className="absolute bottom-2 right-2 bg-black/60 px-3 py-1.5 rounded-full">
          <Text className="text-white text-xs font-bold">
            {value ? 'Tocar para cambiar' : 'Tocar para reemplazar'}
          </Text>
        </View>
      </Pressable>

      {/* Quitar selección nueva (vuelve a la foto existente si hay una) */}
      {value && (
        <Pressable
          onPress={handleClear}
          className="absolute -top-2 -right-2 bg-destructive p-1.5 rounded-full shadow-sm"
        >
          <X size={14} color="#ffffff" />
        </Pressable>
      )}
    </View>
  );
}
