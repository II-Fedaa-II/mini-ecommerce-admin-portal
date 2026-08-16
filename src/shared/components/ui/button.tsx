import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/shared/lib/utils';

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap',
    'font-semibold uppercase tracking-[0.06em]',
    'transition-[transform,background-color,color] duration-150 ease-out',
    'active:translate-y-px',
    'disabled:pointer-events-none disabled:opacity-40',
  ].join(' '),
  {
    variants: {
      variant: {
        // Solid ink slab: the primary action reads as a stamped block.
        primary: 'bg-ink text-paper hover:bg-accent hover:text-white',
        accent: 'bg-accent text-white hover:bg-ink',
        outline: 'border-2 border-ink bg-transparent text-ink hover:bg-ink hover:text-paper',
        ghost: 'text-ink-soft hover:text-ink',
        danger: 'border-2 border-danger bg-transparent text-danger hover:bg-danger hover:text-paper',
      },
      size: {
        sm: 'h-9 px-3 text-[11px]',
        md: 'h-12 px-6 text-xs',
        lg: 'h-14 px-8 text-sm',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button';
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { buttonVariants };
