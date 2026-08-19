import { useQuery } from '@tanstack/react-query';
import { loanService } from '@/services/loanService';
import { LoanDetailData } from '@/types/loan';

export const useLoanById = (id: string, enabled: boolean = false) => {
  return useQuery<LoanDetailData>({
    queryKey: ['loans', id],
    queryFn: async () => {
      const response = await loanService.getLoanById(id);
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 min
    enabled: enabled && !!id,
  });
};
