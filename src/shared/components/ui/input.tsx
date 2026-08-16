import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cn } from '@/shared/lib/utils';

const fieldClass = [
  'w-full border-2 border-ink bg-surface px-3 py-2.5',
  'text-base text-ink placeholder:text-ink-muted',
  'focus:border-ink focus:outline-none focus:ring-4 focus:ring-accent/40',
  'disabled:cursor-not-allowed disabled:opacity-50',
].join(' ');

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldClass, 'h-12', className)} {...props} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(fieldClass, className)} {...props} />;
}

export function FieldLabel({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-[11px] font-bold tracking-[0.12em] text-ink-soft uppercase"
    >
      {children}
    </label>
  );
}
