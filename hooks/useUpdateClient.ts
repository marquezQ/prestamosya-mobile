import { useMutation, useQueryClient } from '@tanstack/react-query';
import { clientService } from '@/services/clientService';
import { ClientUpdateInput, Client } from '@/types/client';

interface UpdateClientVariables {
  id: string;
  data: ClientUpdateInput;
}

export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation<{ data: Client }, Error, UpdateClientVariables>({
    mutationFn: ({ id, data }) => clientService.updateClient(id, data),
    onSuccess: (_result, variables) => {
      // Refresca tanto la lista de clientes como el detalle del cliente editado
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['clients', variables.id] });
    },
  });
}
