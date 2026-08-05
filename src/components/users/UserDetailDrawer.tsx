import { useEffect, useState } from 'react';
import { X, Mail, Phone, ShoppingBag, IndianRupee, Calendar } from 'lucide-react';
import { usersApi, type UserDetail } from '@/api/users';
import { useToast } from '@/context/ToastContext';
import { getApiError } from '@/api/client';
import { Badge } from '@/components/common/Badge';
import { formatCurrency, formatDate, formatDateTime, initials } from '@/utils/format';

export function UserDetailDrawer({
  userId,
  onClose,
}: {
  userId: string | null;
  onClose: () => void;
}) {
  const { toast } = useToast();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    usersApi
      .get(userId)
      .then(setUser)
      .catch((err) => toast(getApiError(err, 'Failed to load user'), 'error'))
      .finally(() => setLoading(false));
  }, [userId, toast]);

  if (!userId) return null;

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-maroon-950/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative h-full w-full max-w-xl overflow-y-auto bg-cream-100 shadow-card-hover animate-slide-in">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-maroon-100 bg-cream-50 px-6 py-4">
          <h2 className="font-serif text-xl font-semibold text-maroon-900">User Details</h2>
          <button onClick={onClose} className="rounded-lg p-2 text-maroon-400 hover:bg-cream-100" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-maroon-300 border-t-maroon-700" />
          </div>
        ) : user ? (
          <div className="space-y-5 p-6">
            {/* Profile */}
            <section className="card p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-maroon-700 text-lg font-semibold text-cream-50">
                  {initials(user.name)}
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-lg font-semibold text-maroon-900">{user.name}</h3>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant={user.isGuest ? 'warning' : 'success'}>
                      {user.isGuest ? 'Guest' : 'Registered'}
                    </Badge>
                  </div>
                </div>
              </div>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-maroon-700">
                  <Mail className="h-4 w-4 text-maroon-400" />
                  <span>{user.email ?? '-'}</span>
                </div>
                <div className="flex items-center gap-2 text-maroon-700">
                  <Phone className="h-4 w-4 text-maroon-400" />
                  <span>{user.phone ?? '-'}</span>
                </div>
                <div className="flex items-center gap-2 text-maroon-700">
                  <Calendar className="h-4 w-4 text-maroon-400" />
                  <span>Joined {formatDate(user.createdAt)}</span>
                </div>
              </dl>
            </section>

            {/* Lifetime stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="card p-5">
                <div className="flex items-center gap-2 text-maroon-500">
                  <ShoppingBag className="h-4 w-4" />
                  <p className="text-xs font-medium uppercase tracking-wider">Total Orders</p>
                </div>
                <p className="mt-2 font-serif text-2xl font-semibold text-maroon-900">
                  {user.totalOrders ?? 0}
                </p>
              </div>
              <div className="card p-5">
                <div className="flex items-center gap-2 text-maroon-500">
                  <IndianRupee className="h-4 w-4" />
                  <p className="text-xs font-medium uppercase tracking-wider">Lifetime Spend</p>
                </div>
                <p className="mt-2 font-serif text-2xl font-semibold text-maroon-900">
                  {formatCurrency(user.totalSpend ?? 0)}
                </p>
              </div>
            </div>

            {/* Order history */}
            <section className="card p-5">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-maroon-700">Order History</h3>
              {user.orders && user.orders.length > 0 ? (
                <div className="space-y-2">
                  {user.orders.map((o) => (
                    <div key={o._id} className="flex items-center justify-between rounded-lg border border-maroon-50 bg-cream-50 px-3 py-2.5">
                      <div>
                        <p className="text-sm font-medium text-maroon-900">{o.orderNumber ?? o._id.slice(-6).toUpperCase()}</p>
                        <p className="text-xs text-maroon-400">{formatDateTime(o.createdAt)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{formatCurrency(o.totalAmount)}</p>
                        <p className="text-xs text-maroon-400">{o.orderStatus}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-maroon-400">No orders yet.</p>
              )}
            </section>
          </div>
        ) : (
          <p className="py-20 text-center text-sm text-maroon-500">User not found.</p>
        )}
      </div>
    </div>
  );
}
