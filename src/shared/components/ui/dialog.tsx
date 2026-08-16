import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from './button';
import { cn } from '@/shared/lib/utils';

/**
 * Radix handles the parts that are easy to get wrong by hand: focus trapping, restoring
 * focus to the trigger on close, `aria-modal`, escape-to-dismiss, and scroll locking.
 */
export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

interface DialogShellProps {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  /** Wider form dialogs need room for a two-column grid. */
  size?: 'md' | 'lg';
}

export function DialogShell({
  title,
  description,
  children,
  footer,
  size = 'md',
}: DialogShellProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        className={cn(
          'fixed inset-0 z-50 bg-ink/70',
          'data-[state=open]:animate-[fade-in_160ms_ease-out]',
        )}
      />

      <DialogPrimitive.Content
        className={cn(
          'fixed top-1/2 left-1/2 z-50 w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2',
          'max-h-[calc(100vh-2rem)] overflow-y-auto border-2 border-ink bg-paper',
          'shadow-[0_24px_60px_-20px_rgba(17,17,16,0.55)]',
          'data-[state=open]:animate-[dialog-in_200ms_cubic-bezier(0.16,1,0.3,1)]',
          size === 'lg' ? 'max-w-3xl' : 'max-w-lg',
        )}
      >
        <header className="flex items-start justify-between gap-6 border-b-2 border-ink bg-accent px-6 py-4">
          <div>
            <DialogPrimitive.Title className="display text-3xl text-white">{title}</DialogPrimitive.Title>
            {description && (
              <DialogPrimitive.Description className="mt-1 max-w-md text-sm text-white/75">
                {description}
              </DialogPrimitive.Description>
            )}
          </div>

          <DialogPrimitive.Close asChild>
            <button
              aria-label="Close dialog"
              className="-mr-1 shrink-0 border-2 border-white/70 p-1.5 text-white transition-colors hover:bg-white hover:text-accent"
            >
              <X className="h-4 w-4" aria-hidden strokeWidth={2.5} />
            </button>
          </DialogPrimitive.Close>
        </header>

        <div className="px-6 py-6">{children}</div>

        {footer && (
          <footer className="flex justify-end gap-3 border-t-2 border-ink px-6 py-4">{footer}</footer>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

/**
 * Destructive actions get their own shell: a named consequence and a button that
 * says what it deletes, rather than a generic "Are you sure?".
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  body,
  confirmLabel,
  isPending,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  body: ReactNode;
  confirmLabel: string;
  isPending?: boolean;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogShell
        title={title}
        footer={
          <>
            <DialogClose asChild>
              <Button variant="outline" size="sm">
                Keep it
              </Button>
            </DialogClose>
            <Button variant="danger" size="sm" onClick={onConfirm} disabled={isPending}>
              {isPending ? 'Deleting…' : confirmLabel}
            </Button>
          </>
        }
      >
        <div className="text-sm leading-relaxed text-ink-soft">{body}</div>
      </DialogShell>
    </Dialog>
  );
}
