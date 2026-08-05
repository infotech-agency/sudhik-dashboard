import { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Pencil, Trash2, Package } from 'lucide-react';
import { productsApi, type Product, type ProductListResponse } from '@/api/products';
import { useApi } from '@/hooks/useApi';
import { useToast } from '@/context/ToastContext';
import { getApiError } from '@/api/client';
import { DataTable, type Column } from '@/components/common/DataTable';
import { Badge } from '@/components/common/Badge';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { ProductForm } from '@/components/products/ProductForm';
import { formatCurrency } from '@/utils/format';

export function Products() {
  const { toast } = useToast();
  const categories = useApi(() => productsApi.categories(), []);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [rows, setRows] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await productsApi.list({
        page,
        limit: 10,
        search: search || undefined,
        category: categoryFilter || undefined,
        status: (statusFilter as 'active' | 'inactive') || undefined,
      });
      console.log("res from prod page", res)
      if (Array.isArray(res)) {
        setRows(res);
        setTotal(res.length);
        setPages(1);
      } else {
        const r = res as ProductListResponse;
        setRows(r.data ?? []);
        setTotal(r.total ?? 0);
        setPages(r.pages ?? 1);
      }
    } catch (err) {
      toast(getApiError(err, 'Failed to load products'), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, categoryFilter, statusFilter]);

  const handleSave = async (data: Partial<Product>, files: File[]) => {
    if (editing) {
      await productsApi.update(editing._id, data, files);
      toast('Product updated', 'success');
    } else {
      await productsApi.create(data, files);
      toast('Product created', 'success');
    }
    fetchProducts();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await productsApi.remove(deleteId);
      toast('Product deleted', 'success');
      setDeleteId(null);
      fetchProducts();
    } catch (err) {
      toast(getApiError(err, 'Failed to delete product'), 'error');
    } finally {
      setDeleting(false);
    }
  };

  const columns = useMemo<Column<Product>[]>(
    () => [
      {
        key: 'image',
        header: 'Image',
        render: (p) => (
          <div className="h-11 w-11 overflow-hidden rounded-lg border border-maroon-100 bg-cream-50">
            {p.images?.[0] ? (
              <img src={p.images[0]} alt={p.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-maroon-300">
                <Package className="h-4 w-4" />
              </div>
            )}
          </div>
        ),
      },
      {
        key: 'title',
        header: 'Title',
        render: (p) => (
          <div>
            <p className="font-medium text-maroon-900">{p.title}</p>
            {/* <p className="text-xs text-maroon-400">{p.category}</p> */}
            <p className="text-xs text-maroon-400">{p.category?.name || '—'}</p>
          </div>
        ),
      },
      {
        key: 'price',
        header: 'Price',
        render: (p) => <span className="font-medium">{formatCurrency(p.price)}</span>,
      },
      {
        key: 'stock',
        header: 'Stock',
        render: (p) => (
          <span className={p.stock <= 5 ? 'font-semibold text-red-600' : ''}>{p.stock}</span>
        ),
      },
      {
        key: 'status',
        header: 'Status',
        render: (p) => (
          <Badge variant={p.status === 'active' ? 'success' : 'neutral'}>
            {p.status === 'active' ? 'Active' : 'Inactive'}
          </Badge>
        ),
      },
      {
        key: 'actions',
        header: 'Actions',
        align: 'right',
        render: (p) => (
          <div className="flex justify-end gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditing(p);
                setFormOpen(true);
              }}
              className="rounded-lg p-2 text-maroon-600 hover:bg-cream-100"
              aria-label="Edit"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDeleteId(p._id);
              }}
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
          <h1 className="font-serif text-3xl font-semibold text-maroon-900">Products</h1>
          <p className="mt-1 text-sm text-maroon-500">Manage your product catalog</p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
          className="btn-primary"
        >
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="card flex flex-wrap items-center gap-3 p-4">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-maroon-300" />
          <input
            placeholder="Search products..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className="input-field pl-10"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => {
            setPage(1);
            setCategoryFilter(e.target.value);
          }}
          className="input-field min-w-[160px]"
        >
          <option value="">All Categories</option>
          {(categories.data ?? []).map((c) => (
            // <option key={c} value={c}>{c}</option>
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => {
            setPage(1);
            setStatusFilter(e.target.value);
          }}
          className="input-field min-w-[140px]"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        page={page}
        pages={pages}
        total={total}
        onPageChange={setPage}
        emptyTitle="No products found"
        emptyMessage="Try adjusting filters or add a new product."
      />

      <ProductForm
          key={editing?._id ?? 'new'} 
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        product={editing}
        categories={categories.data ?? []}
      />

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        message="This product will be permanently removed from your catalog."
      />
    </div>
  );
}
