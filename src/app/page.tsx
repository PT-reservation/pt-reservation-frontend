import Image from 'next/image';

export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center">
      <div className="rounded-lg border border-border bg-surface p-8 text-center">
        <h1 className="text-2xl font-semibold text-foreground">
          PT Reservation
        </h1>
        <p className="mt-2 text-muted">다크 테마 + 포인트 컬러 확인용</p>
        <button className="mt-6 rounded-md bg-brand px-4 py-2 font-medium text-white hover:bg-brand-hover">
          버튼 확인
        </button>
      </div>
    </main>
  );
}
