'use client';

import { useCurrentUser } from '@/lib/auth-context';
import { useMyTicket, useChargeTicket } from '@/hooks/useTicket';
import { Button } from '@/components/Button';
import { CenteredMessage } from '@/components/CenteredMessage';
import { ApiError } from '@/lib/api';

const PACKAGES = [
  { count: 10, price: 100000 },
  { count: 20, price: 180000, discountLabel: '10% 할인' },
  { count: 30, price: 240000, discountLabel: '20% 할인' },
];

export default function ShopPage() {
  const { isLoggedIn, role, isInitialized } = useCurrentUser();
  const ticket = useMyTicket();
  const chargeTicket = useChargeTicket();

  if (!isInitialized) {
    return <CenteredMessage message="불러오는 중..." />;
  }

  if (!isLoggedIn || role !== 'MEMBER') {
    return <CenteredMessage message="회원 계정만 이용할 수 있습니다." />;
  }

  const isNoTicket =
    ticket.error instanceof ApiError && ticket.error.code === 'NO_TICKET';

  return (
    <main className="flex-1 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-semibold text-foreground">세션권 상점</h1>

        <p className="mt-2 text-muted">
          현재 보유{' '}
          <span className="font-semibold text-brand">
            {isNoTicket ? 0 : (ticket.data?.remainingCount ?? '-')}회
          </span>
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.count}
              className="flex flex-col rounded-2xl bg-surface p-6 text-center shadow-md shadow-black/20"
            >
              {pkg.discountLabel && (
                <span className="mx-auto mb-2 rounded-full bg-brand/10 px-2 py-0.5 text-xs font-medium text-brand">
                  {pkg.discountLabel}
                </span>
              )}
              <p className="text-3xl font-bold text-foreground">
                {pkg.count}회
              </p>
              <p className="mt-2 text-lg text-muted">
                {pkg.price.toLocaleString('ko-KR')}원
              </p>
              <Button
                onClick={() => chargeTicket.mutate(pkg.count)}
                disabled={chargeTicket.isPending}
                className="mt-6"
              >
                {chargeTicket.isPending ? '처리 중...' : '구매하기'}
              </Button>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          * 포트폴리오 데모용 페이지로, 실제 결제는 이루어지지 않습니다.
        </p>
      </div>
    </main>
  );
}
