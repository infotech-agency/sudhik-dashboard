import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Star,
  Ticket,
  FolderTree,
  Sparkles,
  Newspaper,
} from 'lucide-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/users', label: 'Users', icon: Users },
  { to: '/reviews', label: 'Reviews', icon: Star },
  { to: '/coupons', label: 'Coupons', icon: Ticket },
  { to: '/categories', label: 'Categories', icon: FolderTree },
  {to:'/blogs', label:"Blogs",icon:Newspaper},
   {to:'/videos', label:"Media",icon:Newspaper}
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-maroon-950/30 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-maroon-800 text-cream-100 transition-transform lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* <div className="flex items-center gap-3 border-b border-maroon-700/50 px-6 py-5">
        <img src="/logo.png" className='w-36' alt="" />
        </div> */}
        <div className="relative flex items-center gap-3 border-b border-maroon-700/50 px-6 py-5 overflow-hidden">
  {/* Glow Effect */}
  <div className="absolute left-6 top-1/2 -translate-y-1/2 h-24 w-40 rounded-full bg-yellow-400/30 blur-3xl"></div>

  {/* Logo */}
  <img
    src="/logo.png"
    className="relative z-10 w-36"
    alt="Logo"
  />
</div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gold-500 text-maroon-900 shadow-sm'
                      : 'text-cream-200 hover:bg-maroon-700/60 hover:text-cream-50'
                  }`
                }
              >
                <Icon className="h-5 w-5 shrink-0" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-maroon-700/50 px-6 py-4">
          <p className="text-[10px] uppercase tracking-wider text-maroon-300">
            SHUDDHIK&trade; Premium Cleaner
          </p>
          <p className="mt-1 text-xs text-maroon-200/70">
            Sacred surface care
          </p>
        </div>
      </aside>
    </>
  );
}
