import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ClassDetailView } from './ClassDetailView';
import { useClass } from '@/hooks/useClasses';
import {
  useMyReservations,
  useReserve,
  useCancelReservation,
} from '@/hooks/useReservations';
import { useCurrentUser } from '@/lib/auth-context';
import { useClassEvents } from '@/hooks/useClassEvents';

vi.mock('@/hooks/useClasses');
vi.mock('@/hooks/useReservations');
vi.mock('@/hooks/useClassEvents');
vi.mock('@/lib/auth-context');
vi.mock('@/components/AnimatedNumber', () => ({
  AnimatedNumber: ({ value }: { value: number }) => <span>{value}</span>,
}));

const mockClass = {
  id: 1,
  title: '어깨광배 되어보기',
  trainerName: '이수근',
  classDateTime: '2026-10-10T14:00:00',
  capacity: 6,
  currentCount: 1,
};

describe('ClassDetailView', () => {
  const reserveMutate = vi.fn();
  const cancelMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useClassEvents).mockReturnValue(undefined);
    vi.mocked(useClass).mockReturnValue({
      data: mockClass,
      isLoading: false,
      isError: false,
    } as any);
    vi.mocked(useCurrentUser).mockReturnValue({
      isLoggedIn: true,
      role: 'MEMBER',
      isInitialized: true,
      email: 'member@test.com',
      login: vi.fn(),
      logout: vi.fn(),
    });
    vi.mocked(useReserve).mockReturnValue({
      mutate: reserveMutate,
      isPending: false,
      error: null,
    } as any);
    vi.mocked(useCancelReservation).mockReturnValue({
      mutate: cancelMutate,
      isPending: false,
      error: null,
    } as any);
  });

  it('예약이 없으면 "예약하기" 버튼이 뜨고, 클릭하면 reserve가 호출된다', () => {
    vi.mocked(useMyReservations).mockReturnValue({ data: [] } as any);

    render(<ClassDetailView classId={1} />);

    fireEvent.click(screen.getByRole('button', { name: '예약하기' }));

    expect(reserveMutate).toHaveBeenCalled();
  });

  it('이미 예약(CONFIRMED)한 상태면 "예약 취소하기" 버튼이 뜨고, 클릭하면 cancel이 호출된다', () => {
    vi.mocked(useMyReservations).mockReturnValue({
      data: [
        {
          id: 100,
          classId: 1,
          classTitle: mockClass.title,
          status: 'CONFIRMED',
          reservedAt: '2026-09-01T10:00:00',
        },
      ],
    } as any);

    render(<ClassDetailView classId={1} />);

    fireEvent.click(screen.getByRole('button', { name: '예약 취소하기' }));

    expect(cancelMutate).toHaveBeenCalledWith(100);
  });

  it('정원이 가득 찬 클래스는 "대기 신청하기" 버튼이 뜬다', () => {
    vi.mocked(useMyReservations).mockReturnValue({ data: [] } as any);
    vi.mocked(useClass).mockReturnValue({
      data: { ...mockClass, currentCount: 6 },
      isLoading: false,
      isError: false,
    } as any);

    render(<ClassDetailView classId={1} />);

    expect(
      screen.getByRole('button', { name: '대기 신청하기' }),
    ).toBeInTheDocument();
  });
});
