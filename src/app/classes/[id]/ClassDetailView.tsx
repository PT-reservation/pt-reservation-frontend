'use client';

import { useClass } from '@/hooks/useClasses';

export function ClassDetailView({ classId }: { classId: number }) {
  const { data: fitnessClass, isLoading, isError } = useClass(classId);

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

  const isFull = fitnessClass.currentCount >= fitnessClass.capacity;

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

        <button
          disabled
          className="mt-6 w-full rounded-md bg-brand px-4 py-2 font-medium text-white opacity-50"
        >
          예약하기 (다음 단계에서 연결)
        </button>
      </div>
    </main>
  );
}
