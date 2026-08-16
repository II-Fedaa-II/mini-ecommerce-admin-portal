import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { PERMISSIONS } from '@/features/auth/types';
import { Button } from '@/shared/components/ui/button';
import { ConfirmDialog, Dialog, DialogShell } from '@/shared/components/ui/dialog';
import { Pagination } from '@/shared/components/ui/Pagination';
import { ProductImage } from '@/shared/components/ui/ProductImage';
import { useToast } from '@/shared/components/ui/toast';
import { ApiError } from '@/shared/api/httpClient';
import { errorMessage } from '@/shared/lib/errorMessage';
import { EmptyState, ErrorState, LoadingState } from '@/shared/components/ui/states';
import { formatPrice } from '@/shared/lib/utils';
import { ProductFilters } from '../components/ProductFilters';
import { ProductForm } from '../components/ProductForm';
import { useProducts } from '../hooks/useProducts';
import type { Product, ProductInput, ProductSort } from '../types';

const PAGE_SIZE = 10;

export function ProductsPage() {
  const { can } = useAuth();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<ProductSort>('title_asc');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStock, setInStock] = useState(false);

  const query = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      sort,
      search: search.trim() || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      inStock: inStock || undefined,
    }),
    [page, sort, search, minPrice, maxPrice, inStock],
  );

  const {
    data,
    isLoading,
    isError,
    error,
    isPlaceholderData,
    refetch,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadImage,
  } = useProducts(query);

  const [editing, setEditing] = useState<Product | 'new' | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null);
  const toast = useToast();

  const canWrite = can(PERMISSIONS.PRODUCTS_WRITE);
  const canDelete = can(PERMISSIONS.PRODUCTS_DELETE);
  const hasActiveFilters = Boolean(search || minPrice || maxPrice || inStock);

  function resetToFirstPage<T>(setter: (value: T) => void) {
    return (value: T) => {
      setter(value);
      setPage(1);
    };
  }

  function clearFilters() {
    setSearch('');
    setMinPrice('');
    setMaxPrice('');
    setInStock(false);
    setPage(1);
  }

  async function handleSubmit(input: ProductInput) {
    try {
      if (editing === 'new') {
        await createProduct.mutateAsync(input);
        toast.success(`${input.title} created.`);
      } else if (editing) {
        await updateProduct.mutateAsync({ id: editing.id, input, expectedVersion: editing.version });
        toast.success(`${input.title} updated.`);
      }
      setEditing(null);
    } catch (err) {
      // A version conflict (409) means someone else saved first — the message already
      // tells the admin to reload; a stale form open on old data would just conflict again.
      if (err instanceof ApiError && err.status === 409) {
        toast.error(err.message);
        setEditing(null);
        void refetch();
        return;
      }
      toast.error(errorMessage(err, 'Could not save the product.'));
    }
  }

  async function handleDelete(product: Product) {
    try {
      await deleteProduct.mutateAsync(product.id);
      toast.success(`${product.title} deleted.`);
      setPendingDelete(null);
    } catch (err) {
      toast.error(errorMessage(err, 'Could not delete the product.'));
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <header className="mb-8 flex items-end justify-between gap-4 border-b-2 border-ink pb-6">
        <div>
          <h1 className="display text-5xl">Products</h1>
          <p className="mt-2 text-sm text-ink-soft">
            {data ? `${data.total} in the catalogue` : 'Manage the catalogue'}
          </p>
        </div>

        {canWrite && (
          <Button onClick={() => setEditing('new')}>
            <Plus className="h-4 w-4" aria-hidden strokeWidth={3} />
            New product
          </Button>
        )}
      </header>

      <ProductFilters
        search={search}
        onSearchChange={resetToFirstPage(setSearch)}
        sort={sort}
        onSortChange={resetToFirstPage(setSort)}
        minPrice={minPrice}
        onMinPriceChange={resetToFirstPage(setMinPrice)}
        maxPrice={maxPrice}
        onMaxPriceChange={resetToFirstPage(setMaxPrice)}
        inStock={inStock}
        onInStockChange={resetToFirstPage(setInStock)}
        onClear={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {isLoading && <LoadingState label="Loading products" />}
      {isError && (
        <ErrorState
          message={errorMessage(error, "We couldn't load the catalogue.")}
          onRetry={() => void refetch()}
        />
      )}

      {data && data.items.length === 0 && (
        <EmptyState
          title={hasActiveFilters ? 'No products match those filters' : 'No products yet'}
          description={
            hasActiveFilters
              ? 'Try a different search or clear the filters above.'
              : 'Create the first product to populate the storefront.'
          }
        />
      )}

      {data && data.items.length > 0 && (
        <div
          className={
            isPlaceholderData
              ? 'overflow-x-auto border-2 border-ink bg-surface opacity-50 transition-opacity'
              : 'overflow-x-auto border-2 border-ink bg-surface transition-opacity'
          }
        >
          <table className="w-full text-left">
            <thead className="border-b-2 border-ink bg-paper text-[11px] font-bold tracking-[0.1em] text-ink-soft uppercase">
              <tr>
                <th className="px-4 py-3" />
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Variants</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {data.items.map((product) => (
                <tr key={product.id} className="border-b-2 border-line last:border-b-0">
                  <td className="px-4 py-3">
                    <div className="h-12 w-12 overflow-hidden border-2 border-ink bg-paper">
                      <ProductImage
                        src={product.imageUrl}
                        alt={product.title}
                        className="h-full w-full object-cover"
                        letterClassName="display text-lg text-line"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold">{product.title}</td>
                  <td className="tabular px-4 py-3">{formatPrice(product.price)}</td>
                  <td className="tabular px-4 py-3">{product.stock}</td>
                  <td className="px-4 py-3 text-sm text-ink-muted">
                    {product.variants.length > 0
                      ? product.variants.map((variant) => variant.name).join(', ')
                      : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {canWrite && (
                        <Button
                          variant="outline"
                          size="sm"
                          aria-label={`Edit ${product.title}`}
                          onClick={() => setEditing(product)}
                        >
                          <Pencil className="h-3.5 w-3.5" aria-hidden strokeWidth={2.5} />
                        </Button>
                      )}
                      {canDelete && (
                        <Button
                          variant="danger"
                          size="sm"
                          aria-label={`Delete ${product.title}`}
                          onClick={() => setPendingDelete(product)}
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden strokeWidth={2.5} />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data && (
        <Pagination
          page={data.page}
          totalPages={data.totalPages}
          onPageChange={setPage}
          disabled={isPlaceholderData}
        />
      )}

      <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogShell
          title={editing && editing !== 'new' ? `Edit ${editing.title}` : 'New product'}
          size="lg"
        >
          {editing !== null && (
            <ProductForm
              initialProduct={editing === 'new' ? undefined : editing}
              isSubmitting={createProduct.isPending || updateProduct.isPending}
              isUploading={uploadImage.isPending}
              onUpload={(file) => uploadImage.mutateAsync(file)}
              onSubmit={(input) => void handleSubmit(input)}
              onCancel={() => setEditing(null)}
            />
          )}
        </DialogShell>
      </Dialog>

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Delete product"
        body={
          pendingDelete && (
            <>
              Delete <span className="font-semibold text-ink">{pendingDelete.title}</span>? It will
              disappear from the storefront immediately and this can't be undone.
            </>
          )
        }
        confirmLabel="Delete product"
        isPending={deleteProduct.isPending}
        onConfirm={() => pendingDelete && void handleDelete(pendingDelete)}
      />
    </main>
  );
}
