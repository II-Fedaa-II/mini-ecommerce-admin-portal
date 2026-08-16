export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: { id: string; name: string; permissions: string[] } | null;
}

export interface CreateUserInput {
  email: string;
  password: string;
  name: string;
  roleId: string;
}

export interface ListUsersQuery {
  page?: number;
  limit?: number;
  search?: string;
  roleId?: string;
}

export interface PaginatedUsers {
  items: AdminUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
