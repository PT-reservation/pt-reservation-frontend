'use client';

import Link from 'next/link';
import { useClasses } from '@/hooks/useClasses';

export default function Home() {
  const { data: classes, isLoading, isError } = useClasses();

  if (isLoading) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <p className="text-muted">불러오는 중...</p>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <p className="text-red-400">클래스 목록을 불러오지 못했습니다.</p>
      </main>
    );
  }

  return (
    <main className="flex-1 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-semibold text-foreground">클래스 목록</h1>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {classes?.map((fitnessClass) => (
            <Link
              key={fitnessClass.id}
              href={`/classes/${fitnessClass.id}`}
              className="rounded-lg border border-border bg-surface p-5 hover:border-brand"
            >
              <h2 className="font-semibold text-foreground">
                {fitnessClass.title}
              </h2>
              <p className="mt-1 text-sm text-muted">
                {fitnessClass.trainerName}
              </p>
              <p className="mt-1 text-sm text-muted">
                {new Date(fitnessClass.classDateTime).toLocaleString('ko-KR')}
              </p>
              <p className="mt-3 text-sm font-medium text-brand">
                {fitnessClass.currentCount}/{fitnessClass.capacity}명
              </p>
            </Link>
          ))}
        </div>

        {classes?.length === 0 && (
          <p className="mt-10 text-center text-muted">
            등록된 클래스가 없습니다.
          </p>
        )}
      </div>
    </main>
  );
}
