import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { guaranteeService } from '@/services/guaranteeService';
import type {
  Guarantee,
  CreateGuaranteeInput,
  UpdateGuaranteeInput,
} from '@/types/guarantee';

export const useGuaranteesByClientId = (clientId: string) => {
  return useQuery<Guarantee[]>({
    queryKey: ['guarantees', clientId],
    queryFn: async () => {
      const response = await guaranteeService.getGuaranteesByClientId(clientId);
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 min
    enabled: !!clientId,
  });
};

export const useCreateGuarantee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGuaranteeInput) => guaranteeService.createGuarantee(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['guarantees', variables.clientId] });
      queryClient.invalidateQueries({ queryKey: ['clients', variables.clientId] });
    },
  });
};

export const useUpdateGuarantee = (clientId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGuaranteeInput }) =>
      guaranteeService.updateGuarantee(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guarantees', clientId] });
      queryClient.invalidateQueries({ queryKey: ['clients', clientId] });
    },
  });
};

export const useDeleteGuarantee = (clientId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => guaranteeService.deleteGuarantee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guarantees', clientId] });
      queryClient.invalidateQueries({ queryKey: ['clients', clientId] });
    },
  });
};
