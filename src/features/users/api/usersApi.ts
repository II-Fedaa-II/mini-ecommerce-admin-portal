import { apiRequest } from '@/shared/api/httpClient';
import type { CreateUserInput, AdminUser, ListUsersQuery, PaginatedUsers } from '../types';

function toQueryString(query: ListUsersQuery): string {
  const params = new URLSearchParams();
  if (query.page) params.set('page', String(query.page));
  if (query.limit) params.set('limit', String(query.limit));
  if (query.search) params.set('search', query.search);
  if (query.roleId) params.set('roleId', query.roleId);

  const serialized = params.toString();
  return serialized ? `?${serialized}` : '';
}

export const usersApi = {
  list: (query: ListUsersQuery = {}) =>
    apiRequest<PaginatedUsers>(`/users${toQueryString(query)}`),
  create: (input: CreateUserInput) => apiRequest<AdminUser>('/users', { method: 'POST', body: input }),
  assignRole: (userId: string, roleId: string) =>
    apiRequest<AdminUser>(`/users/${userId}/role`, { method: 'PATCH', body: { roleId } }),
};
