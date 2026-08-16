import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { PERMISSIONS } from '@/features/auth/types';
import { usersApi } from '../api/usersApi';
import type { ListUsersQuery } from '../types';

export const userKeys = {
  all: ['users'] as const,
  list: (query: ListUsersQuery) => ['users', 'list', query] as const,
};

export function useUsers(query: ListUsersQuery = {}) {
  const { can } = useAuth();
  const queryClient = useQueryClient();

  const usersQuery = useQuery({
    queryKey: userKeys.list(query),
    queryFn: () => usersApi.list(query),
    enabled: can(PERMISSIONS.USERS_READ),
    placeholderData: keepPreviousData,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: userKeys.all });

  const assignRole = useMutation({
    mutationFn: ({ userId, roleId }: { userId: string; roleId: string }) => usersApi.assignRole(userId, roleId),
    onSuccess: invalidate,
  });

  const createUser = useMutation({
    mutationFn: usersApi.create,
    onSuccess: invalidate,
  });

  return {
    data: usersQuery.data,
    isLoading: usersQuery.isLoading,
    isError: usersQuery.isError,
    error: usersQuery.error,
    isPlaceholderData: usersQuery.isPlaceholderData,
    refetch: usersQuery.refetch,
    assignRole,
    createUser,
  };
}
