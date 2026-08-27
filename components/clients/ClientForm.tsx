import React, { useEffect } from 'react';
import { View, Alert, ActivityIndicator, Platform } from 'react-native';
import axios from 'axios';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { LocationPicker } from '@/components/ui/LocationPicker';
import { useCreateClient } from '@/hooks/useCreateClient';
import { useUpdateClient } from '@/hooks/useUpdateClient';
import { Client } from '@/types/client';

const clientSchema = z.object({
  fullName: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  phone: z.string().min(7, 'El teléfono debe tener al menos 7 dígitos'),
  idNumber: z.string().min(5, 'El CI debe tener al menos 5 caracteres'),
  phoneAlt: z.string().nullable(),
  address: z.string().nullable(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  notes: z.string().nullable(),
});

type ClientFormValues = z.infer<typeof clientSchema>;

interface ClientFormProps {
  /** Si se provee, el formulario opera en modo edición pre-relleno con los datos del cliente. */
  clientToEdit?: Client;
  onSuccess?: () => void;
}

export function ClientForm({ clientToEdit, onSuccess }: ClientFormProps) {
  const isEditMode = !!clientToEdit;

  const { mutateAsync: createClient, isPending: isCreating } = useCreateClient();
  const { mutateAsync: updateClient, isPending: isUpdating } = useUpdateClient();
  const isPending = isCreating || isUpdating;

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      idNumber: '',
      phoneAlt: '',
      address: '',
      latitude: null,
      longitude: null,
      notes: '',
    },
  });

  // Sincroniza los valores cuando el formulario se abre en modo edición
  useEffect(() => {
    if (clientToEdit) {
      reset({
        fullName: clientToEdit.fullName,
        phone: clientToEdit.phone,
        idNumber: clientToEdit.idNumber,
        phoneAlt: clientToEdit.phoneAlt ?? '',
        address: clientToEdit.address ?? '',
        latitude: clientToEdit.latitude ?? null,
        longitude: clientToEdit.longitude ?? null,
        notes: clientToEdit.notes ?? '',
      });
    } else {
      reset({
        fullName: '',
        phone: '',
        idNumber: '',
        phoneAlt: '',
        address: '',
        latitude: null,
        longitude: null,
        notes: '',
      });
    }
  }, [clientToEdit, reset]);

  const onSubmit = async (data: ClientFormValues) => {
    try {
      if (isEditMode && clientToEdit) {
        await updateClient({ id: clientToEdit.id, data });
        if (Platform.OS === 'web') {
          window.alert('Cliente actualizado correctamente.');
          onSuccess?.();
        } else {
          Alert.alert('Éxito', 'Cliente actualizado correctamente.', [
            { text: 'OK', onPress: onSuccess },
          ]);
        }
      } else {
        await createClient(data);
        if (Platform.OS === 'web') {
          window.alert('Cliente registrado correctamente.');
          onSuccess?.();
        } else {
          Alert.alert('Éxito', 'Cliente registrado correctamente.', [
            { text: 'OK', onPress: onSuccess },
          ]);
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        const message = isEditMode
          ? 'Ya existe otro cliente con ese CI o teléfono.'
          : 'Ya existe un cliente con ese CI o teléfono.';
        if (Platform.OS === 'web') {
          window.alert(message);
        } else {
          Alert.alert('Error', message);
        }
      } else {
        const action = isEditMode ? 'actualizar' : 'registrar';
        if (Platform.OS === 'web') {
          window.alert(`Hubo un problema al ${action} al cliente. Inténtalo de nuevo.`);
        } else {
          Alert.alert('Error', `Hubo un problema al ${action} al cliente. Inténtalo de nuevo.`);
        }
      }
    }
  };

  const latitude = watch('latitude');
  const longitude = watch('longitude');

  return (
    <View className="gap-4">
      <View>
        <Label nativeID="fullName" className="mb-2">Nombre Completo *</Label>
        <Controller
          control={control}
          name="fullName"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              id="fullName"
              placeholder="Ej. María Quispe Mamani"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              className={errors.fullName ? 'border-destructive' : ''}
            />
          )}
        />
        {errors.fullName && <Text className="text-destructive text-sm mt-1">{errors.fullName.message}</Text>}
      </View>

      <View>
        <Label nativeID="idNumber" className="mb-2">Carnet de Identidad (CI) *</Label>
        <Controller
          control={control}
          name="idNumber"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              id="idNumber"
              placeholder="Ej. 12345622 LP"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              className={errors.idNumber ? 'border-destructive' : ''}
            />
          )}
        />
        {errors.idNumber && <Text className="text-destructive text-sm mt-1">{errors.idNumber.message}</Text>}
      </View>

      <View className="flex-row gap-4">
        <View className="flex-1">
          <Label nativeID="phone" className="mb-2">Teléfono *</Label>
          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                id="phone"
                placeholder="Ej. 71234567"
                keyboardType="phone-pad"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                className={errors.phone ? 'border-destructive' : ''}
              />
            )}
          />
          {errors.phone && <Text className="text-destructive text-sm mt-1">{errors.phone.message}</Text>}
        </View>

        <View className="flex-1">
          <Label nativeID="phoneAlt" className="mb-2">Teléfono Alternativo</Label>
          <Controller
            control={control}
            name="phoneAlt"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                id="phoneAlt"
                placeholder="Opcional"
                keyboardType="phone-pad"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value ?? ''}
              />
            )}
          />
        </View>
      </View>

      <View>
        <Label nativeID="address" className="mb-2">Dirección de Cobro</Label>
        <Controller
          control={control}
          name="address"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              id="address"
              placeholder="Ej. Av. Arce 123, La Paz"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value ?? ''}
            />
          )}
        />
      </View>

      <LocationPicker
        latitude={latitude}
        longitude={longitude}
        onLocationSelect={(lat, lng) => {
          setValue('latitude', lat, { shouldValidate: true });
          setValue('longitude', lng, { shouldValidate: true });
        }}
        onAddressFound={(address) => {
          setValue('address', address, { shouldValidate: true });
        }}
        error={errors.latitude?.message || errors.longitude?.message}
      />

      <View>
        <Label nativeID="notes" className="mb-2">Notas Adicionales</Label>
        <Controller
          control={control}
          name="notes"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              id="notes"
              placeholder="Ej. Prefiere cobro por las mañanas."
              multiline
              numberOfLines={3}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value ?? ''}
              className="h-24 py-3"
              textAlignVertical="top"
            />
          )}
        />
      </View>

      <Button
        onPress={handleSubmit(onSubmit)}
        disabled={isPending}
        className="mt-4 h-14"
      >
        {isPending ? (
          <ActivityIndicator color="#ffffff" className="mr-2" />
        ) : null}
        <Text className="text-primary-foreground font-bold text-lg">
          {isPending
            ? isEditMode ? 'Guardando...' : 'Guardando...'
            : isEditMode ? 'Guardar Cambios' : 'Guardar Cliente'}
        </Text>
      </Button>
    </View>
  );
}
