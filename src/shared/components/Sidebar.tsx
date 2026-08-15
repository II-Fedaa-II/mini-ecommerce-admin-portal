import { LogOut, Package, ShieldCheck, Users } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { PERMISSIONS, type Permission } from '@/features/auth/types';
import { cn } from '@/shared/lib/utils';

const NAV_ITEMS: { to: string; label: string; icon: typeof Package; permission?: Permission }[] = [
  { to: '/products', label: 'Products', icon: Package },
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
    <aside className="flex w-60 shrink-0 flex-col border-r border-line bg-surface">
      <div className="border-b border-line px-6 py-5">
        <p className="text-xs tracking-wide text-ink-muted uppercase">Control panel</p>
        <p className="mt-1 text-lg tracking-tight">Mini E-Commerce</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {visibleItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 text-sm transition-colors',
                isActive ? 'bg-canvas text-ink' : 'text-ink-soft hover:bg-canvas hover:text-ink',
              )
            }
          >
            <Icon className="h-4 w-4" aria-hidden />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-line p-3">
        <div className="px-3 py-2">
          <p className="text-sm">{user?.name}</p>
          <p className="text-xs text-ink-muted">{user?.role?.name ?? 'no role'}</p>
        </div>

        <button
          className="flex w-full items-center gap-3 px-3 py-2 text-sm text-ink-soft transition-colors hover:bg-canvas hover:text-ink"
          onClick={() => void handleLogout()}
        >
          <LogOut className="h-4 w-4" aria-hidden />
          Sign out
        </button>
      </div>
    </aside>
  );
}
