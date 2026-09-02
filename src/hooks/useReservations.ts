import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { Reservation } from '@/types/api';
import { useCurrentUser } from '@/lib/auth-context';

export function useMyReservations() {
  const { isLoggedIn } = useCurrentUser();

  return useQuery({
    queryKey: ['myReservations'],
    queryFn: () => apiFetch<Reservation[]>('/members/me/reservations'),
    enabled: isLoggedIn,
  });
}

export function useReserve(classId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      apiFetch<Reservation>(`/classes/${classId}/reservations`, {
        method: 'POST',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      queryClient.invalidateQueries({ queryKey: ['myReservations'] });
    },
  });
}

export function useCancelReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reservationId: number) =>
      apiFetch<void>(`/reservations/${reservationId}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      queryClient.invalidateQueries({ queryKey: ['myReservations'] });
    },
  });
}
