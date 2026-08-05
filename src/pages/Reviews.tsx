import { useEffect, useMemo, useState } from 'react';
import { Search, Star, Package, Trash2 } from 'lucide-react';
import { reviewsApi, type Review } from '@/api/reviews';
import { productsApi, type Product } from '@/api/products';
import { useToast } from '@/context/ToastContext';
import { getApiError } from '@/api/client';
import { DataTable, type Column } from '@/components/common/DataTable';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { StarRating } from '@/components/reviews/StarRating';
import { formatDate } from '@/utils/format';

export function Reviews() {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [productFilter, setProductFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  console.log("Reviews", reviews);
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await reviewsApi.list();
      setReviews(data);
    } catch (err) {
      // Fallback: fetch per-product reviews if admin-all endpoint missing
      try {
        const prods = await productsApi.list({ limit: 50 });
        const arr = Array.isArray(prods) ? prods : (prods as { data: Product[] }).data;
        setProducts(arr);
        const all: Review[] = [];
        await Promise.all(
          arr.map(async (p) => {
            try {
              const r = await reviewsApi.byProduct(p._id);
              all.push(...r);
            } catch {
              /* ignore */
            }
          })
        );
        setReviews(all);
      } catch (e) {
        toast(getApiError(e, 'Failed to load reviews'), 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const filtered = useMemo(() => {
    let r = reviews;
    if (search) {
      const q = search.toLowerCase();
      r = r.filter((rev) => (rev.user?.name ?? rev.name ?? 'Guest').toLowerCase().includes(q));
    }
    if (productFilter) r = r.filter((rev) => rev.product?._id === productFilter);
    if (ratingFilter) r = r.filter((rev) => rev.rating === Number(ratingFilter));
    return r;
  }, [reviews, search, productFilter, ratingFilter]);

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await reviewsApi.remove(deleteId);
      toast('Review removed', 'success');
      setDeleteId(null);
      fetchReviews();
    } catch (err) {
      toast(getApiError(err, 'Failed to remove review'), 'error');
    } finally {
      setDeleting(false);
    }
  };

  const columns = useMemo<Column<Review>[]>(
    () => [
      {
        key: 'product',
        header: 'Product',
        render: (r) => (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-lg border border-maroon-100 bg-cream-50">
              {r.product?.images?.[0] ? (
                <img src={r.product.images[0]} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-maroon-300">
                  <Package className="h-4 w-4" />
                </div>
              )}
            </div>
            <p className="font-medium text-maroon-900">{r.product?.title ?? '-'}</p>
          </div>
        ),
      },
      {
        key: 'reviewer',
        header: 'Reviewer',
        render: (r) => <span>{r.user?.name ?? r.name ?? 'Guest'}</span>,
      },
      {
        key: 'rating',
        header: 'Rating',
        render: (r) => <StarRating rating={r.rating} />,
      },
      {
        key: 'comment',
        header: 'Comment',
        render: (r) => (
          <p className="max-w-md truncate text-sm text-maroon-600">{r.comment}</p>
        ),
      },
      {
        key: 'date',
        header: 'Date',
        render: (r) => <span className="text-xs text-maroon-500">{formatDate(r.createdAt)}</span>,
      },
      {
        key: 'actions',
        header: '',
        align: 'right',
        render: (r) => (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteId(r._id);
            }}
            className="rounded-lg p-2 text-red-500 hover:bg-red-50"
            aria-label="Delete review"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-maroon-900">Reviews</h1>
        <p className="mt-1 text-sm text-maroon-500">Moderate customer reviews</p>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-2">
        <div className="card flex items-center gap-4 p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-50 text-gold-600">
            <Star className="h-6 w-6 fill-gold-500" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-maroon-500">Average Rating</p>
            <p className="font-serif text-2xl font-semibold text-maroon-900">{avgRating} / 5</p>
          </div>
        </div>
        <div className="card flex items-center gap-4 p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-maroon-50 text-maroon-700">
            <Star className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-maroon-500">Total Reviews</p>
            <p className="font-serif text-2xl font-semibold text-maroon-900">{reviews.length}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card flex flex-wrap items-center gap-3 p-4">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-maroon-300" />
          <input
            placeholder="Search reviewer name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <select value={productFilter} onChange={(e) => setProductFilter(e.target.value)} className="input-field min-w-[180px]">
          <option value="">All Products</option>
          {products.map((p) => (
            <option key={p._id} value={p._id}>{p.title}</option>
          ))}
        </select>
        <select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)} className="input-field min-w-[140px]">
          <option value="">All Ratings</option>
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>{r} Stars</option>
          ))}
        </select>
      </div>

      <DataTable
        columns={columns}
        rows={filtered}
        loading={loading}
        emptyTitle="No reviews found"
        emptyMessage="No reviews match your filters."
      />

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete review?"
        message="This review will be permanently removed."
        confirmLabel="Delete review"
      />
    </div>
  );
}
