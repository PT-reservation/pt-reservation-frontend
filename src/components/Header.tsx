'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/lib/auth-context';
import { useMyTicket } from '@/hooks/useTicket';

function TicketIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="h-4 w-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v1.5a1.5 1.5 0 0 0 0 3V14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1.5a1.5 1.5 0 0 0 0-3V8Z"
      />
      <path strokeLinecap="round" strokeDasharray="2 2" d="M14 6v12" />
    </svg>
  );
}

export function Header() {
  const router = useRouter();
  const { isLoggedIn, role, isInitialized, logout } = useCurrentUser();
  const ticket = useMyTicket();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="border-b border-border bg-surface px-4 py-3">
      <div className="mx-auto flex max-w-3xl items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-foreground"
        >
          <img src="/logo.png" alt="PT팟 로고" className="h-7 w-7" />
          PT팟
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <Link href="/" className="text-muted hover:text-foreground">
            클래스 목록
          </Link>

          {!isInitialized ? null : isLoggedIn ? (
            <>
              {role === 'MEMBER' && ticket.data && (
                <Link
                  href="/mypage"
                  className="flex items-center gap-1 text-brand"
                >
                  <TicketIcon />
                  {ticket.data.remainingCount}회
                </Link>
              )}
              <Link href="/mypage" className="text-muted hover:text-foreground">
                마이페이지
              </Link>
              {role === 'TRAINER' && (
                <Link
                  href="/trainer/classes"
                  className="text-muted hover:text-foreground"
                >
                  내 클래스 관리
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-muted hover:text-foreground"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-muted hover:text-foreground">
                로그인
              </Link>
              <Link href="/signup" className="text-muted hover:text-foreground">
                회원가입
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
