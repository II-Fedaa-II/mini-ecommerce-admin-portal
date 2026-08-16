import { http, HttpResponse } from 'msw';
import { API_URL } from '@/shared/api/httpClient';
import type { AdminOrder } from '../types';

export const mockOrders: AdminOrder[] = [
  {
    id: 'order-1',
    items: [
      {
        productId: 'product-1',
        title: 'Classic Cotton T-Shirt',
        price: 19.99,
        quantity: 2,
        selectedVariants: [{ name: 'Size', value: 'M' }],
        subtotal: 39.98,
      },
    ],
    total: 39.98,
    createdAt: new Date().toISOString(),
    customer: { id: 'user-1', name: 'Demo Customer', email: 'demo@mini-ecommerce.test' },
  },
];

export const orderHandlers = [
  http.get(`${API_URL}/orders`, () =>
    HttpResponse.json({
      items: mockOrders,
      total: mockOrders.length,
      page: 1,
      limit: mockOrders.length,
      totalPages: 1,
    }),
  ),
];
