import { http, HttpResponse } from 'msw';
import { mockRoles } from '@/features/roles/api/rolesApi.mocks';
import { API_URL } from '@/shared/api/httpClient';
import type { AdminUser } from '../types';

export const mockUsers: AdminUser[] = [
  {
    id: 'user-admin',
    email: 'admin@mini-ecommerce.test',
    name: 'Demo Admin',
    role: mockRoles[0],
  },
  {
    id: 'user-customer',
    email: 'demo@mini-ecommerce.test',
    name: 'Demo Customer',
    role: mockRoles[1],
  },
];

export const userHandlers = [
  http.get(`${API_URL}/users`, () => HttpResponse.json(mockUsers)),
  http.patch(`${API_URL}/users/:id/role`, async ({ request, params }) => {
    const body = (await request.json()) as { roleId: string };
    const role = mockRoles.find((entry) => entry.id === body.roleId) ?? null;
    const user = mockUsers.find((entry) => entry.id === params.id) ?? mockUsers[1];
    return HttpResponse.json({ ...user, role });
  }),
];
