'use client';

import { useState } from 'react';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { FitnessClass } from '@/types/api';

interface ClassFormValues {
  title: string;
  classDateTime: string;
  capacity: number;
}

interface ClassFormProps {
  initial?: FitnessClass;
  onSubmit: (values: ClassFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function ClassForm({
  initial,
  onSubmit,
  onCancel,
  isSubmitting,
}: ClassFormProps) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [classDateTime, setClassDateTime] = useState(
    initial?.classDateTime.slice(0, 16) ?? '',
  );
  const [capacity, setCapacity] = useState(String(initial?.capacity ?? 6));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      classDateTime: `${classDateTime}:00`,
      capacity: Number(capacity),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 flex flex-col gap-3 rounded-2xl bg-surface p-4 shadow-md shadow-black/20"
    >
      <Input
        type="text"
        placeholder="클래스 제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <Input
        type="datetime-local"
        value={classDateTime}
        onChange={(e) => setClassDateTime(e.target.value)}
        required
      />
      <Input
        type="number"
        min={1}
        placeholder="정원"
        value={capacity}
        onChange={(e) => setCapacity(e.target.value)}
        required
      />

      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? '저장 중...' : '저장'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          취소
        </Button>
      </div>
    </form>
  );
}
