import { apiRequest } from '@/shared/api/httpClient';
import type { ListOrdersQuery, PaginatedOrders } from '../types';

function toQueryString(query: ListOrdersQuery): string {
  const params = new URLSearchParams();
  if (query.page) params.set('page', String(query.page));
  if (query.limit) params.set('limit', String(query.limit));
  if (query.search) params.set('search', query.search);

  const serialized = params.toString();
  return serialized ? `?${serialized}` : '';
}

export const ordersApi = {
  list: (query: ListOrdersQuery = {}) =>
    apiRequest<PaginatedOrders>(`/orders${toQueryString(query)}`),
};
