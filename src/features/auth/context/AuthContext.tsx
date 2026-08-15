import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { refreshAccessToken } from '@/shared/api/httpClient';
import { tokenStore } from '@/shared/api/tokenStore';
import { authApi } from '../api/authApi';
import type { AuthUser, Permission } from '../types';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  /** UI-level convenience only — the API re-checks permissions on every request. */
  can: (permission: Permission) => boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

const USER_STORAGE_KEY = 'mini-ecommerce-admin.user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const refreshed = await refreshAccessToken();
      if (cancelled) return;

      if (refreshed) {
        const cached = localStorage.getItem(USER_STORAGE_KEY);
        if (cached) setUser(JSON.parse(cached) as AuthUser);
      } else {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
      setIsInitializing(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await authApi.login(email, password);
    tokenStore.set(response.accessToken);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user));
    setUser(response.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      tokenStore.set(null);
      localStorage.removeItem(USER_STORAGE_KEY);
      setUser(null);
      queryClient.clear();
    }
  }, [queryClient]);

  const can = useCallback(
    (permission: Permission) => user?.role?.permissions.includes(permission) ?? false,
    [user],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isInitializing,
      can,
      isAdmin: user?.role?.name === 'admin',
      login,
      logout,
    }),
    [user, isInitializing, can, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
