'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLogin } from '@/hooks/useAuth';
import { getErrorMessage } from '@/lib/api';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';

export default function LoginPage() {
  const router = useRouter();
  const login = useLogin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate({ email, password }, { onSuccess: () => router.push('/') });
  };

  return (
    <main className="flex flex-1 items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl bg-surface p-8 shadow-lg shadow-black/20"
      >
        <h1 className="text-xl font-semibold text-foreground">로그인</h1>

        <div className="mt-6 flex flex-col gap-4">
          <Input
            type="email"
            placeholder="이메일"
            aria-label="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="비밀번호"
            aria-label="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {login.isError && (
          <p className="mt-4 text-sm text-red-400">
            {getErrorMessage(login.error, '로그인에 실패했습니다.')}
          </p>
        )}

        <Button
          type="submit"
          disabled={login.isPending}
          className="mt-6 w-full"
        >
          {login.isPending ? '로그인 중...' : '로그인'}
        </Button>
      </form>
    </main>
  );
}
