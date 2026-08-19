import React, { useEffect } from 'react';
import { View, Pressable, ActivityIndicator } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Guarantee,
  GUARANTEE_TYPE_OPTIONS,
} from '@/types/guarantee';
import { useCreateGuarantee, useUpdateGuarantee } from '@/hooks/useGuarantees';

const guaranteeSchema = z.object({
  type: z.enum(['VEHICLE', 'REAL_ESTATE', 'FURNITURE', 'OTHER']),
  description: z.string().min(3, 'La descripción debe tener al menos 3 caracteres'),
  estimatedValue: z.string().optional(),
});

type GuaranteeFormData = z.infer<typeof guaranteeSchema>;

interface GuaranteeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  guaranteeToEdit?: Guarantee | null;
}

export function GuaranteeFormModal({
  isOpen,
  onClose,
  clientId,
  guaranteeToEdit,
}: GuaranteeFormModalProps) {
  const isEditing = !!guaranteeToEdit;

  const createMutation = useCreateGuarantee();
  const updateMutation = useUpdateGuarantee(clientId);

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GuaranteeFormData>({
    resolver: zodResolver(guaranteeSchema),
    defaultValues: {
      type: 'VEHICLE',
      description: '',
      estimatedValue: '',
    },
  });

  useEffect(() => {
    if (guaranteeToEdit) {
      reset({
        type: guaranteeToEdit.type,
        description: guaranteeToEdit.description,
        estimatedValue: guaranteeToEdit.estimatedValue ? String(guaranteeToEdit.estimatedValue) : '',
      });
    } else {
      reset({
        type: 'VEHICLE',
        description: '',
        estimatedValue: '',
      });
    }
  }, [guaranteeToEdit, isOpen, reset]);

  const onSubmit = (data: GuaranteeFormData) => {
    const numericValue = data.estimatedValue && data.estimatedValue.trim() !== ''
      ? parseFloat(data.estimatedValue)
      : null;

    if (isEditing && guaranteeToEdit) {
      updateMutation.mutate(
        {
          id: guaranteeToEdit.id,
          data: {
            type: data.type,
            description: data.description.trim(),
            estimatedValue: numericValue,
          },
        },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    } else {
      createMutation.mutate(
        {
          clientId,
          type: data.type,
          description: data.description.trim(),
          estimatedValue: numericValue,
        },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md w-full bg-card border border-border p-5 rounded-2xl">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-foreground font-bold text-xl">
            {isEditing ? 'Editar Garantía' : 'Nueva Garantía'}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs font-medium">
            {isEditing
              ? 'Modifica los datos de la garantía del cliente.'
              : 'Registra una nueva garantía vinculada al cliente.'}
          </DialogDescription>
        </DialogHeader>

        <View className="gap-4 py-2">
          {/* Tipo de Garantía */}
          <View>
            <Text className="text-foreground text-xs font-bold uppercase tracking-wider mb-2">
              Tipo de Garantía *
            </Text>
            <Controller
              control={control}
              name="type"
              render={({ field: { value, onChange } }) => (
                <View className="flex-row flex-wrap gap-2">
                  {GUARANTEE_TYPE_OPTIONS.map((opt) => {
                    const isSelected = value === opt.value;
                    return (
                      <Pressable
                        key={opt.value}
                        onPress={() => onChange(opt.value)}
                        className={`px-3 py-2 rounded-xl border ${
                          isSelected
                            ? 'bg-secondary border-secondary'
                            : 'bg-muted/50 border-border active:bg-muted'
                        }`}
                      >
                        <Text
                          className={`text-xs font-bold ${
                            isSelected ? 'text-white' : 'text-foreground'
                          }`}
                        >
                          {opt.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              )}
            />
            {errors.type && (
              <Text className="text-destructive text-xs font-semibold mt-1">
                {errors.type.message}
              </Text>
            )}
          </View>

          {/* Descripción */}
          <View>
            <Text className="text-foreground text-xs font-bold uppercase tracking-wider mb-1">
              Descripción *
            </Text>
            <Controller
              control={control}
              name="description"
              render={({ field: { value, onChange, onBlur } }) => (
                <Input
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Ej. Honda Wave 110cc Placa 4589-XYZ"
                  className="bg-background text-foreground text-sm h-11"
                />
              )}
            />
            {errors.description && (
              <Text className="text-destructive text-xs font-semibold mt-1">
                {errors.description.message}
              </Text>
            )}
          </View>

          {/* Valor Estimado */}
          <View>
            <Text className="text-foreground text-xs font-bold uppercase tracking-wider mb-1">
              Valor Estimado (Bs.-)
            </Text>
            <Controller
              control={control}
              name="estimatedValue"
              render={({ field: { value, onChange, onBlur } }) => (
                <Input
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="numeric"
                  placeholder="Ej. 1500 (Opcional)"
                  className="bg-background text-foreground text-sm h-11"
                />
              )}
            />
            {errors.estimatedValue && (
              <Text className="text-destructive text-xs font-semibold mt-1">
                {errors.estimatedValue.message}
              </Text>
            )}
          </View>
        </View>

        <DialogFooter className="mt-2 flex-row gap-3">
          <Button
            variant="outline"
            onPress={onClose}
            disabled={isSubmitting}
            className="flex-1 h-11 rounded-xl"
          >
            <Text className="font-bold text-foreground text-sm">Cancelar</Text>
          </Button>

          <Button
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="flex-1 h-11 rounded-xl bg-secondary active:bg-secondary/90 flex-row items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text className="font-bold text-white text-sm">
                {isEditing ? 'Guardar Cambios' : 'Crear Garantía'}
              </Text>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
