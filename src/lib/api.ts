import { getToken } from './auth';

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

  const body: ApiResponse<T> = await response.json();

  if (!body.success) {
    throw new ApiError(body.code, body.message);
  }

  return body.data;
}
