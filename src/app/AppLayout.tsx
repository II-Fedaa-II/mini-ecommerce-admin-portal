import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/shared/components/Sidebar';

export function AppLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
