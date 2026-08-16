export interface OrderLine {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  selectedVariants: { name: string; value: string }[];
  subtotal: number;
}

export interface OrderCustomer {
  id: string;
  name: string;
  email: string;
}

export interface AdminOrder {
  id: string;
  items: OrderLine[];
  total: number;
  createdAt: string;
  customer: OrderCustomer;
}

export interface ListOrdersQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedOrders {
  items: AdminOrder[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
