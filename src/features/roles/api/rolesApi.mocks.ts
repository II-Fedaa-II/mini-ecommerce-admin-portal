import { http, HttpResponse } from 'msw';
import { PERMISSIONS } from '@/features/auth/types';
import { API_URL } from '@/shared/api/httpClient';
import type { Role } from '../types';

export const mockRoles: Role[] = [
  { id: 'role-admin', name: 'admin', permissions: Object.values(PERMISSIONS), isSystem: true },
  { id: 'role-customer', name: 'customer', permissions: [PERMISSIONS.PRODUCTS_READ], isSystem: true },
  {
    id: 'role-editor',
    name: 'catalogue-editor',
    permissions: [PERMISSIONS.PRODUCTS_READ, PERMISSIONS.PRODUCTS_WRITE],
    isSystem: false,
  },
];

export const roleHandlers = [
  http.get(`${API_URL}/roles/permissions`, () => HttpResponse.json({ permissions: Object.values(PERMISSIONS) })),
  http.get(`${API_URL}/roles`, () => HttpResponse.json(mockRoles)),
  http.post(`${API_URL}/roles`, async ({ request }) => {
    const body = (await request.json()) as { name: string; permissions: string[] };
    return HttpResponse.json({ id: 'role-new', isSystem: false, ...body }, { status: 201 });
  }),
  http.patch(`${API_URL}/roles/:id`, async ({ request, params }) => {
    const body = (await request.json()) as { permissions: string[] };
    const role = mockRoles.find((entry) => entry.id === params.id) ?? mockRoles[2];
    return HttpResponse.json({ ...role, permissions: body.permissions });
  }),
  http.delete(`${API_URL}/roles/:id`, () => new HttpResponse(null, { status: 204 })),
];
