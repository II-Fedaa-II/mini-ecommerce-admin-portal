export interface AdminRole {
  id: string;
  name: string;
  permissions: string[];
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole | null;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

export const PERMISSIONS = {
  PRODUCTS_READ: 'products:read',
  PRODUCTS_WRITE: 'products:write',
  PRODUCTS_DELETE: 'products:delete',
  ORDERS_READ: 'orders:read',
  USERS_READ: 'users:read',
  USERS_ASSIGN_ROLE: 'users:assign-role',
  ROLES_MANAGE: 'roles:manage',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
