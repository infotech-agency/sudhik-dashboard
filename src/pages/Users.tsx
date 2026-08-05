import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { dashboardApi, type AdminUserRow } from '@/api/dashboard';
import { useToast } from '@/context/ToastContext';
import { getApiError } from '@/api/client';
import { DataTable, type Column } from '@/components/common/DataTable';
import { Badge } from '@/components/common/Badge';
import { UserDetailDrawer } from '@/components/users/UserDetailDrawer';
import { formatCurrency, formatDate, initials } from '@/utils/format';

export function Users() {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [rows, setRows] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await dashboardApi.users();
      setRows(data);
    } catch (err) {
      toast(getApiError(err, 'Failed to load users'), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = useMemo(() => {
    if (!search) return rows;
    const q = search.toLowerCase();
    return rows.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q)
    );
  }, [rows, search]);

  const columns = useMemo<Column<AdminUserRow>[]>(
    () => [
      {
        key: 'name',
        header: 'Name',
        render: (u) => (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-maroon-100 text-xs font-semibold text-maroon-700">
              {initials(u.name)}
            </div>
            <div>
              <p className="font-medium text-maroon-900">{u.name}</p>
              <p className="text-xs text-maroon-400">{u.email}</p>
            </div>
          </div>
        ),
      },
      {
        key: 'phone',
        header: 'Phone',
        render: (u) => <span className="text-sm">{u.phone ?? '-'}</span>,
      },
      {
        key: 'type',
        header: 'Type',
        render: (u) => (
          <Badge variant={u.isGuest ? 'warning' : 'success'}>
            {u.isGuest ? 'Guest' : 'Registered'}
          </Badge>
        ),
      },
      {
        key: 'orders',
        header: 'Orders',
        align: 'center',
        render: (u) => <span>{u.totalOrders ?? 0}</span>,
      },
      {
        key: 'spend',
        header: 'Total Spend',
        render: (u) => <span className="font-medium">{formatCurrency(u.totalSpend ?? 0)}</span>,
      },
      {
        key: 'joined',
        header: 'Joined',
        render: (u) => <span className="text-xs text-maroon-500">{formatDate(u.createdAt)}</span>,
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-maroon-900">Users</h1>
        <p className="mt-1 text-sm text-maroon-500">View customers and their purchase history</p>
      </div>

      <div className="card flex items-center gap-3 p-4">
        <div className="relative min-w-[260px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-maroon-300" />
          <input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={filtered}
        loading={loading}
        onRowClick={(u) => setSelectedId(u._id)}
        emptyTitle="No users found"
        emptyMessage="No customers match your search."
      />

      <UserDetailDrawer userId={selectedId} onClose={() => setSelectedId(null)} />
    </div>
  );
}
