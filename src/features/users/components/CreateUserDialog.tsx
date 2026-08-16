import { useState, type FormEvent } from 'react';
import type { Role } from '@/features/roles/types';
import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogShell } from '@/shared/components/ui/dialog';
import { FieldLabel, Input } from '@/shared/components/ui/input';
import type { CreateUserInput } from '../types';

const MIN_PASSWORD_LENGTH = 8;

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roles: Role[];
  isSubmitting: boolean;
  onSubmit: (input: CreateUserInput) => void;
}

export function CreateUserDialog({ open, onOpenChange, roles, isSubmitting, onSubmit }: CreateUserDialogProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState(roles[0]?.id ?? '');

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setName('');
      setEmail('');
      setPassword('');
      setRoleId(roles[0]?.id ?? '');
    }
    onOpenChange(nextOpen);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit({ name: name.trim(), email: email.trim().toLowerCase(), password, roleId });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogShell title="New user" description="Create an account and assign it a role directly.">
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="new-user-name">Name</FieldLabel>
            <Input id="new-user-name" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="new-user-email">Email</FieldLabel>
            <Input
              id="new-user-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="new-user-password">Password</FieldLabel>
            <Input
              id="new-user-password"
              type="password"
              required
              minLength={MIN_PASSWORD_LENGTH}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="text-xs text-ink-muted">At least {MIN_PASSWORD_LENGTH} characters.</p>
          </div>

          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="new-user-role">Role</FieldLabel>
            <select
              id="new-user-role"
              required
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              className="h-12 border-2 border-ink bg-surface px-3 text-base text-ink focus:outline-none focus:ring-4 focus:ring-accent/40"
            >
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          <div className="-mx-6 mt-2 flex justify-end gap-3 border-t-2 border-ink px-6 pt-4">
            <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !roleId}>
              {isSubmitting ? 'Creating…' : 'Create user'}
            </Button>
          </div>
        </form>
      </DialogShell>
    </Dialog>
  );
}
