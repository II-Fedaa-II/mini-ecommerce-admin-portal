import { http, HttpResponse } from 'msw';
import { API_URL } from '@/shared/api/httpClient';
import { PERMISSIONS, type AuthUser } from '../types';

export const mockAdminUser: AuthUser = {
  id: 'user-admin',
  email: 'admin@mini-ecommerce.test',
  name: 'Demo Admin',
  role: { id: 'role-admin', name: 'admin', permissions: Object.values(PERMISSIONS) },
};

export const mockEditorUser: AuthUser = {
  id: 'user-editor',
  email: 'editor@mini-ecommerce.test',
  name: 'Catalogue Editor',
  role: {
    id: 'role-editor',
    name: 'catalogue-editor',
    permissions: [PERMISSIONS.PRODUCTS_READ, PERMISSIONS.PRODUCTS_WRITE],
  },
};

export const authHandlers = [
  http.post(`${API_URL}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };

    if (body.password !== 'Admin123!') {
      return HttpResponse.json({ statusCode: 401, message: 'Invalid email or password' }, { status: 401 });
    }

    const user = body.email === mockEditorUser.email ? mockEditorUser : mockAdminUser;
    return HttpResponse.json({ accessToken: 'mock-access-token', user });
  }),

  http.post(`${API_URL}/auth/refresh`, () => new HttpResponse(null, { status: 401 })),
  http.post(`${API_URL}/auth/logout`, () => HttpResponse.json({ success: true })),
];
