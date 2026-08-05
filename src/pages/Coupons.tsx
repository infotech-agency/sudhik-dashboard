import { useEffect, useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, Ticket, Info } from 'lucide-react';
import { couponsApi, type Coupon, type CouponListResponse } from '@/api/coupons';
import { useToast } from '@/context/ToastContext';
import { getApiError } from '@/api/client';
import { DataTable, type Column } from '@/components/common/DataTable';
import { Badge } from '@/components/common/Badge';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { CouponForm } from '@/components/coupons/CouponForm';
import { formatCurrency, formatDate } from '@/utils/format';

export function Coupons() {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<Coupon[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await couponsApi.list({ page, limit: 10 });
      if (Array.isArray(res)) {
        setRows(res);
        setTotal(res.length);
        setPages(1);
      } else {
        const r = res as CouponListResponse;
        setRows(r.data ?? []);
        setTotal(r.total ?? 0);
        setPages(r.pages ?? 1);
      }
    } catch (err) {
      toast(getApiError(err, 'Failed to load coupons'), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleSave = async (data: Partial<Coupon>) => {
    if (editing) {
      await couponsApi.update(editing._id, data);
      toast('Coupon updated', 'success');
    } else {
      await couponsApi.create(data);
      toast('Coupon created', 'success');
    }
    fetch();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await couponsApi.remove(deleteId);
      toast('Coupon deleted', 'success');
      setDeleteId(null);
      fetch();
    } catch (err) {
      toast(getApiError(err, 'Failed to delete coupon'), 'error');
    } finally {
      setDeleting(false);
    }
  };

  const columns = useMemo<Column<Coupon>[]>(
    () => [
      {
        key: 'code',
        header: 'Code',
        render: (c) => (
          <div className="flex items-center gap-2">
            <Ticket className="h-4 w-4 text-gold-500" />
            <span className="font-mono font-medium text-maroon-900">{c.code}</span>
          </div>
        ),
      },
      {
        key: 'discount',
        header: 'Discount',
        render: (c) => (
          <span className="font-medium">
            {c.discountType === 'flat' ? formatCurrency(c.value) : `${c.value}%`}
          </span>
        ),
      },
      {
        key: 'minOrder',
        header: 'Min Order',
        render: (c) => (c.minOrderAmount ? formatCurrency(c.minOrderAmount) : '-'),
      },
      {
        key: 'expiry',
        header: 'Expiry',
        render: (c) => (c.expiryDate ? formatDate(c.expiryDate) : '-'),
      },
      {
        key: 'usage',
        header: 'Usage',
        align: 'center',
        render: (c) => (
          <span className="text-xs">
            {c.usedCount ?? 0} / {c.usageLimit ?? '∞'}
          </span>
        ),
      },
      {
        key: 'active',
        header: 'Status',
        render: (c) => (
          <Badge variant={c.active ? 'success' : 'neutral'}>
            {c.active ? 'Active' : 'Inactive'}
          </Badge>
        ),
      },
      {
        key: 'actions',
        header: 'Actions',
        align: 'right',
        render: (c) => (
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setEditing(c);
                setFormOpen(true);
              }}
              className="rounded-lg p-2 text-maroon-600 hover:bg-cream-100"
              aria-label="Edit"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={() => setDeleteId(c._id)}
              className="rounded-lg p-2 text-red-500 hover:bg-red-50"
              aria-label="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-maroon-900">Coupons</h1>
          <p className="mt-1 text-sm text-maroon-500">Manage discount codes</p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
          className="btn-primary"
        >
          <Plus className="h-4 w-4" /> Add Coupon
        </button>
      </div>

      {/* Backend note */}
      <div className="flex items-start gap-3 rounded-xl border border-gold-200 bg-gold-50 p-4 text-sm text-maroon-800">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
        <p>
          Coupons require a backend addition: a <strong>Coupon</strong> model with CRUD
          controller/routes (same MVC pattern as Products), plus validation logic in the
          Order creation flow to apply a coupon and recompute <strong>totalAmount</strong>.
          See the README for details.
        </p>
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        page={page}
        pages={pages}
        total={total}
        onPageChange={setPage}
        emptyTitle="No coupons yet"
        emptyMessage="Create your first discount code to get started."
      />

      <CouponForm
        key={editing?._id ?? 'new'} 
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        coupon={editing}
      />

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete coupon?"
        message="This coupon will no longer be redeemable by customers."
        confirmLabel="Delete coupon"
      />
    </div>
  );
}
