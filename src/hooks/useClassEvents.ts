import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function useClassEvents(classId: number) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const eventSource = new EventSource(`${API_URL}/classes/${classId}/events`);

    eventSource.addEventListener('seatUpdated', () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    });

    return () => {
      eventSource.close();
    };
  }, [classId, queryClient]);
}
