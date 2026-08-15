import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { productsApi } from '../api/productsApi';
import type { ProductInput } from '../types';

export const productKeys = {
  all: ['products'] as const,
  detail: (id: string) => ['products', id] as const,
};

export function useProducts() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({ queryKey: productKeys.all, queryFn: productsApi.list, enabled: isAuthenticated });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: productKeys.all });

  const createProduct = useMutation({ mutationFn: productsApi.create, onSuccess: invalidate });
  const updateProduct = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<ProductInput> }) => productsApi.update(id, input),
    onSuccess: invalidate,
  });
  const deleteProduct = useMutation({ mutationFn: productsApi.remove, onSuccess: invalidate });

  return {
    products: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}
