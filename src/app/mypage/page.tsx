'use client';

import { useState } from 'react';
import { useCurrentUser } from '@/lib/auth-context';
import {
  useMyReservations,
  useCancelReservation,
} from '@/hooks/useReservations';
import { useMyTicket, useChargeTicket } from '@/hooks/useTicket';
import { ApiError } from '@/lib/api';
import { formatDateTime } from '@/lib/date';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Skeleton } from '@/components/Skeleton';
import { CenteredMessage } from '@/components/CenteredMessage';
import {
  RESERVATION_STATUS_LABEL,
  RESERVATION_STATUS_COLOR,
} from '@/types/api';

export default function MyPage() {
  const { isLoggedIn, email, role, isInitialized } = useCurrentUser();
  const { data: reservations } = useMyReservations();
  const ticket = useMyTicket();
  const chargeTicket = useChargeTicket();
  const cancelReservation = useCancelReservation();

  const [chargeCount, setChargeCount] = useState('10');

  if (!isInitialized) {
    return <CenteredMessage message="불러오는 중..." />;
  }

  if (!isLoggedIn) {
    return <CenteredMessage message="로그인 후 이용할 수 있습니다." />;
  }

  const handleCharge = (e: React.FormEvent) => {
    e.preventDefault();
    const count = Number(chargeCount);
    if (count > 0) {
      chargeTicket.mutate(count);
    }
  };

  const isNoTicket =
    ticket.error instanceof ApiError && ticket.error.code === 'NO_TICKET';

  return (
    <main className="flex-1 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-semibold text-foreground">마이페이지</h1>
        <p className="mt-1 text-muted">
          {email} ({role === 'TRAINER' ? '트레이너' : '회원'})
        </p>

        {role === 'MEMBER' && (
          <section className="mt-8 rounded-2xl bg-surface p-6 shadow-md shadow-black/20">
            <h2 className="font-semibold text-foreground">세션권</h2>

            {ticket.isLoading ? (
              <Skeleton className="mt-2 h-8 w-1/3" />
            ) : isNoTicket ? (
              <p className="mt-2 text-muted">아직 충전한 세션권이 없어요.</p>
            ) : ticket.data ? (
              <p className="mt-2 text-3xl font-bold text-brand">
                {ticket.data.remainingCount}
                <span className="text-base font-normal text-muted">
                  {' '}
                  / {ticket.data.totalCount}회
                </span>
              </p>
            ) : null}

            <form onSubmit={handleCharge} className="mt-4 flex gap-2">
              <Input
                type="number"
                min={1}
                value={chargeCount}
                onChange={(e) => setChargeCount(e.target.value)}
                className="w-24"
              />
              <Button type="submit" disabled={chargeTicket.isPending}>
                {chargeTicket.isPending ? '충전 중...' : '충전하기'}
              </Button>
            </form>
          </section>
        )}

        <section className="mt-8">
          <h2 className="font-semibold text-foreground">내 예약 이력</h2>

          <div className="mt-4 flex flex-col gap-3">
            {reservations?.map((reservation) => (
              <div
                key={reservation.id}
                className="flex items-center justify-between rounded-2xl bg-surface p-4 shadow-sm shadow-black/10"
              >
                <div>
                  <p className="text-foreground">{reservation.classTitle}</p>
                  <p className="text-sm text-muted">
                    {formatDateTime(reservation.reservedAt)}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-sm font-medium ${RESERVATION_STATUS_COLOR[reservation.status]}`}
                  >
                    {RESERVATION_STATUS_LABEL[reservation.status]}
                  </span>

                  {(reservation.status === 'CONFIRMED' ||
                    reservation.status === 'WAITLISTED') && (
                    <Button
                      variant="secondary"
                      onClick={() => cancelReservation.mutate(reservation.id)}
                      disabled={cancelReservation.isPending}
                    >
                      취소
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {reservations?.length === 0 && (
              <p className="text-muted">예약 이력이 없습니다.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
