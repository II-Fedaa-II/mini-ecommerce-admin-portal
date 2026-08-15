export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: { id: string; name: string; permissions: string[] } | null;
}
