import { Search, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Input } from '@/shared/components/ui/input';
import { Pagination } from '@/shared/components/ui/Pagination';
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from '@/shared/components/ui/states';
import { errorMessage } from '@/shared/lib/errorMessage';
import { formatPrice } from '@/shared/lib/utils';
import { OrderDetailsDialog } from '../components/OrderDetailsDialog';
import { useOrders } from '../hooks/useOrders';
import type { AdminOrder } from '../types';

const PAGE_SIZE = 10;

export function OrdersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchDraft, setSearchDraft] = useState('');
  const [viewing, setViewing] = useState<AdminOrder | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchDraft !== search) {
        setSearch(searchDraft);
        setPage(1);
      }
    }, 350);

    return () => clearTimeout(timer);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchDraft]);

  const query = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      search: search.trim() || undefined,
    }),
    [page, search],
  );

  const {
    data,
    isLoading,
    isError,
    error,
    isPlaceholderData,
    refetch,
  } = useOrders(query);

  return (
    <main className="flex h-dvh w-full flex-col overflow-hidden px-6 py-6">
      {/* Header */}
      <header className="mb-4 flex shrink-0 items-end justify-between gap-4 border-b-2 border-ink pb-4">
        <div>
          <h1 className="display text-5xl">Orders</h1>

          <p className="mt-1 text-sm text-ink-soft">
            {data
              ? `${data.total} placed`
              : 'Every order placed on the storefront'}
          </p>
        </div>
      </header>

      {/* Search */}
      <div className="mb-4 shrink-0 border-2 border-ink bg-surface p-4">
        <div className="relative max-w-sm">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink-muted"
            aria-hidden
            strokeWidth={2.5}
          />

          <Input
            aria-label="Search orders by customer email"
            placeholder="Search by customer email…"
            value={searchDraft}
            onChange={(e) => setSearchDraft(e.target.value)}
            className="h-11 pl-10"
          />

          {searchDraft && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setSearchDraft('')}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-ink-muted transition-colors hover:text-danger"
            >
              <X
                className="h-4 w-4"
                aria-hidden
                strokeWidth={2.5}
              />
            </button>
          )}
        </div>
      </div>

      {/* Main content area */}
      <div className="flex min-h-0 flex-1 flex-col">
        {isLoading && (
          <div className="flex min-h-0 flex-1 items-center justify-center">
            <LoadingState label="Loading orders" />
          </div>
        )}

        {isError && (
          <div className="flex min-h-0 flex-1 items-center justify-center">
            <ErrorState
              message={errorMessage(
                error,
                "We couldn't load the orders.",
              )}
              onRetry={() => void refetch()}
            />
          </div>
        )}

        {data && data.items.length === 0 && (
          <div className="flex min-h-0 flex-1 items-center justify-center">
            <EmptyState
              title={
                search
                  ? 'No orders match that search'
                  : 'No orders yet'
              }
              description={
                search
                  ? 'Try a different customer email.'
                  : 'Orders will appear here once shoppers check out.'
              }
            />
          </div>
        )}

        {data && data.items.length > 0 && (
          <>
            {/* Scrollable table */}
            <div
              className={
                isPlaceholderData
                  ? 'min-h-0 flex-1 overflow-auto border-2 border-ink bg-surface opacity-50 transition-opacity'
                  : 'min-h-0 flex-1 overflow-auto border-2 border-ink bg-surface transition-opacity'
              }
            >
              <table className="w-full min-w-[800px] text-left">
                <thead className="sticky top-0 z-10 border-b-2 border-ink bg-paper text-[11px] font-bold tracking-[0.1em] text-ink-soft uppercase">
                  <tr>
                    <th className="px-4 py-3">
                      Customer
                    </th>

                    <th className="px-4 py-3">
                      Placed
                    </th>

                    <th className="px-4 py-3">
                      Items
                    </th>

                    <th className="px-4 py-3">
                      Total
                    </th>

                    <th className="px-4 py-3" />
                  </tr>
                </thead>

                <tbody>
                  {data.items.map((order) => {
                    const itemCount = order.items.reduce(
                      (sum, line) => sum + line.quantity,
                      0,
                    );

                    return (
                      <tr
                        key={order.id}
                        className="border-b-2 border-line last:border-b-0"
                      >
                        {/* Customer */}
                        <td className="px-4 py-3">
                          <p className="font-semibold">
                            {order.customer.name}
                          </p>

                          <p className="text-sm text-ink-soft">
                            {order.customer.email}
                          </p>
                        </td>

                        {/* Date */}
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-ink-soft">
                          {new Date(
                            order.createdAt,
                          ).toLocaleDateString()}
                        </td>

                        {/* Items */}
                        <td className="tabular px-4 py-3">
                          {itemCount}
                        </td>

                        {/* Total */}
                        <td className="tabular whitespace-nowrap px-4 py-3 font-semibold">
                          {formatPrice(order.total)}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              setViewing(order)
                            }
                            className="text-[11px] font-bold tracking-[0.1em] text-accent uppercase transition-colors hover:text-ink"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination stays outside table scroll */}
            <div className="shrink-0 pt-3">
              <Pagination
                page={data.page}
                totalPages={data.totalPages}
                onPageChange={setPage}
                disabled={isPlaceholderData}
              />
            </div>
          </>
        )}
      </div>

      {/* Order details */}
      <OrderDetailsDialog
        order={viewing}
        onOpenChange={(open) =>
          !open && setViewing(null)
        }
      />
    </main>
  );
}