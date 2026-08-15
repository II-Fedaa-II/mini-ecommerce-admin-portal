import { apiRequest } from '@/shared/api/httpClient';
import type { Role } from '../types';

export const rolesApi = {
  list: () => apiRequest<Role[]>('/roles'),
  listPermissions: () => apiRequest<{ permissions: string[] }>('/roles/permissions'),
  create: (name: string, permissions: string[]) =>
    apiRequest<Role>('/roles', { method: 'POST', body: { name, permissions } }),
  updatePermissions: (id: string, permissions: string[]) =>
    apiRequest<Role>(`/roles/${id}`, { method: 'PATCH', body: { permissions } }),
  remove: (id: string) => apiRequest<void>(`/roles/${id}`, { method: 'DELETE' }),
};
