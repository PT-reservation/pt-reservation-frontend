'use client';

import Link from 'next/link';
import { useClasses } from '@/hooks/useClasses';
import { CenteredMessage } from '@/components/CenteredMessage';
import { Skeleton } from '@/components/Skeleton';
import { formatDateTime } from '@/lib/date';

export default function Home() {
  const { data: classes, isLoading, isError } = useClasses();

  if (isLoading) {
    return (
      <main className="flex-1 px-4 py-10">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-2xl font-semibold text-foreground">
            클래스 목록
          </h1>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-surface p-5 shadow-md shadow-black/20"
              >
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="mt-2 h-4 w-1/3" />
                <Skeleton className="mt-2 h-4 w-1/2" />
                <Skeleton className="mt-3 h-8 w-1/4" />
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <CenteredMessage
        message="클래스 목록을 불러오지 못했습니다."
        variant="error"
      />
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
              className="rounded-2xl bg-surface p-5 shadow-md shadow-black/20 transition-transform hover:-translate-y-0.5 hover:shadow-lg"
            >
              <h2 className="font-semibold text-foreground">
                {fitnessClass.title}
              </h2>
              <p className="mt-1 text-sm text-muted">
                {fitnessClass.trainerName}
              </p>
              <p className="mt-1 text-sm text-muted">
                {formatDateTime(fitnessClass.classDateTime)}
              </p>
              <p className="mt-3 text-2xl font-bold text-brand">
                {fitnessClass.currentCount}
                <span className="text-base font-normal text-muted">
                  /{fitnessClass.capacity}명
                </span>
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
