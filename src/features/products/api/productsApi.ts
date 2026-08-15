import { apiRequest } from '@/shared/api/httpClient';
import type { Product, ProductInput } from '../types';

export const productsApi = {
  list: () => apiRequest<Product[]>('/products'),
  getById: (id: string) => apiRequest<Product>(`/products/${id}`),
  create: (input: ProductInput) => apiRequest<Product>('/products', { method: 'POST', body: input }),
  update: (id: string, input: Partial<ProductInput>) =>
    apiRequest<Product>(`/products/${id}`, { method: 'PATCH', body: input }),
  remove: (id: string) => apiRequest<void>(`/products/${id}`, { method: 'DELETE' }),
};
