'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import {
  getToken,
  setToken as saveToken,
  clearToken,
  decodeToken,
} from '@/lib/auth';
import { Role } from '@/types/api';

interface AuthState {
  email: string | null;
  role: Role | null;
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<Role | null>(null);

  useEffect(() => {
    const token = getToken();
    if (token) {
      const payload = decodeToken(token);
      if (payload) {
        setEmail(payload.sub);
        setRole(payload.role);
      }
    }
  }, []);

  const login = (token: string) => {
    saveToken(token);
    const payload = decodeToken(token);
    if (payload) {
      setEmail(payload.sub);
      setRole(payload.role);
    }
  };

  const logout = () => {
    clearToken();
    setEmail(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{ email, role, isLoggedIn: !!email, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useCurrentUser() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useCurrentUser must be used within AuthProvider');
  }
  return context;
}
