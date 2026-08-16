import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '@/app/AppLayout';
import { ProtectedRoute } from '@/app/ProtectedRoute';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { PERMISSIONS } from '@/features/auth/types';
import { OrdersPage } from '@/features/orders/pages/OrdersPage';
import { ProductsPage } from '@/features/products/pages/ProductsPage';
import { RolesPage } from '@/features/roles/pages/RolesPage';
import { UsersPage } from '@/features/users/pages/UsersPage';

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/products" element={<ProductsPage />} />

          <Route element={<ProtectedRoute permission={PERMISSIONS.ORDERS_READ} />}>
            <Route path="/orders" element={<OrdersPage />} />
          </Route>

          <Route element={<ProtectedRoute permission={PERMISSIONS.ROLES_MANAGE} />}>
            <Route path="/roles" element={<RolesPage />} />
          </Route>

          <Route element={<ProtectedRoute permission={PERMISSIONS.USERS_READ} />}>
            <Route path="/users" element={<UsersPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/products" replace />} />
    </Routes>
  );
}
