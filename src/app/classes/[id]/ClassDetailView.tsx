'use client';

import { useClass } from '@/hooks/useClasses';
import {
  useMyReservations,
  useReserve,
  useCancelReservation,
} from '@/hooks/useReservations';
import { useCurrentUser } from '@/lib/auth-context';
import { ApiError } from '@/lib/api';
import { Button } from '@/components/Button';

export function ClassDetailView({ classId }: { classId: number }) {
  const { isLoggedIn, role } = useCurrentUser();
  const { data: fitnessClass, isLoading, isError } = useClass(classId);
  const { data: myReservations } = useMyReservations();

  const reserve = useReserve(classId);
  const cancelReservation = useCancelReservation();

  if (isLoading) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <p className="text-muted">불러오는 중...</p>
      </main>
    );
  }

  if (isError || !fitnessClass) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <p className="text-red-400">클래스를 찾을 수 없습니다.</p>
      </main>
    );
  }

  const myReservation = myReservations?.find(
    (r) =>
      r.classId === classId &&
      (r.status === 'CONFIRMED' || r.status === 'WAITLISTED'),
  );

  const isFull = fitnessClass.currentCount >= fitnessClass.capacity;
  const mutationError = reserve.error || cancelReservation.error;

  return (
    <main className="flex flex-1 justify-center px-4 py-10">
      <div className="w-full max-w-lg rounded-lg border border-border bg-surface p-8">
        <h1 className="text-2xl font-semibold text-foreground">
          {fitnessClass.title}
        </h1>
        <p className="mt-2 text-muted">트레이너 {fitnessClass.trainerName}</p>
        <p className="mt-1 text-muted">
          {new Date(fitnessClass.classDateTime).toLocaleString('ko-KR')}
        </p>

        <p className="mt-6 text-lg font-medium text-brand">
          {fitnessClass.currentCount}/{fitnessClass.capacity}명
          {isFull && (
            <span className="ml-2 text-sm text-amber-400">(마감)</span>
          )}
        </p>

        {myReservation && (
          <p className="mt-2 text-sm">
            내 예약 상태:{' '}
            <span
              className={
                myReservation.status === 'CONFIRMED'
                  ? 'text-brand'
                  : 'text-amber-400'
              }
            >
              {myReservation.status === 'CONFIRMED' ? '확정' : '대기중'}
            </span>
          </p>
        )}

        {mutationError && (
          <p className="mt-4 text-sm text-red-400">
            {mutationError instanceof ApiError
              ? mutationError.message
              : '요청에 실패했습니다.'}
          </p>
        )}

        {!isLoggedIn ? (
          <p className="mt-6 text-sm text-muted">예약하려면 로그인해주세요.</p>
        ) : role !== 'MEMBER' ? (
          <p className="mt-6 text-sm text-muted">
            회원 계정만 예약할 수 있습니다.
          </p>
        ) : myReservation ? (
          <Button
            variant="secondary"
            onClick={() => cancelReservation.mutate(myReservation.id)}
            disabled={cancelReservation.isPending}
            className="mt-6 w-full"
          >
            {cancelReservation.isPending ? '취소 중...' : '예약 취소하기'}
          </Button>
        ) : (
          <Button
            onClick={() => reserve.mutate()}
            disabled={reserve.isPending}
            className="mt-6 w-full"
          >
            {reserve.isPending
              ? '예약 중...'
              : isFull
                ? '대기 신청하기'
                : '예약하기'}
          </Button>
        )}
      </div>
    </main>
  );
}
