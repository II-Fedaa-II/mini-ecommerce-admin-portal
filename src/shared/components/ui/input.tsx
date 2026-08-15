import type { InputHTMLAttributes } from 'react';
import { cn } from '@/shared/lib/utils';

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-11 w-full border border-line bg-surface px-3 text-base text-ink placeholder:text-ink-muted',
        'focus:border-accent focus:outline-none',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
}
