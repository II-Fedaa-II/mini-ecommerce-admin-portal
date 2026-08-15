import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import type { Permission } from '@/features/auth/types';
import { LoadingState } from '@/shared/components/ui/states';

/**
 * Route-level gating is a UX affordance: it keeps operators out of screens they cannot
 * use. It is not the security boundary — every endpoint re-checks permissions server-side.
 */
export function ProtectedRoute({ permission }: { permission?: Permission }) {
  const { isAuthenticated, isInitializing, can } = useAuth();
  const location = useLocation();

  if (isInitializing) return <LoadingState label="Restoring your session" />;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (permission && !can(permission)) return <Navigate to="/products" replace />;

  return <Outlet />;
}
