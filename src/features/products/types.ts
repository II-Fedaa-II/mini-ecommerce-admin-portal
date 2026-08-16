export interface ProductVariant {
  name: string;
  options: string[];
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  variants: ProductVariant[];
  imageUrl: string | null;
  version: number;
}

export interface ProductInput {
  title: string;
  description: string;
  price: number;
  stock: number;
  variants: ProductVariant[];
  imageUrl?: string | null;
}
