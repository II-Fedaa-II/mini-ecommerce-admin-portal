import { http, HttpResponse } from 'msw';
import { API_URL } from '@/shared/api/httpClient';
import type { Product } from '../types';

export const mockProducts: Product[] = [
  {
    id: 'product-1',
    title: 'Classic Cotton T-Shirt',
    description: 'A breathable, everyday cotton t-shirt.',
    price: 19.99,
    stock: 42,
    variants: [{ name: 'Size', options: ['S', 'M', 'L'] }],
    imageUrl: null,
    version: 1,
  },
  {
    id: 'product-2',
    title: 'Ceramic Coffee Mug',
    description: '12oz ceramic mug.',
    price: 9.99,
    stock: 120,
    variants: [],
    imageUrl: null,
    version: 1,
  },
];

export const productHandlers = [
  http.get(`${API_URL}/products`, () => HttpResponse.json(mockProducts)),
  http.post(`${API_URL}/products`, async ({ request }) => {
    const body = (await request.json()) as Omit<Product, 'id' | 'version'>;
    return HttpResponse.json({ ...body, id: 'product-new', version: 1 }, { status: 201 });
  }),
  http.patch(`${API_URL}/products/:id`, async ({ request, params }) => {
    const body = (await request.json()) as Partial<Product>;
    return HttpResponse.json({
      ...mockProducts[0],
      ...body,
      id: params.id as string,
      version: (body.version ?? mockProducts[0].version) + 1,
    });
  }),
  http.delete(`${API_URL}/products/:id`, () => new HttpResponse(null, { status: 204 })),
  http.post(`${API_URL}/products/upload`, () =>
    HttpResponse.json({ imageUrl: '/uploads/mock-image.jpg' }, { status: 201 }),
  ),
];
