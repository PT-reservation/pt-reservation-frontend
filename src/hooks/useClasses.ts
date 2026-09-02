import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { FitnessClass } from '@/types/api';

export function useClasses() {
  return useQuery({
    queryKey: ['classes'],
    queryFn: () => apiFetch<FitnessClass[]>('/classes'),
  });
}

export function useClass(classId: number) {
  return useQuery({
    queryKey: ['classes', classId],
    queryFn: () => apiFetch<FitnessClass>(`/classes/${classId}`),
  });
}
