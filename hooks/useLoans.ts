import { useQuery } from '@tanstack/react-query';
import { loanService } from '@/services/loanService';
import type { GetLoansParams, LoanListItem } from '@/types/loan';

export const useLoans = (params?: GetLoansParams) => {
  const filter = params?.filter ?? 'active';
  const search = params?.search?.trim();

  return useQuery<LoanListItem[]>({
    queryKey: ['loans', { filter, search: search || undefined }],
    queryFn: () =>
      loanService.getLoans({
        filter,
        search: search || undefined,
      }),
    staleTime: 1000 * 60 * 2,
  });
};

