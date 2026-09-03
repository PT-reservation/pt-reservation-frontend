import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
  }

  const authCheck = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/trainers/me/classes`,
    { headers: { authorization: authHeader } },
  );
  if (!authCheck.ok) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: '파일이 없습니다.' }, { status: 400 });
  }

  if (!file.type.startsWith('image/')) {
    return NextResponse.json(
      { error: '이미지 파일만 업로드할 수 있습니다.' },
      { status: 400 },
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: '파일 크기는 5MB를 초과할 수 없습니다.' },
      { status: 400 },
    );
  }

  const blob = await put(`classes/${Date.now()}-${file.name}`, file, {
    access: 'public',
  });

  return NextResponse.json({ url: blob.url });
}
