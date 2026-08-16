import { Plus, Search, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { PERMISSIONS } from '@/features/auth/types';
import { useRoles } from '@/features/roles/hooks/useRoles';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Pagination } from '@/shared/components/ui/Pagination';
import { EmptyState, ErrorState, LoadingState } from '@/shared/components/ui/states';
import { useToast } from '@/shared/components/ui/toast';
import { errorMessage } from '@/shared/lib/errorMessage';
import { CreateUserDialog } from '../components/CreateUserDialog';
import { useUsers } from '../hooks/useUsers';
import type { CreateUserInput } from '../types';

const PAGE_SIZE = 10;

export function UsersPage() {
  const { can, user: currentUser } = useAuth();
  const { roles } = useRoles();
  const toast = useToast();

  const [isCreating, setIsCreating] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchDraft, setSearchDraft] = useState('');
  const [roleId, setRoleId] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchDraft !== search) {
        setSearch(searchDraft);
        setPage(1);
      }
    }, 350);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchDraft]);

  const query = useMemo(
    () => ({ page, limit: PAGE_SIZE, search: search.trim() || undefined, roleId: roleId || undefined }),
    [page, search, roleId],
  );

  const { data, isLoading, isError, error, isPlaceholderData, refetch, assignRole, createUser } = useUsers(query);

  const canAssign = can(PERMISSIONS.USERS_ASSIGN_ROLE);
  const canCreate = can(PERMISSIONS.USERS_WRITE);
  const hasActiveFilters = Boolean(search || roleId);

  function handleRoleFilterChange(value: string) {
    setRoleId(value);
    setPage(1);
  }

  function clearFilters() {
    setSearchDraft('');
    setSearch('');
    setRoleId('');
    setPage(1);
  }

  async function handleAssign(user: { id: string; name: string }, newRoleId: string) {
    try {
      const updated = await assignRole.mutateAsync({ userId: user.id, roleId: newRoleId });
      toast.success(`${user.name} is now ${updated.role?.name ?? 'updated'}.`);
    } catch (err) {
      toast.error(errorMessage(err, 'Could not change that role.'));
    }
  }

  async function handleCreate(input: CreateUserInput) {
    try {
      const created = await createUser.mutateAsync(input);
      toast.success(`${created.name} was created.`);
      setIsCreating(false);
    } catch (err) {
      toast.error(errorMessage(err, 'Could not create that user.'));
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-8 flex items-end justify-between gap-4 border-b-2 border-ink pb-6">
        <div>
          <h1 className="display text-5xl">Users</h1>
          <p className="mt-2 text-sm text-ink-soft">
            {data ? `${data.total} account${data.total === 1 ? '' : 's'}` : 'Assign each account the role that matches what they should do.'}
          </p>
        </div>

        {canCreate && (
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="h-4 w-4" aria-hidden strokeWidth={3} />
            New user
          </Button>
        )}
      </header>

      <div className="mb-6 flex flex-wrap items-center gap-3 border-2 border-ink bg-surface p-4">
        <div className="relative min-w-[220px] flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink-muted"
            aria-hidden
            strokeWidth={2.5}
          />
          <Input
            aria-label="Search users by name or email"
            placeholder="Search by name or email…"
            value={searchDraft}
            onChange={(e) => setSearchDraft(e.target.value)}
            className="h-11 pl-10"
          />
        </div>

        <select
          aria-label="Filter by role"
          value={roleId}
          onChange={(e) => handleRoleFilterChange(e.target.value)}
          className="h-11 border-2 border-ink bg-surface px-3 text-sm text-ink focus:outline-none focus:ring-4 focus:ring-accent/40"
        >
          <option value="">All roles</option>
          {roles?.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="flex items-center gap-1 text-[11px] font-bold tracking-[0.1em] text-ink-soft uppercase transition-colors hover:text-danger"
          >
            <X className="h-3.5 w-3.5" aria-hidden strokeWidth={2.5} />
            Clear
          </button>
        )}
      </div>

      {isLoading && <LoadingState label="Loading users" />}
      {isError && (
        <ErrorState message={errorMessage(error, "We couldn't load the users.")} onRetry={() => void refetch()} />
      )}

      {data && data.items.length === 0 && (
        <EmptyState
          title={hasActiveFilters ? 'No users match those filters' : 'No users yet'}
          description={hasActiveFilters ? 'Try a different search or clear the filters above.' : undefined}
        />
      )}

      {data && data.items.length > 0 && (
        <div
          className={
            isPlaceholderData
              ? 'overflow-x-auto border-2 border-ink bg-surface opacity-50 transition-opacity'
              : 'overflow-x-auto border-2 border-ink bg-surface transition-opacity'
          }
        >
          <table className="w-full text-left">
            <thead className="border-b-2 border-ink bg-paper text-[11px] font-bold tracking-[0.1em] text-ink-soft uppercase">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((user) => {
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

      {data && (
        <Pagination
          page={data.page}
          totalPages={data.totalPages}
          onPageChange={setPage}
          disabled={isPlaceholderData}
        />
      )}

      <CreateUserDialog
        open={isCreating}
        onOpenChange={setIsCreating}
        roles={roles ?? []}
        isSubmitting={createUser.isPending}
        onSubmit={(input) => void handleCreate(input)}
      />
    </main>
  );
}
