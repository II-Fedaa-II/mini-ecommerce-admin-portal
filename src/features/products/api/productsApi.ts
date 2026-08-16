import { apiRequest, apiUpload } from '@/shared/api/httpClient';
import type { PaginatedProducts, Product, ProductInput, ProductListQuery } from '../types';

function toQueryString(query: ProductListQuery): string {
  const params = new URLSearchParams();
  if (query.page) params.set('page', String(query.page));
  if (query.limit) params.set('limit', String(query.limit));
  if (query.search) params.set('search', query.search);
  if (query.minPrice !== undefined) params.set('minPrice', String(query.minPrice));
  if (query.maxPrice !== undefined) params.set('maxPrice', String(query.maxPrice));
  if (query.inStock) params.set('inStock', 'true');
  if (query.sort) params.set('sort', query.sort);

  const serialized = params.toString();
  return serialized ? `?${serialized}` : '';
}

export const productsApi = {
  list: (query: ProductListQuery = {}) =>
    apiRequest<PaginatedProducts>(`/products${toQueryString(query)}`),
  getById: (id: string) => apiRequest<Product>(`/products/${id}`),
  create: (input: ProductInput) => apiRequest<Product>('/products', { method: 'POST', body: input }),
  update: (id: string, input: Partial<ProductInput>, expectedVersion: number) =>
    apiRequest<Product>(`/products/${id}`, {
      method: 'PATCH',
      body: { ...input, version: expectedVersion },
    }),
  remove: (id: string) => apiRequest<void>(`/products/${id}`, { method: 'DELETE' }),
  uploadImage: (file: File) => apiUpload<{ imageUrl: string }>('/products/upload', file),
};
