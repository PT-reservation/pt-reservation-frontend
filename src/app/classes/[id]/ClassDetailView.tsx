'use client';

import { useClass } from '@/hooks/useClasses';
import { useClassEvents } from '@/hooks/useClassEvents';
import {
  useMyReservations,
  useReserve,
  useCancelReservation,
} from '@/hooks/useReservations';
import { useCurrentUser } from '@/lib/auth-context';
import { getErrorMessage } from '@/lib/api';
import { formatDateTime } from '@/lib/date';
import { Button } from '@/components/Button';
import { Skeleton } from '@/components/Skeleton';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { CenteredMessage } from '@/components/CenteredMessage';
import { ClassImage } from '@/components/ClassImage';
import {
  RESERVATION_STATUS_LABEL,
  RESERVATION_STATUS_COLOR,
} from '@/types/api';

export function ClassDetailView({ classId }: { classId: number }) {
  const { isLoggedIn, role, isInitialized } = useCurrentUser();
  const { data: fitnessClass, isLoading, isError } = useClass(classId);
  const { data: myReservations } = useMyReservations();

  const reserve = useReserve(classId);
  const cancelReservation = useCancelReservation();

  useClassEvents(classId);

  if (isLoading) {
    return (
      <main className="flex flex-1 justify-center px-4 py-10">
        <div className="w-full max-w-lg rounded-2xl bg-surface p-8 shadow-lg shadow-black/20">
          <Skeleton className="h-7 w-2/3" />
          <Skeleton className="mt-3 h-4 w-1/3" />
          <Skeleton className="mt-1 h-4 w-1/2" />
          <Skeleton className="mt-6 h-9 w-1/3" />
          <Skeleton className="mt-6 h-11 w-full rounded-full" />
        </div>
      </main>
    );
  }

  if (isError || !fitnessClass) {
    return (
      <CenteredMessage message="클래스를 찾을 수 없습니다." variant="error" />
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
      <div className="w-full max-w-lg rounded-2xl bg-surface p-8 shadow-lg shadow-black/20">
        <ClassImage
          src={fitnessClass.imageUrl}
          alt={fitnessClass.title}
          className="mb-4 h-56"
        />
        <h1 className="text-2xl font-semibold text-foreground">
          {fitnessClass.title}
        </h1>
        <p className="mt-2 text-muted">트레이너 {fitnessClass.trainerName}</p>
        <p className="mt-1 text-muted">
          {formatDateTime(fitnessClass.classDateTime)}
        </p>

        {fitnessClass.description && (
          <p className="mt-4 whitespace-pre-wrap text-sm text-muted">
            {fitnessClass.description}
          </p>
        )}

        <p className="mt-6 text-3xl font-bold text-brand">
          <AnimatedNumber value={fitnessClass.currentCount} />
          <span className="text-base font-normal text-muted">
            /{fitnessClass.capacity}명
          </span>
          {isFull && (
            <span className="ml-2 align-middle text-sm font-normal text-brand/70">
              (마감)
            </span>
          )}
        </p>

        {myReservation && (
          <p className="mt-2 text-sm">
            내 예약 상태:{' '}
            <span className={RESERVATION_STATUS_COLOR[myReservation.status]}>
              {RESERVATION_STATUS_LABEL[myReservation.status]}
            </span>
          </p>
        )}

        {mutationError && (
          <p className="mt-4 text-sm text-red-400">
            {getErrorMessage(mutationError, '요청에 실패했습니다.')}
          </p>
        )}

        {!isInitialized ? null : !isLoggedIn ? (
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
