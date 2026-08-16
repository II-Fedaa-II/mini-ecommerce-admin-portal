import { useState, type FormEvent } from 'react';
import { Button } from '@/shared/components/ui/button';
import { FieldLabel, Input, Textarea } from '@/shared/components/ui/input';
import { ImageUploader } from './ImageUploader';
import type { Product, ProductInput, ProductVariant } from '../types';

interface ProductFormProps {
  initialProduct?: Product;
  isSubmitting: boolean;
  isUploading: boolean;
  onUpload: (file: File) => Promise<{ imageUrl: string }>;
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

export function ProductForm({
  initialProduct,
  isSubmitting,
  isUploading,
  onUpload,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const [title, setTitle] = useState(initialProduct?.title ?? '');
  const [description, setDescription] = useState(initialProduct?.description ?? '');
  const [price, setPrice] = useState(String(initialProduct?.price ?? ''));
  const [stock, setStock] = useState(String(initialProduct?.stock ?? ''));
  const [variantsText, setVariantsText] = useState(variantsToText(initialProduct?.variants ?? []));
  const [imageUrl, setImageUrl] = useState<string | null>(initialProduct?.imageUrl ?? null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      price: Number(price),
      stock: Number(stock),
      variants: parseVariants(variantsText),
      imageUrl,
    });
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor="image">Photo</FieldLabel>
        <ImageUploader
          value={imageUrl}
          alt={title || 'Product'}
          isUploading={isUploading}
          onUpload={onUpload}
          onChange={setImageUrl}
        />
      </div>

      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor="title">Title</FieldLabel>
        <Input id="title" required value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor="description">Description</FieldLabel>
        <Textarea
          id="description"
          required
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <FieldLabel htmlFor="price">Price</FieldLabel>
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
          <FieldLabel htmlFor="stock">Stock</FieldLabel>
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
        <FieldLabel htmlFor="variants">Variants</FieldLabel>
        <Textarea
          id="variants"
          rows={3}
          placeholder={'Size: S, M, L\nColor: Black, White'}
          value={variantsText}
          onChange={(e) => setVariantsText(e.target.value)}
          className="font-mono text-sm"
        />
        <p className="text-xs text-ink-muted">One group per line, as "Name: option, option".</p>
      </div>

      <div className="-mx-6 mt-2 flex justify-end gap-3 border-t-2 border-ink px-6 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || isUploading}>
          {isSubmitting ? 'Saving…' : 'Save product'}
        </Button>
      </div>
    </form>
  );
}
