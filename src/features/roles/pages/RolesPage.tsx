import { useState, type FormEvent } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ApiError } from '@/shared/api/httpClient';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { ErrorState, LoadingState } from '@/shared/components/ui/states';
import { PermissionPicker } from '../components/PermissionPicker';
import { useRoles } from '../hooks/useRoles';

export function RolesPage() {
  const { isAdmin } = useAuth();
  const { roles, availablePermissions, isLoading, isError, refetch, createRole, updateRole, deleteRole } =
    useRoles();

  const [newRoleName, setNewRoleName] = useState('');
  const [newRolePermissions, setNewRolePermissions] = useState<string[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string[]>>({});
  const [error, setError] = useState<string | null>(null);

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      await createRole.mutateAsync({ name: newRoleName.trim(), permissions: newRolePermissions });
      setNewRoleName('');
      setNewRolePermissions([]);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not create the role.');
    }
  }

  async function handleSave(id: string, permissions: string[]) {
    setError(null);
    try {
      await updateRole.mutateAsync({ id, permissions });
      setDrafts((current) => {
        const next = { ...current };
        delete next[id];
        return next;
      });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not update the role.');
    }
  }

  async function handleDelete(id: string) {
    setError(null);
    try {
      await deleteRole.mutateAsync(id);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not delete the role.');
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-8">
        <h1 className="text-3xl tracking-tight">Roles</h1>
        <p className="mt-2 text-ink-soft">
          Grant each role exactly the features it needs. Changes take effect on the next request.
        </p>
      </header>

      {error && (
        <p className="mb-6 border border-line bg-surface px-3 py-2 text-sm text-danger" role="alert">
          {error}
        </p>
      )}

      {isAdmin && (
        <form className="mb-8 flex flex-col gap-4 border border-line bg-surface p-6" onSubmit={handleCreate}>
          <h2 className="text-xl">New role</h2>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-ink-soft" htmlFor="role-name">
              Name
            </label>
            <Input
              id="role-name"
              required
              placeholder="catalogue-editor"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
            />
            <p className="text-xs text-ink-muted">Lowercase letters, numbers, and hyphens.</p>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm text-ink-soft">Permissions</span>
            <PermissionPicker
              available={availablePermissions}
              selected={newRolePermissions}
              onChange={setNewRolePermissions}
            />
          </div>

          <div>
            <Button type="submit" disabled={createRole.isPending}>
              {createRole.isPending ? 'Creating…' : 'Create role'}
            </Button>
          </div>
        </form>
      )}

      {isLoading && <LoadingState label="Loading roles" />}
      {isError && <ErrorState message="We couldn't load the roles." onRetry={() => void refetch()} />}

      <div className="flex flex-col gap-4">
        {roles?.map((role) => {
          const draft = drafts[role.id] ?? role.permissions;
          const isDirty = drafts[role.id] !== undefined;

          return (
            <section key={role.id} className="border border-line bg-surface p-6">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl">{role.name}</h3>
                  {role.isSystem && (
                    <p className="mt-1 text-sm text-ink-muted">
                      Built-in role — locked so the system always has a working administrator.
                    </p>
                  )}
                </div>

                {isAdmin && !role.isSystem && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => void handleDelete(role.id)}
                    disabled={deleteRole.isPending}
                  >
                    Delete
                  </Button>
                )}
              </div>

              <PermissionPicker
                available={availablePermissions}
                selected={draft}
                disabled={!isAdmin || role.isSystem}
                onChange={(permissions) => setDrafts((current) => ({ ...current, [role.id]: permissions }))}
              />

              {isDirty && (
                <div className="mt-4 flex gap-3">
                  <Button size="sm" onClick={() => void handleSave(role.id, draft)} disabled={updateRole.isPending}>
                    {updateRole.isPending ? 'Saving…' : 'Save changes'}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      setDrafts((current) => {
                        const next = { ...current };
                        delete next[role.id];
                        return next;
                      })
                    }
                  >
                    Discard
                  </Button>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </main>
  );
}
