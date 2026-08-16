import { useAuth } from '@/features/auth/hooks/useAuth';
import { PERMISSIONS } from '@/features/auth/types';
import { useRoles } from '@/features/roles/hooks/useRoles';
import { EmptyState, ErrorState, LoadingState } from '@/shared/components/ui/states';
import { useToast } from '@/shared/components/ui/toast';
import { errorMessage } from '@/shared/lib/errorMessage';
import { useUsers } from '../hooks/useUsers';

export function UsersPage() {
  const { can, user: currentUser } = useAuth();
  const { users, isLoading, isError, refetch, assignRole } = useUsers();
  const { roles } = useRoles();
  const toast = useToast();

  const canAssign = can(PERMISSIONS.USERS_ASSIGN_ROLE);

  async function handleAssign(user: { id: string; name: string }, roleId: string) {
    try {
      const updated = await assignRole.mutateAsync({ userId: user.id, roleId });
      toast.success(`${user.name} is now ${updated.role?.name ?? 'updated'}.`);
    } catch (err) {
      toast.error(errorMessage(err, 'Could not change that role.'));
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-8 border-b-2 border-ink pb-6">
        <h1 className="display text-5xl">Users</h1>
        <p className="mt-2 text-sm text-ink-soft">Assign each account the role that matches what they should do.</p>
      </header>

      {isLoading && <LoadingState label="Loading users" />}
      {isError && <ErrorState message="We couldn't load the users." onRetry={() => void refetch()} />}

      {users && users.length === 0 && <EmptyState title="No users yet" />}

      {users && users.length > 0 && (
        <div className="overflow-x-auto border-2 border-ink bg-surface">
          <table className="w-full text-left">
            <thead className="border-b-2 border-ink bg-paper text-[11px] font-bold tracking-[0.1em] text-ink-soft uppercase">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const isSelf = user.id === currentUser?.id;

                return (
                  <tr key={user.id} className="border-b-2 border-line last:border-b-0">
                    <td className="px-4 py-3 font-semibold">
                      {user.name}
                      {isSelf && <span className="ml-2 text-xs font-normal text-ink-muted">(you)</span>}
                    </td>
                    <td className="px-4 py-3 text-ink-soft">{user.email}</td>
                    <td className="px-4 py-3">
                      {canAssign && roles ? (
                        <select
                          aria-label={`Role for ${user.name}`}
                          value={user.role?.id ?? ''}
                          disabled={assignRole.isPending}
                          onChange={(e) => void handleAssign(user, e.target.value)}
                          className="h-10 border-2 border-ink bg-surface px-2 text-sm text-ink focus:outline-none focus:ring-4 focus:ring-accent/40"
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
