import { useMutation, useQueryClient } from '@tanstack/react-query';
import { clientService } from '@/services/clientService';
import { ClientCreateInput, Client } from '@/types/client';

export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation<{ data: Client }, Error, ClientCreateInput>({
    mutationFn: (data) => clientService.createClient(data),
    onSuccess: () => {
      // Invalidate the 'clients' query so the list refreshes automatically
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}
