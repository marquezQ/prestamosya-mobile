import React, { useState } from 'react';
import { View, ScrollView, Pressable, ActivityIndicator, Image } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Shield, Car, Home, Package, Armchair, Plus, Pencil, Trash2 } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ClientGuaranteeSummary } from '@/types/client';
import {
  Guarantee,
  GuaranteeStatus,
  GuaranteeType,
} from '@/types/guarantee';
import { useGuaranteesByClientId } from '@/hooks/useGuarantees';
import { GuaranteeFormModal } from '../guarantees/GuaranteeFormModal';
import { DeleteGuaranteeDialog } from '../guarantees/DeleteGuaranteeDialog';
import { GuaranteeImageViewer } from '../guarantees/GuaranteeImageViewer';
import { palette, getThemeColors } from '@/lib/theme/colors';
import { useColorScheme } from 'nativewind';

interface GuaranteesTabProps {
  clientId: string;
  initialGuarantees?: ClientGuaranteeSummary[];
}

function getGuaranteeIcon(type: string) {
  switch (type?.toUpperCase()) {
    case 'VEHICLE':
      return Car;
    case 'REAL_ESTATE':
    case 'PROPERTY':
      return Home;
    case 'FURNITURE':
      return Armchair;
    default:
      return Package;
  }
}

function getGuaranteeStatusConfig(status: string) {
  switch (status?.toUpperCase()) {
    case 'IN_USE':
      return {
        label: 'En uso',
        bg: 'bg-amber-500/10',
        textColor: 'text-amber-600 dark:text-amber-400',
      };
    case 'RELEASED':
      return {
        label: 'Liberada',
        bg: 'bg-blue-500/10',
        textColor: 'text-blue-600 dark:text-blue-400',
      };
    case 'AVAILABLE':
    default:
      return {
        label: 'Disponible',
        bg: 'bg-green-500/10',
        textColor: 'text-green-600 dark:text-green-400',
      };
  }
}

/**
 * Adapta el resumen de garantía del perfil (GET /api/clients/:id) a la forma
 * completa que consumen los cards, mientras responde la query dedicada.
 */
function toCardGuarantee(summary: ClientGuaranteeSummary): Guarantee {
  return {
    id: summary.id,
    clientId: '',
    type: summary.type.toUpperCase() as GuaranteeType,
    description: summary.description,
    estimatedValue: Number(summary.estimatedValue),
    status: summary.status.toUpperCase() as GuaranteeStatus,
    imageUrl: summary.imageUrl ?? null,
    createdAt: summary.createdAt,
    updatedAt: summary.createdAt,
  };
}

