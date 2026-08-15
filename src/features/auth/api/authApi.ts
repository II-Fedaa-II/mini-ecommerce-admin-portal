import { apiRequest } from '@/shared/api/httpClient';
import type { AuthUser, LoginResponse } from '../types';

export const authApi = {
  login: (email: string, password: string) =>
    apiRequest<LoginResponse>('/auth/login', { method: 'POST', body: { email, password } }),

  logout: () => apiRequest<{ success: true }>('/auth/logout', { method: 'POST' }),
};

export type { AuthUser };
