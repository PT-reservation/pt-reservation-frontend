import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useCurrentUser } from '@/lib/auth-context';
import { getToken } from '@/lib/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function useNotificationEvents() {
  const { isLoggedIn, role } = useCurrentUser();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn || role !== 'MEMBER') return;

    const token = getToken();
    if (!token) return;

    const eventSource = new EventSource(
      `${API_URL}/notifications/events?token=${token}`,
    );

    eventSource.addEventListener('reservationPromoted', () => {
      queryClient.invalidateQueries({ queryKey: ['myReservations'] });
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      setMessage('대기 중이던 예약이 확정되었어요!');
    });

    eventSource.addEventListener('promotionSkipped', () => {
      setMessage(
        '자리가 났지만 세션권이 부족해 자동 확정되지 않았어요. 충전 후 다시 시도해주세요.',
      );
    });

    return () => {
      eventSource.close();
    };
  }, [isLoggedIn, queryClient]);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 5000);
    return () => clearTimeout(timer);
  }, [message]);

  return message;
}
