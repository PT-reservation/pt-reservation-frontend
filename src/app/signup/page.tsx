'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSignup } from '@/hooks/useAuth';
import { getErrorMessage } from '@/lib/api';
import { Role } from '@/types/api';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';

export default function SignupPage() {
  const router = useRouter();
  const signup = useSignup();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>('MEMBER');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signup.mutate(
      { email, password, name, role },
      { onSuccess: () => router.push('/login') },
    );
  };

  return (
    <main className="flex flex-1 items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="flex items-center justify-between rounded-2xl bg-surface p-4 shadow-sm shadow-black/10"
      >
        <h1 className="text-xl font-semibold text-foreground">회원가입</h1>

        <div className="mt-6 flex flex-col gap-4">
          <Input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="비밀번호 (8자 이상)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setRole('MEMBER')}
              className={`flex-1 rounded-md border px-3 py-2 ${role === 'MEMBER' ? 'border-brand bg-brand/10 text-brand' : 'border-border text-muted'}`}
            >
              회원
            </button>
            <button
              type="button"
              onClick={() => setRole('TRAINER')}
              className={`flex-1 rounded-md border px-3 py-2 ${role === 'TRAINER' ? 'border-brand bg-brand/10 text-brand' : 'border-border text-muted'}`}
            >
              트레이너
            </button>
          </div>
        </div>

        {signup.isError && (
          <p className="mt-4 text-sm text-red-400">
            {getErrorMessage(signup.error, '회원가입에 실패했습니다.')}
          </p>
        )}

        <Button
          type="submit"
          disabled={signup.isPending}
          className="mt-6 w-full"
        >
          {signup.isPending ? '가입 중...' : '가입하기'}
        </Button>
      </form>
    </main>
  );
}
