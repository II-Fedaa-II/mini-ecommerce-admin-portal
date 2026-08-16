import { Loader2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';

export function LoadingState({ label = 'Loading', className }: { label?: string; className?: string }) {
  return (
    <div
      className={cn('flex items-center justify-center gap-3 py-24 text-ink-soft', className)}
      role="status"
    >
      <Loader2 className="h-4 w-4 animate-spin" aria-hidden strokeWidth={2.5} />
      <span className="text-[11px] font-bold tracking-[0.14em] uppercase">{label}…</span>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div
      className="flex flex-col items-start gap-4 border-2 border-danger bg-surface px-6 py-8"
      role="alert"
    >
      <p className="display text-3xl text-danger">Something broke</p>
      <p className="text-sm text-ink-soft">{message}</p>
      {onRetry && (
        <button
          className="border-2 border-ink px-4 py-2 text-[11px] font-bold tracking-[0.12em] uppercase transition-colors hover:bg-ink hover:text-paper"
          onClick={onRetry}
        >
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-4 border-2 border-dashed border-line bg-surface px-6 py-20 text-center">
      <p className="display text-4xl text-ink">{title}</p>
      {description && <p className="max-w-sm text-sm text-ink-soft">{description}</p>}
      {action}
    </div>
  );
}
