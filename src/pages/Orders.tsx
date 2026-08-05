import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { ordersApi, type Order, type OrderListResponse, type OrderStatus, type PaymentMethod } from '@/api/orders';
import { useToast } from '@/context/ToastContext';
import { getApiError } from '@/api/client';
import { DataTable, type Column } from '@/components/common/DataTable';
import { Badge } from '@/components/common/Badge';
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/orders/StatusBadge';
import { OrderDetailDrawer } from '@/components/orders/OrderDetailDrawer';
import { formatCurrency, formatDate } from '@/utils/format';

export function Orders() {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [rows, setRows] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await ordersApi.list({
        page,
        limit: 10,
        status: (statusFilter as OrderStatus) || undefined,
        paymentMethod: (methodFilter as PaymentMethod) || undefined,
        from: from || undefined,
        to: to || undefined,
      });
      if (Array.isArray(res)) {
        setRows(res);
        setTotal(res.length);
        setPages(1);
      } else {
        const r = res as OrderListResponse;
        setRows(r.data ?? []);
        setTotal(r.total ?? 0);
        setPages(r.pages ?? 1);
      }
    } catch (err) {
      toast(getApiError(err, 'Failed to load orders'), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter, methodFilter, from, to]);

  const columns = useMemo<Column<Order>[]>(
    () => [
      {
        key: 'orderNumber',
        header: 'Order #',
        render: (o) => (
          <span className="font-medium text-maroon-900">{o.orderNumber ?? o._id.slice(-6).toUpperCase()}</span>
        ),
      },
      {
        key: 'customer',
        header: 'Customer',
        render: (o) => (
          <div>
            <p className="font-medium text-maroon-800">{o.user?.name ?? 'Guest'}</p>
            <p className="text-xs text-maroon-400">{o.user?.email ?? '-'}</p>
          </div>
        ),
      },
      {
        key: 'items',
        header: 'Items',
        align: 'center',
        render: (o) => <span>{o.items.length}</span>,
      },
      {
        key: 'total',
        header: 'Total',
        render: (o) => <span className="font-medium">{formatCurrency(o.totalAmount)}</span>,
      },
      {
        key: 'payment',
        header: 'Payment',
        render: (o) => (
          <div className="flex flex-col gap-1">
            <Badge variant="gold">{o.paymentMethod}</Badge>
            <PaymentStatusBadge status={o.paymentStatus} />
          </div>
        ),
      },
      {
        key: 'status',
        header: 'Status',
        render: (o) => <OrderStatusBadge status={o.orderStatus} />,
      },
      {
        key: 'date',
        header: 'Date',
        render: (o) => <span className="text-xs text-maroon-500">{formatDate(o.createdAt)}</span>,
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-maroon-900">Orders</h1>
        <p className="mt-1 text-sm text-maroon-500">Manage and fulfill customer orders</p>
      </div>

      {/* Filters */}
      <div className="card grid grid-cols-1 gap-3 p-4 md:grid-cols-2 lg:grid-cols-6">
        <div className="relative lg:col-span-2">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-maroon-300" />
          <input
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <select value={statusFilter} onChange={(e) => { setPage(1); setStatusFilter(e.target.value); }} className="input-field">
          <option value="">All Status</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <select value={methodFilter} onChange={(e) => { setPage(1); setMethodFilter(e.target.value); }} className="input-field">
          <option value="">All Methods</option>
          <option value="COD">COD</option>
          <option value="Online">Online</option>
          <option value="PhonePe">PhonePe</option>
        </select>
        <input type="date" value={from} onChange={(e) => { setPage(1); setFrom(e.target.value); }} className="input-field" />
        <input type="date" value={to} onChange={(e) => { setPage(1); setTo(e.target.value); }} className="input-field" />
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        page={page}
        pages={pages}
        total={total}
        onPageChange={setPage}
        onRowClick={(o) => setSelectedId(o._id)}
        emptyTitle="No orders found"
        emptyMessage="Try adjusting filters or wait for new orders to come in."
      />

      <OrderDetailDrawer orderId={selectedId} onClose={() => setSelectedId(null)} />
    </div>
  );
}
