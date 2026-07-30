import { useQuery } from '@tanstack/react-query';
import { clientService } from '@/services/clientService';
import { Client } from '@/types/client';

export const useClients = () => {
  return useQuery<Client[]>({
    queryKey: ['clients'],
    queryFn: async () => {
      const response = await clientService.getClients();
      return response.data; // Retornamos directamente el arreglo de clientes
    },
    // Ajustar staleTime según convenga (e.g., 5 min)
    staleTime: 1000 * 60 * 5,
  });
};
