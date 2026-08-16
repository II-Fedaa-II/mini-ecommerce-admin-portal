import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { PERMISSIONS } from '@/features/auth/types';
import { usersApi } from '../api/usersApi';

export const userKeys = { all: ['users'] as const };

export function useUsers() {
  const { can } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: userKeys.all,
    queryFn: usersApi.list,
    enabled: can(PERMISSIONS.USERS_READ),
  });

  const assignRole = useMutation({
    mutationFn: ({ userId, roleId }: { userId: string; roleId: string }) => usersApi.assignRole(userId, roleId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.all }),
  });

  const createUser = useMutation({
    mutationFn: usersApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.all }),
  });

  return {
    users: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    assignRole,
    createUser,
  };
}
