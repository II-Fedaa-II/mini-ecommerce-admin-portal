import { setupServer } from 'msw/node';
import { authHandlers } from '@/features/auth/api/authApi.mocks';
import { orderHandlers } from '@/features/orders/api/ordersApi.mocks';
import { productHandlers } from '@/features/products/api/productsApi.mocks';
import { roleHandlers } from '@/features/roles/api/rolesApi.mocks';
import { userHandlers } from '@/features/users/api/usersApi.mocks';

/**
 * Test-runner plumbing only — every handler is defined by the feature that owns it,
 * so no feature's mock data lives outside that feature's folder.
 */
export const server = setupServer(
  ...authHandlers,
  ...orderHandlers,
  ...productHandlers,
  ...roleHandlers,
  ...userHandlers,
);