export function GuaranteesTab({ clientId, initialGuarantees }: GuaranteesTabProps) {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const colors = getThemeColors(colorScheme);

  // Fetch guarantees from backend
  const { data: queryGuarantees, isLoading, isError } = useGuaranteesByClientId(clientId);

  // Fallback: mientras carga la query, usamos las garantías precargadas del perfil
  const guaranteesList = queryGuarantees ?? (initialGuarantees ? initialGuarantees.map(toCardGuarantee) : []);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [guaranteeToEdit, setGuaranteeToEdit] = useState<Guarantee | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [guaranteeToDelete, setGuaranteeToDelete] = useState<Guarantee | null>(null);

  // Visor fullscreen de la foto de garantía
  const [viewerImage, setViewerImage] = useState<{ url: string; description: string } | null>(
    null,
  );

  const handleCreate = () => {
    setGuaranteeToEdit(null);
    setIsFormOpen(true);
  };

  const handleEdit = (item: Guarantee) => {
    setGuaranteeToEdit(item);
    setIsFormOpen(true);
  };

  const handleDelete = (item: Guarantee) => {
    setGuaranteeToDelete(item);
    setIsDeleteOpen(true);
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: insets.bottom + 32, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header section with (+) button */}
        <View className="flex-row items-center justify-between mx-4 mb-3">
          <View className="flex-row items-center gap-2">
            <Text className="text-foreground font-bold text-xl tracking-tight">
              Garantías del Cliente
            </Text>
            <View className="bg-muted px-2.5 py-0.5 rounded-full">
              <Text className="text-muted-foreground text-xs font-bold">
                {guaranteesList.length}
              </Text>
            </View>
          </View>

          <Button
            onPress={handleCreate}
            className="bg-secondary active:bg-secondary/90 h-9 px-3.5 rounded-xl flex-row items-center gap-1.5"
          >
            <Plus size={16} color="#ffffff" />
            <Text className="text-white text-xs font-bold">Nueva Garantía</Text>
          </Button>
        </View>

        {/* Loading State */}
        {isLoading && guaranteesList.length === 0 && (
          <View className="py-12 items-center justify-center">
            <ActivityIndicator size="small" color={palette.azul} />
            <Text className="text-muted-foreground text-xs font-semibold mt-3">
              Cargando garantías...
            </Text>
          </View>
        )}

        {/* Empty State */}
        {!isLoading && guaranteesList.length === 0 && (
          <View className="mx-4 mt-2 border border-dashed border-border rounded-2xl p-6 items-center">
            <View className="bg-primary/10 rounded-full p-4 mb-3">
              <Shield size={32} color={palette.azul} />
            </View>
            <Text className="text-foreground font-bold text-lg text-center mb-1">
              Sin Garantías Registradas
            </Text>
            <Text className="text-muted-foreground text-xs text-center leading-relaxed mb-4">
              Aún no hay garantías asociadas a este cliente.
            </Text>
            <Button
              onPress={handleCreate}
              className="bg-secondary active:bg-secondary/90 h-10 px-4 rounded-xl flex-row items-center gap-1.5"
            >
              <Plus size={16} color="#ffffff" />
              <Text className="text-white text-xs font-bold">Agregar primera garantía</Text>
            </Button>
          </View>
        )}

        {/* Guarantees List */}
        {guaranteesList.map((item) => {
          const Icon = getGuaranteeIcon(item.type);
          const sc = getGuaranteeStatusConfig(item.status);
          const imageUrl = item.imageUrl;

          return (
            <View
              key={item.id}
              className="mx-4 mb-3 rounded-2xl bg-card border border-border p-4 shadow-sm"
            >
              <View className="flex-row items-start gap-3">
                {imageUrl ? (
                  <Pressable
                    onPress={() => setViewerImage({ url: imageUrl, description: item.description })}
                    className="active:opacity-80"
                  >
                    <Image
                      source={{ uri: imageUrl }}
                      className="w-14 h-14 rounded-xl bg-muted border border-border"
                      resizeMode="cover"
                    />
                  </Pressable>
                ) : (
                  <View className="bg-primary/15 p-3 rounded-xl">
                    <Icon size={22} color={palette.azul} />
                  </View>
                )}

                <View className="flex-1">
                  <View className="flex-row items-center justify-between mb-1">
                    <Text className="text-foreground font-bold text-base leading-snug flex-1 mr-2">
                      {item.description}
                    </Text>
                    <View className={`px-2.5 py-0.5 rounded-full ${sc.bg}`}>
                      <Text className={`text-xs font-bold ${sc.textColor}`}>
                        {sc.label}
                      </Text>
                    </View>
                  </View>

                  <Text className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-0.5">
                    VALOR ESTIMADO
                  </Text>
                  <Text className="text-secondary font-bold text-lg">
                    {item.estimatedValue !== null && item.estimatedValue !== undefined
                      ? `Bs.- ${Number(item.estimatedValue).toFixed(2)}`
                      : 'Sin estimación'}
                  </Text>
                </View>
              </View>

              {/* Action bar for item */}
              <View className="flex-row justify-end gap-2 pt-3 mt-3 border-t border-border/50">
                <Pressable
                  onPress={() => handleEdit(item)}
                  className="flex-row items-center gap-1 px-3 py-1.5 rounded-lg bg-muted active:bg-muted/80"
                >
                  <Pencil size={14} color={palette.azul} />
                  <Text className="text-xs font-bold text-secondary">Editar</Text>
                </Pressable>

                <Pressable
                  onPress={() => handleDelete(item)}
                  className="flex-row items-center gap-1 px-3 py-1.5 rounded-lg bg-destructive/10 active:bg-destructive/20"
                >
                  <Trash2 size={14} color="#ef4444" />
                  <Text className="text-xs font-bold text-destructive">Eliminar</Text>
                </Pressable>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Form Modal (Create / Edit) */}
      <GuaranteeFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        clientId={clientId}
        guaranteeToEdit={guaranteeToEdit}
      />

      {/* Delete Dialog */}
      <DeleteGuaranteeDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        clientId={clientId}
        guarantee={guaranteeToDelete}
      />

      {/* Fullscreen Photo Viewer */}
      <GuaranteeImageViewer
        isOpen={!!viewerImage}
        onClose={() => setViewerImage(null)}
        imageUrl={viewerImage?.url ?? null}
        description={viewerImage?.description}
      />
    </View>
  );
}
