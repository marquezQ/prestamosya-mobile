import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Guarantee } from '@/types/guarantee';
import { useDeleteGuarantee } from '@/hooks/useGuarantees';
import { AlertCircle } from 'lucide-react-native';

interface DeleteGuaranteeDialogProps {
  guarantee: Guarantee | null;
  clientId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteGuaranteeDialog({
  guarantee,
  clientId,
  isOpen,
  onClose,
}: DeleteGuaranteeDialogProps) {
  const deleteMutation = useDeleteGuarantee(clientId);

  if (!guarantee) return null;

  const isInUse = guarantee.status === 'IN_USE';

  const handleDelete = () => {
    deleteMutation.mutate(guarantee.id, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md w-full bg-card border border-border p-5 rounded-2xl">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-foreground font-bold text-xl">
            Eliminar Garantía
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs font-medium">
            ¿Estás seguro de que deseas eliminar esta garantía?
          </DialogDescription>
        </DialogHeader>

        <View className="py-3">
          <Text className="text-foreground font-bold text-base mb-1">
            {guarantee.description}
          </Text>
          {guarantee.estimatedValue !== null && (
            <Text className="text-muted-foreground text-xs font-medium">
              Valor estimado: Bs.- {guarantee.estimatedValue.toFixed(2)}
            </Text>
          )}

          {/* Advertencia si está en uso */}
          {isInUse && (
            <View className="mt-3 flex-row items-center gap-2 bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
              <AlertCircle size={18} color="#ef4444" />
              <Text className="text-xs font-bold text-red-600 dark:text-red-400 flex-1">
                No se puede eliminar una garantía vinculada a un préstamo activo (En uso).
              </Text>
            </View>
          )}
        </View>

        <DialogFooter className="mt-2 flex-row gap-3">
          <Button
            variant="outline"
            onPress={onClose}
            disabled={deleteMutation.isPending}
            className="flex-1 h-11 rounded-xl"
          >
            <Text className="font-bold text-foreground text-sm">Cancelar</Text>
          </Button>

          <Button
            onPress={handleDelete}
            disabled={isInUse || deleteMutation.isPending}
            className="flex-1 h-11 rounded-xl bg-destructive active:bg-destructive/90 flex-row items-center justify-center gap-2"
          >
            {deleteMutation.isPending ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text className="font-bold text-white text-sm">Eliminar</Text>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
