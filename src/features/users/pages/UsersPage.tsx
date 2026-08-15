import { useState } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { PERMISSIONS } from '@/features/auth/types';
import { useRoles } from '@/features/roles/hooks/useRoles';
import { ApiError } from '@/shared/api/httpClient';
import { EmptyState, ErrorState, LoadingState } from '@/shared/components/ui/states';
import { useUsers } from '../hooks/useUsers';

export function UsersPage() {
  const { can, user: currentUser } = useAuth();
  const { users, isLoading, isError, refetch, assignRole } = useUsers();
  const { roles } = useRoles();
  const [error, setError] = useState<string | null>(null);

  const canAssign = can(PERMISSIONS.USERS_ASSIGN_ROLE);

  async function handleAssign(userId: string, roleId: string) {
    setError(null);
    try {
      await assignRole.mutateAsync({ userId, roleId });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not change that role.');
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-8">
        <h1 className="text-3xl tracking-tight">Users</h1>
        <p className="mt-2 text-ink-soft">Assign each account the role that matches what they should do.</p>
      </header>

      {error && (
        <p className="mb-6 border border-line bg-surface px-3 py-2 text-sm text-danger" role="alert">
          {error}
        </p>
      )}

      {isLoading && <LoadingState label="Loading users" />}
      {isError && <ErrorState message="We couldn't load the users." onRetry={() => void refetch()} />}

      {users && users.length === 0 && <EmptyState title="No users yet" />}

      {users && users.length > 0 && (
        <div className="overflow-x-auto border border-line bg-surface">
          <table className="w-full text-left">
            <thead className="border-b border-line text-sm text-ink-soft">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const isSelf = user.id === currentUser?.id;

                return (
                  <tr key={user.id} className="border-b border-line last:border-b-0">
                    <td className="px-4 py-3">
                      {user.name}
                      {isSelf && <span className="ml-2 text-xs text-ink-muted">(you)</span>}
                    </td>
                    <td className="px-4 py-3 text-ink-soft">{user.email}</td>
                    <td className="px-4 py-3">
                      {canAssign && roles ? (
                        <select
                          aria-label={`Role for ${user.name}`}
                          value={user.role?.id ?? ''}
                          disabled={assignRole.isPending}
                          onChange={(e) => void handleAssign(user.id, e.target.value)}
                          className="h-9 border border-line bg-surface px-2 text-sm text-ink focus:border-accent focus:outline-none"
                        >
                          {roles.map((role) => (
                            <option key={role.id} value={role.id}>
                              {role.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-ink-soft">{user.role?.name ?? '—'}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
