import { useMutation } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { setToken } from '@/lib/auth';
import { LoginResponse, Role } from '@/types/api';
import { useCurrentUser } from '@/lib/auth-context';

interface SignupInput {
  email: string;
  password: string;
  name: string;
  role: Role;
}

interface LoginInput {
  email: string;
  password: string;
}

export function useSignup() {
  return useMutation({
    mutationFn: (input: SignupInput) =>
      apiFetch<void>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(input),
      }),
  });
}

export function useLogin() {
  const { login } = useCurrentUser();

  return useMutation({
    mutationFn: (input: LoginInput) =>
      apiFetch<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(input),
      }),
    onSuccess: (data) => {
      login(data.token);
    },
  });
}

export function useDeleteAccount() {
  const { logout } = useCurrentUser();

  return useMutation({
    mutationFn: () => apiFetch<void>('/members/me', { method: 'DELETE' }),
    onSuccess: () => {
      logout();
    },
  });
}
