import { Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Input } from '@/shared/components/ui/input';
import { cn } from '@/shared/lib/utils';
import type { ProductSort } from '../types';

const SORT_OPTIONS: { value: ProductSort; label: string }[] = [
  { value: 'title_asc', label: 'Alphabetical' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
];

const selectClass =
  'h-11 border-2 border-ink bg-surface px-3 text-sm text-ink focus:outline-none focus:ring-4 focus:ring-accent/40';

interface ProductFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  sort: ProductSort;
  onSortChange: (value: ProductSort) => void;
  minPrice: string;
  onMinPriceChange: (value: string) => void;
  maxPrice: string;
  onMaxPriceChange: (value: string) => void;
  inStock: boolean;
  onInStockChange: (value: boolean) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
}

export function ProductFilters({
  search,
  onSearchChange,
  sort,
  onSortChange,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
  inStock,
  onInStockChange,
  onClear,
  hasActiveFilters,
}: ProductFiltersProps) {
  // Local echo of `search` so typing feels instant while the actual query is debounced —
  // firing a request on every keystroke would flood the API and thrash the products table.
  const [searchDraft, setSearchDraft] = useState(search);

  useEffect(() => setSearchDraft(search), [search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchDraft !== search) onSearchChange(searchDraft);
    }, 350);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchDraft]);

  return (
    <div className="mb-6 flex flex-col gap-3 border-2 border-ink bg-surface p-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink-muted"
            aria-hidden
            strokeWidth={2.5}
          />
          <Input
            aria-label="Search products"
            placeholder="Search products…"
            value={searchDraft}
            onChange={(e) => setSearchDraft(e.target.value)}
            className="h-11 pl-10"
          />
        </div>

        <select
          aria-label="Sort by"
          value={sort}
          onChange={(e) => onSortChange(e.target.value as ProductSort)}
          className={selectClass}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <Input
            aria-label="Minimum price"
            type="number"
            min="0"
            placeholder="Min $"
            value={minPrice}
            onChange={(e) => onMinPriceChange(e.target.value)}
            className="h-11 w-24"
          />
          <span className="text-ink-muted" aria-hidden>
            –
          </span>
          <Input
            aria-label="Maximum price"
            type="number"
            min="0"
            placeholder="Max $"
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(e.target.value)}
            className="h-11 w-24"
          />
        </div>

        <label className="flex items-center gap-2 text-sm font-semibold text-ink-soft">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => onInStockChange(e.target.checked)}
            className="h-4 w-4 accent-accent"
          />
          In stock only
        </label>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClear}
            className={cn(
              'ml-auto flex items-center gap-1 text-[11px] font-bold tracking-[0.1em] text-ink-soft uppercase',
              'transition-colors hover:text-danger',
            )}
          >
            <X className="h-3.5 w-3.5" aria-hidden strokeWidth={2.5} />
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
