import { Dialog, DialogShell } from '@/shared/components/ui/dialog';
import { formatPrice } from '@/shared/lib/utils';
import type { AdminOrder } from '../types';

interface OrderDetailsDialogProps {
  order: AdminOrder | null;
  onOpenChange: (open: boolean) => void;
}

export function OrderDetailsDialog({ order, onOpenChange }: OrderDetailsDialogProps) {
  return (
    <Dialog open={order !== null} onOpenChange={onOpenChange}>
      <DialogShell
        title={order ? `Order #${order.id.slice(-8)}` : 'Order'}
        description={order ? `Placed by ${order.customer.name} on ${new Date(order.createdAt).toLocaleDateString()}` : undefined}
        size="lg"
      >
        {order && (
          <div className="flex flex-col gap-4">
            <ul className="border-2 border-ink">
              {order.items.map((line, index) => (
                <li
                  key={`${line.productId}-${index}`}
                  className="flex items-start justify-between gap-6 border-b-2 border-line px-4 py-3 last:border-b-0"
                >
                  <div className="min-w-0">
                    <p className="font-semibold">{line.title}</p>
                    <p className="mt-1 text-[11px] font-bold tracking-[0.08em] text-ink-soft uppercase">
                      Qty {line.quantity}
                      {line.selectedVariants.length > 0 &&
                        ` · ${line.selectedVariants.map((v) => `${v.name}: ${v.value}`).join(' · ')}`}
                    </p>
                  </div>
                  <p className="tabular shrink-0 font-semibold">{formatPrice(line.subtotal)}</p>
                </li>
              ))}
            </ul>

            <div className="flex items-baseline justify-between border-t-2 border-ink pt-4">
              <span className="text-[11px] font-bold tracking-[0.14em] text-ink-soft uppercase">
                Total paid
              </span>
              <span className="display tabular text-3xl">{formatPrice(order.total)}</span>
            </div>
          </div>
        )}
      </DialogShell>
    </Dialog>
  );
}
