import { useQuery } from '@tanstack/react-query';
import { clientService } from '@/services/clientService';
import { ClientDetailResponse } from '@/types/client';

export const useClientById = (id: string) => {
  return useQuery<ClientDetailResponse['data']>({
    queryKey: ['clients', id],
    queryFn: async () => {
      const response = await clientService.getClientById(id);
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 min
    enabled: !!id,
  });
};
