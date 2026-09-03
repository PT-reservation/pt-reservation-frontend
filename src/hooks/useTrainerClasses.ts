import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { FitnessClass, ClassReservation } from '@/types/api';
import { useCurrentUser } from '@/lib/auth-context';

interface ClassInput {
  title: string;
  classDateTime: string;
  capacity: number;
  description: string;
  imageUrl: string;
}

export function useMyClasses() {
  const { isLoggedIn, role } = useCurrentUser();

  return useQuery({
    queryKey: ['trainerClasses'],
    queryFn: () => apiFetch<FitnessClass[]>('/trainers/me/classes'),
    enabled: isLoggedIn && role === 'TRAINER',
  });
}

export function useCreateClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ClassInput) =>
      apiFetch<FitnessClass>('/trainers/me/classes', {
        method: 'POST',
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainerClasses'] });
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
  });
}

export function useUpdateClass(classId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ClassInput) =>
      apiFetch<FitnessClass>(`/trainers/me/classes/${classId}`, {
        method: 'PUT',
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainerClasses'] });
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
  });
}

export function useDeleteClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (classId: number) =>
      apiFetch<void>(`/trainers/me/classes/${classId}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainerClasses'] });
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
  });
}

export function useClassReservations(classId: number | null) {
  const { isLoggedIn, role } = useCurrentUser();

  return useQuery({
    queryKey: ['classReservations', classId],
    queryFn: () =>
      apiFetch<ClassReservation[]>(
        `/trainers/me/classes/${classId}/reservations`,
      ),
    enabled: isLoggedIn && role === 'TRAINER' && classId !== null,
  });
}
