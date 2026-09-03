'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/lib/auth-context';

export function Header() {
  const router = useRouter();
  const { isLoggedIn, role, isInitialized, logout } = useCurrentUser();

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
