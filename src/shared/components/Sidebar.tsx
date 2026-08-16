import { LogOut, Package, Receipt, ShieldCheck, Users } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { PERMISSIONS, type Permission } from '@/features/auth/types';
import { cn } from '@/shared/lib/utils';

const NAV_ITEMS: { to: string; label: string; icon: typeof Package; permission?: Permission }[] = [
  { to: '/products', label: 'Products', icon: Package },
  { to: '/orders', label: 'Orders', icon: Receipt, permission: PERMISSIONS.ORDERS_READ },
  { to: '/roles', label: 'Roles', icon: ShieldCheck, permission: PERMISSIONS.ROLES_MANAGE },
  { to: '/users', label: 'Users', icon: Users, permission: PERMISSIONS.USERS_READ },
];

export function Sidebar() {
  const { user, can, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    void navigate('/login', { replace: true });
  }

  // Hide what this operator's role cannot reach, rather than showing links that 403.
  const visibleItems = NAV_ITEMS.filter((item) => !item.permission || can(item.permission));

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r-2 border-ink bg-surface">
      <div className="border-b-2 border-ink bg-ink px-6 py-6">
        <p className="text-[11px] font-bold tracking-[0.14em] text-white/60 uppercase">Control panel</p>
        <p className="display mt-1 text-2xl text-white">Mini E-Commerce</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {visibleItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 border-2 border-transparent px-3 py-2.5 text-sm font-semibold uppercase tracking-[0.04em] transition-colors',
                isActive
                  ? 'border-ink bg-accent text-white'
                  : 'text-ink-soft hover:border-line hover:bg-paper hover:text-ink',
              )
            }
          >
            <Icon className="h-4 w-4" aria-hidden strokeWidth={2.5} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t-2 border-ink p-3">
        <div className="px-3 py-2">
          <p className="text-sm font-semibold">{user?.name}</p>
          <p className="text-xs text-ink-muted">{user?.role?.name ?? 'no role'}</p>
        </div>

        <button
          className="flex w-full items-center gap-3 px-3 py-2 text-sm font-semibold text-ink-soft uppercase tracking-[0.04em] transition-colors hover:bg-danger-soft hover:text-danger"
          onClick={() => void handleLogout()}
        >
          <LogOut className="h-4 w-4" aria-hidden strokeWidth={2.5} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
