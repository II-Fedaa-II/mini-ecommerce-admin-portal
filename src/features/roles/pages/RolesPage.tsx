import { Lock, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button } from '@/shared/components/ui/button';
import { ConfirmDialog, Dialog, DialogClose, DialogShell } from '@/shared/components/ui/dialog';
import { FieldLabel, Input } from '@/shared/components/ui/input';
import { useToast } from '@/shared/components/ui/toast';
import { errorMessage } from '@/shared/lib/errorMessage';
import { ErrorState, LoadingState } from '@/shared/components/ui/states';
import { PermissionPicker } from '../components/PermissionPicker';
import { useRoles } from '../hooks/useRoles';
import type { Role } from '../types';

export function RolesPage() {
  const { isAdmin } = useAuth();
  const { roles, availablePermissions, isLoading, isError, error, refetch, createRole, updateRole, deleteRole } =
    useRoles();

  const [isCreating, setIsCreating] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRolePermissions, setNewRolePermissions] = useState<string[]>([]);

  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [editingPermissions, setEditingPermissions] = useState<string[]>([]);

  const [pendingDelete, setPendingDelete] = useState<Role | null>(null);

  const toast = useToast();

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    const name = newRoleName.trim();
    try {
      await createRole.mutateAsync({ name, permissions: newRolePermissions });
      toast.success(`Role "${name}" created.`);
      setNewRoleName('');
      setNewRolePermissions([]);
      setIsCreating(false);
    } catch (err) {
      toast.error(errorMessage(err, 'Could not create the role.'));
    }
  }

  function openEdit(role: Role) {
    setEditingRole(role);
    setEditingPermissions(role.permissions);
  }

  async function handleSaveEdit() {
    if (!editingRole) return;
    try {
      await updateRole.mutateAsync({ id: editingRole.id, permissions: editingPermissions });
      toast.success(`Permissions for "${editingRole.name}" updated.`);
      setEditingRole(null);
    } catch (err) {
      toast.error(errorMessage(err, 'Could not update the role.'));
    }
  }

  async function handleDelete(role: Role) {
    try {
      await deleteRole.mutateAsync(role.id);
      toast.success(`Role "${role.name}" deleted.`);
      setPendingDelete(null);
    } catch (err) {
      toast.error(errorMessage(err, 'Could not delete the role.'));
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <header className="mb-8 flex items-end justify-between gap-4 border-b-2 border-ink pb-6">
        <div>
          <h1 className="display text-5xl">Roles</h1>
          <p className="mt-2 text-sm text-ink-soft">
            Grant each role exactly the features it needs. Changes take effect on the next request.
          </p>
        </div>

        {isAdmin && (
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="h-4 w-4" aria-hidden strokeWidth={3} />
            New role
          </Button>
        )}
      </header>

      {isLoading && <LoadingState label="Loading roles" />}
      {isError && (
        <ErrorState message={errorMessage(error, "We couldn't load the roles.")} onRetry={() => void refetch()} />
      )}

      <div className="flex flex-col gap-4">
        {roles?.map((role) => (
          <section key={role.id} className="border-2 border-ink bg-surface p-6">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="display text-2xl">{role.name}</h3>
                {role.isSystem ? (
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-muted">
                    <Lock className="h-3 w-3" aria-hidden strokeWidth={2.5} />
                    Built-in role — locked so the system always has a working administrator.
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-ink-muted">
                    {role.permissions.length === 0
                      ? 'No permissions granted'
                      : `${role.permissions.length} permission${role.permissions.length === 1 ? '' : 's'}`}
                  </p>
                )}
              </div>

              {isAdmin && !role.isSystem && (
                <div className="flex shrink-0 gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(role)}>
                    <Pencil className="h-3.5 w-3.5" aria-hidden strokeWidth={2.5} />
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    aria-label={`Delete role ${role.name}`}
                    onClick={() => setPendingDelete(role)}
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden strokeWidth={2.5} />
                  </Button>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {role.permissions.length === 0 && (
                <span className="text-xs text-ink-muted">—</span>
              )}
              {role.permissions.map((permission) => (
                <span
                  key={permission}
                  className="border-2 border-line px-2.5 py-1 font-mono text-xs text-ink-soft"
                >
                  {permission}
                </span>
              ))}
            </div>
          </section>
        ))}
      </div>

      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogShell title="New role" size="lg">
          <form className="flex flex-col gap-5" onSubmit={handleCreate}>
            <div className="flex flex-col gap-2">
              <FieldLabel htmlFor="role-name">Name</FieldLabel>
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
              <FieldLabel>Permissions</FieldLabel>
              <PermissionPicker
                available={availablePermissions}
                selected={newRolePermissions}
                onChange={setNewRolePermissions}
              />
            </div>

            <div className="-mx-6 mt-2 flex justify-end gap-3 border-t-2 border-ink px-6 pt-4">
              <DialogClose asChild>
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={createRole.isPending}>
                {createRole.isPending ? 'Creating…' : 'Create role'}
              </Button>
            </div>
          </form>
        </DialogShell>
      </Dialog>

      <Dialog open={editingRole !== null} onOpenChange={(open) => !open && setEditingRole(null)}>
        <DialogShell
          title={editingRole ? `Edit ${editingRole.name}` : 'Edit role'}
          description="Toggle the permissions this role should grant."
          size="lg"
        >
          <div className="flex flex-col gap-5">
            <PermissionPicker
              available={availablePermissions}
              selected={editingPermissions}
              onChange={setEditingPermissions}
            />

            <div className="-mx-6 mt-2 flex justify-end gap-3 border-t-2 border-ink px-6 pt-4">
              <Button type="button" variant="ghost" onClick={() => setEditingRole(null)}>
                Cancel
              </Button>
              <Button type="button" onClick={() => void handleSaveEdit()} disabled={updateRole.isPending}>
                {updateRole.isPending ? 'Saving…' : 'Save changes'}
              </Button>
            </div>
          </div>
        </DialogShell>
      </Dialog>

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Delete role"
        body={
          pendingDelete && (
            <>
              Delete <span className="font-semibold text-ink">{pendingDelete.name}</span>? Anyone
              assigned this role loses its permissions immediately.
            </>
          )
        }
        confirmLabel="Delete role"
        isPending={deleteRole.isPending}
        onConfirm={() => pendingDelete && void handleDelete(pendingDelete)}
      />
    </main>
  );
}
