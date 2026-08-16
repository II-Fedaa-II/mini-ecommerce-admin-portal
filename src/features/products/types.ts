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

export type ProductSort = 'newest' | 'price_asc' | 'price_desc' | 'title_asc';

export interface ProductListQuery {
  page?: number;
  limit?: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sort?: ProductSort;
}

export interface PaginatedProducts {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
