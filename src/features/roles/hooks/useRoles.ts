import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { PERMISSIONS } from '@/features/auth/types';
import { rolesApi } from '../api/rolesApi';

export const roleKeys = {
  all: ['roles'] as const,
  permissions: ['roles', 'permissions'] as const,
};

export function useRoles() {
  const { can } = useAuth();
  const queryClient = useQueryClient();
  const enabled = can(PERMISSIONS.ROLES_MANAGE);

  const rolesQuery = useQuery({ queryKey: roleKeys.all, queryFn: rolesApi.list, enabled });
  const permissionsQuery = useQuery({
    queryKey: roleKeys.permissions,
    queryFn: rolesApi.listPermissions,
    enabled,
    // The permission catalogue is effectively static for the life of a session.
    staleTime: Infinity,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: roleKeys.all });

  const createRole = useMutation({
    mutationFn: ({ name, permissions }: { name: string; permissions: string[] }) =>
      rolesApi.create(name, permissions),
    onSuccess: invalidate,
  });

  const updateRole = useMutation({
    mutationFn: ({ id, permissions }: { id: string; permissions: string[] }) =>
      rolesApi.updatePermissions(id, permissions),
    onSuccess: invalidate,
  });

  const deleteRole = useMutation({ mutationFn: rolesApi.remove, onSuccess: invalidate });

  return {
    roles: rolesQuery.data,
    availablePermissions: permissionsQuery.data?.permissions ?? [],
    isLoading: rolesQuery.isLoading,
    isError: rolesQuery.isError,
    refetch: rolesQuery.refetch,
    createRole,
    updateRole,
    deleteRole,
  };
}
