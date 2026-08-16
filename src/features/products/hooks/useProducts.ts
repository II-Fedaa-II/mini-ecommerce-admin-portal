import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { productsApi } from '../api/productsApi';
import type { ProductInput, ProductListQuery } from '../types';

export const productKeys = {
  all: ['products'] as const,
  list: (query: ProductListQuery) => ['products', 'list', query] as const,
  detail: (id: string) => ['products', id] as const,
};

export function useProducts(query: ProductListQuery = {}) {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const productsQuery = useQuery({
    queryKey: productKeys.list(query),
    queryFn: () => productsApi.list(query),
    enabled: isAuthenticated,
    // Keeps the current page's rows on screen while the next page/filter loads.
    placeholderData: keepPreviousData,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: productKeys.all });

  const createProduct = useMutation({ mutationFn: productsApi.create, onSuccess: invalidate });
  const updateProduct = useMutation({
    mutationFn: ({ id, input, expectedVersion }: { id: string; input: Partial<ProductInput>; expectedVersion: number }) =>
      productsApi.update(id, input, expectedVersion),
    onSuccess: invalidate,
  });
  const deleteProduct = useMutation({ mutationFn: productsApi.remove, onSuccess: invalidate });
  const uploadImage = useMutation({ mutationFn: productsApi.uploadImage });

  return {
    data: productsQuery.data,
    isLoading: productsQuery.isLoading,
    isError: productsQuery.isError,
    isPlaceholderData: productsQuery.isPlaceholderData,
    refetch: productsQuery.refetch,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadImage,
  };
}
