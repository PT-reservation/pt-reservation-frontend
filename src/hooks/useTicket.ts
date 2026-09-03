import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { SessionTicket } from '@/types/api';
import { useCurrentUser } from '@/lib/auth-context';

export function useMyTicket() {
  const { isLoggedIn, role } = useCurrentUser();

  return useQuery({
    queryKey: ['myTicket'],
    queryFn: () => apiFetch<SessionTicket>('/members/me/ticket'),
    enabled: isLoggedIn && role === 'MEMBER',
    retry: false,
  });
}

export function useChargeTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (count: number) =>
      apiFetch<SessionTicket>('/members/me/ticket/charge', {
        method: 'POST',
        body: JSON.stringify({ count }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myTicket'] });
    },
  });
}
