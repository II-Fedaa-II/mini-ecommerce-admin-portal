import { useState, type FormEvent } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import type { Product, ProductInput, ProductVariant } from '../types';

interface ProductFormProps {
  initialProduct?: Product;
  isSubmitting: boolean;
  onSubmit: (input: ProductInput) => void;
  onCancel: () => void;
}

/** Variants are edited as free text ("S, M, L") — one line per variant group. */
function variantsToText(variants: ProductVariant[]): string {
  return variants.map((variant) => `${variant.name}: ${variant.options.join(', ')}`).join('\n');
}

function parseVariants(text: string): ProductVariant[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, options = ''] = line.split(':');
      return {
        name: name.trim(),
        options: options
          .split(',')
          .map((option) => option.trim())
          .filter(Boolean),
      };
    })
    .filter((variant) => variant.name && variant.options.length > 0);
}

export function ProductForm({ initialProduct, isSubmitting, onSubmit, onCancel }: ProductFormProps) {
  const [title, setTitle] = useState(initialProduct?.title ?? '');
  const [description, setDescription] = useState(initialProduct?.description ?? '');
  const [price, setPrice] = useState(String(initialProduct?.price ?? ''));
  const [stock, setStock] = useState(String(initialProduct?.stock ?? ''));
  const [variantsText, setVariantsText] = useState(variantsToText(initialProduct?.variants ?? []));

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      price: Number(price),
      stock: Number(stock),
      variants: parseVariants(variantsText),
    });
  }

  return (
    <form className="flex flex-col gap-4 border border-line bg-surface p-6" onSubmit={handleSubmit}>
      <h2 className="text-xl">{initialProduct ? 'Edit product' : 'New product'}</h2>

      <div className="flex flex-col gap-2">
        <label className="text-sm text-ink-soft" htmlFor="title">
          Title
        </label>
        <Input id="title" required value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm text-ink-soft" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          required
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-line bg-surface px-3 py-2 text-base text-ink focus:border-accent focus:outline-none"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-sm text-ink-soft" htmlFor="price">
            Price
          </label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-ink-soft" htmlFor="stock">
            Stock
          </label>
          <Input
            id="stock"
            type="number"
            min="0"
            required
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm text-ink-soft" htmlFor="variants">
          Variants
        </label>
        <textarea
          id="variants"
          rows={3}
          placeholder={'Size: S, M, L\nColor: Black, White'}
          value={variantsText}
          onChange={(e) => setVariantsText(e.target.value)}
          className="w-full border border-line bg-surface px-3 py-2 font-mono text-sm text-ink focus:border-accent focus:outline-none"
        />
        <p className="text-xs text-ink-muted">One group per line, as “Name: option, option”.</p>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : 'Save product'}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
