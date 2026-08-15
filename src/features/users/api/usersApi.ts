import { apiRequest } from '@/shared/api/httpClient';
import type { AdminUser } from '../types';

export const usersApi = {
  list: () => apiRequest<AdminUser[]>('/users'),
  assignRole: (userId: string, roleId: string) =>
    apiRequest<AdminUser>(`/users/${userId}/role`, { method: 'PATCH', body: { roleId } }),
};
