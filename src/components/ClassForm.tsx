'use client';

import { useState } from 'react';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { FitnessClass } from '@/types/api';
import { uploadImage } from '@/lib/image';

interface ClassFormValues {
  title: string;
  classDateTime: string;
  capacity: number;
  description: string;
  imageUrl: string;
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
  const [description, setDescription] = useState(initial?.description ?? '');
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? '');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError('');
    try {
      const url = await uploadImage(file);
      setImageUrl(url);
    } catch {
      setUploadError('이미지 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      classDateTime: `${classDateTime}:00`,
      capacity: Number(capacity),
      description,
      imageUrl,
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
      <textarea
        placeholder="클래스 설명"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
        required
        className="rounded-xl border border-transparent bg-black/30 px-4 py-3 text-foreground outline-none transition-colors focus:border-brand"
      />

      <div>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          disabled={isUploading}
          className="text-sm text-muted"
        />
        {isUploading && <p className="mt-1 text-sm text-muted">업로드 중...</p>}
        {uploadError && (
          <p className="mt-1 text-sm text-red-400">{uploadError}</p>
        )}
        {imageUrl && !isUploading && (
          <img
            src={imageUrl}
            alt="클래스 이미지 미리보기"
            className="mt-2 h-32 w-full rounded-xl object-cover"
          />
        )}
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting || isUploading}>
          {isSubmitting ? '저장 중...' : '저장'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          취소
        </Button>
      </div>
    </form>
  );
}
