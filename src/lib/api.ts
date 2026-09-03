import { getToken, clearToken } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ApiResponse<T> {
  success: boolean;
  code: string;
  message: string;
  data: T;
}

export class ApiError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  let body: ApiResponse<T> | null = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  // JSON 본문이 없는 401은 Spring Security 필터 단계에서 나온 것 (토큰 없음/만료/위조)
  // -> 로그인 페이지의 "비밀번호 불일치" 같은 401은 정상 JSON 본문이 오므로 여기 안 걸림
  if (!body || typeof body.success !== 'boolean') {
    if (response.status === 401 || response.status === 403) {
      clearToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    throw new ApiError('UNKNOWN_ERROR', '요청을 처리하지 못했습니다.');
  }

  if (!body.success) {
    throw new ApiError(body.code, body.message);
  }

  return body.data;
}

export function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback;
}
