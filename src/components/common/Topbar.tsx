import { Menu, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { initials } from '@/utils/format';

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { admin, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-maroon-100 bg-cream-50/90 px-4 backdrop-blur-md lg:px-8">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 text-maroon-700 hover:bg-cream-100 lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden lg:block">
        <p className="font-serif text-lg font-semibold text-maroon-800">
          Welcome back, {admin?.name?.split(' ')[0] ?? 'Admin'}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3 rounded-full border border-maroon-100 bg-white py-1 pl-1 pr-3 shadow-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-maroon-700 text-xs font-semibold text-cream-50">
            {initials(admin?.name)}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold leading-tight text-maroon-800">
              {admin?.name ?? 'Admin'}
            </p>
            <p className="text-[11px] leading-tight text-maroon-400">
              {admin?.email ?? 'admin@shuddhik.com'}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 rounded-lg border border-maroon-200 bg-white px-3 py-2 text-sm font-medium text-maroon-700 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
