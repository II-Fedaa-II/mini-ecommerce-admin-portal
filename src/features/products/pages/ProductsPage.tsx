import { useState } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { PERMISSIONS } from '@/features/auth/types';
import { Button } from '@/shared/components/ui/button';
import { useToast } from '@/shared/components/ui/toast';
import { errorMessage } from '@/shared/lib/errorMessage';
import { EmptyState, ErrorState, LoadingState } from '@/shared/components/ui/states';
import { formatPrice } from '@/shared/lib/utils';
import { ProductForm } from '../components/ProductForm';
import { useProducts } from '../hooks/useProducts';
import type { Product, ProductInput } from '../types';

export function ProductsPage() {
  const { can } = useAuth();
  const { products, isLoading, isError, refetch, createProduct, updateProduct, deleteProduct } = useProducts();

  const [editing, setEditing] = useState<Product | 'new' | null>(null);
  const toast = useToast();

  const canWrite = can(PERMISSIONS.PRODUCTS_WRITE);
  const canDelete = can(PERMISSIONS.PRODUCTS_DELETE);

  async function handleSubmit(input: ProductInput) {
    try {
      if (editing === 'new') {
        await createProduct.mutateAsync(input);
        toast.success(`${input.title} created.`);
      } else if (editing) {
        await updateProduct.mutateAsync({ id: editing.id, input });
        toast.success(`${input.title} updated.`);
      }
      setEditing(null);
    } catch (err) {
      // A duplicate title comes back as a 409 with a precise message — show it.
      toast.error(errorMessage(err, 'Could not save the product.'));
    }
  }

  async function handleDelete(product: Product) {
    try {
      await deleteProduct.mutateAsync(product.id);
      toast.success(`${product.title} deleted.`);
    } catch (err) {
      toast.error(errorMessage(err, 'Could not delete the product.'));
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl tracking-tight">Products</h1>
          <p className="mt-2 text-ink-soft">
            {products ? `${products.length} in the catalogue` : 'Manage the catalogue'}
          </p>
        </div>

        {canWrite && !editing && <Button onClick={() => setEditing('new')}>New product</Button>}
      </header>


      {editing && (
        <div className="mb-8">
          <ProductForm
            initialProduct={editing === 'new' ? undefined : editing}
            isSubmitting={createProduct.isPending || updateProduct.isPending}
            onSubmit={(input) => void handleSubmit(input)}
            onCancel={() => setEditing(null)}
          />
        </div>
      )}

      {isLoading && <LoadingState label="Loading products" />}
      {isError && <ErrorState message="We couldn't load the catalogue." onRetry={() => void refetch()} />}

      {products && products.length === 0 && (
        <EmptyState title="No products yet" description="Create the first product to populate the storefront." />
      )}

      {products && products.length > 0 && (
        <div className="overflow-x-auto border border-line bg-surface">
          <table className="w-full text-left">
            <thead className="border-b border-line text-sm text-ink-soft">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">Variants</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-line last:border-b-0">
                  <td className="px-4 py-3">{product.title}</td>
                  <td className="px-4 py-3">{formatPrice(product.price)}</td>
                  <td className="px-4 py-3">{product.stock}</td>
                  <td className="px-4 py-3 text-sm text-ink-muted">
                    {product.variants.length > 0
                      ? product.variants.map((variant) => variant.name).join(', ')
                      : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {canWrite && (
                        <Button variant="outline" size="sm" onClick={() => setEditing(product)}>
                          Edit
                        </Button>
                      )}
                      {canDelete && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => void handleDelete(product)}
                          disabled={deleteProduct.isPending}
                        >
                          Delete
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
    </main>
  );
}
