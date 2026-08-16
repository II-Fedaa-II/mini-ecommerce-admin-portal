import { apiRequest } from '@/shared/api/httpClient';
import type { AdminUser, CreateUserInput } from '../types';

export const usersApi = {
  list: () => apiRequest<AdminUser[]>('/users'),
  create: (input: CreateUserInput) => apiRequest<AdminUser>('/users', { method: 'POST', body: input }),
  assignRole: (userId: string, roleId: string) =>
    apiRequest<AdminUser>(`/users/${userId}/role`, { method: 'PATCH', body: { roleId } }),
};
