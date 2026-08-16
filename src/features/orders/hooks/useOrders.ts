import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { PERMISSIONS } from '@/features/auth/types';
import { ordersApi } from '../api/ordersApi';
import type { ListOrdersQuery } from '../types';

export const orderKeys = {
  list: (query: ListOrdersQuery) => ['orders', 'list', query] as const,
};

export function useOrders(query: ListOrdersQuery = {}) {
  const { can } = useAuth();
  const enabled = can(PERMISSIONS.ORDERS_READ);

  const ordersQuery = useQuery({
    queryKey: orderKeys.list(query),
    queryFn: () => ordersApi.list(query),
    enabled,
    placeholderData: keepPreviousData,
  });

  return {
    data: ordersQuery.data,
    isLoading: ordersQuery.isLoading,
    isError: ordersQuery.isError,
    error: ordersQuery.error,
    isPlaceholderData: ordersQuery.isPlaceholderData,
    refetch: ordersQuery.refetch,
  };
}
