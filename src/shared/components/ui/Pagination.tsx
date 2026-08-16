import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export function Pagination({ page, totalPages, onPageChange, disabled }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Pagination"
      className="mt-6 flex items-center justify-center gap-4 border-t-2 border-ink pt-6"
    >
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page - 1)}
        disabled={disabled || page <= 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden strokeWidth={2.5} />
        Prev
      </Button>

      <p className="tabular text-[11px] font-bold tracking-[0.14em] text-ink-soft uppercase">
        Page {page} of {totalPages}
      </p>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page + 1)}
        disabled={disabled || page >= totalPages}
        aria-label="Next page"
      >
        Next
        <ChevronRight className="h-4 w-4" aria-hidden strokeWidth={2.5} />
      </Button>
    </nav>
  );
}
