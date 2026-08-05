import { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Pencil, Trash2, Newspaper } from 'lucide-react';
import { blogsApi, type Blog } from '@/api/blogs';
import { useToast } from '@/context/ToastContext';
import { getApiError } from '@/api/client';
import { DataTable, type Column } from '@/components/common/DataTable';
import { Badge } from '@/components/common/Badge';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { BlogForm } from '@/components/blogs/BlogForm';

export function Blogs() {
  const { toast } = useToast();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [rows, setRows] = useState<Blog[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Blog | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await blogsApi.list({
        page,
        limit: 10,
        search: search || undefined,
        status: (statusFilter as 'draft' | 'published') || undefined,
      });
      setRows(res.data ?? []);
      setTotal(res.total ?? 0);
      setPages(res.pages ?? 1);
    } catch (err) {
      toast(getApiError(err, 'Failed to load blog posts'), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, statusFilter]);

  const handleSave = async (data: Partial<Blog>, imageFile: File | null) => {
    if (editing) {
      await blogsApi.update(editing._id, data, imageFile);
      toast('Blog post updated', 'success');
    } else {
      await blogsApi.create(data, imageFile);
      toast('Blog post created', 'success');
    }
    fetchBlogs();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await blogsApi.remove(deleteId);
      toast('Blog post deleted', 'success');
      setDeleteId(null);
      fetchBlogs();
    } catch (err) {
      toast(getApiError(err, 'Failed to delete blog post'), 'error');
    } finally {
      setDeleting(false);
    }
  };

  const columns = useMemo<Column<Blog>[]>(
    () => [
      {
        key: 'image',
        header: 'Image',
        render: (b) => (
          <div className="h-11 w-11 overflow-hidden rounded-lg border border-maroon-100 bg-cream-50">
            {b.featuredImage?.url ? (
              <img src={b.featuredImage.url} alt={b.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-maroon-300">
                <Newspaper className="h-4 w-4" />
              </div>
            )}
          </div>
        ),
      },
      {
        key: 'title',
        header: 'Title',
        render: (b) => (
          <div>
            <p className="font-medium text-maroon-900">{b.title}</p>
            <p className="text-xs text-maroon-400">{b.category || '—'}</p>
          </div>
        ),
      },
      {
        key: 'author',
        header: 'Author',
        render: (b) => <span className="text-sm text-maroon-700">{b.author || '—'}</span>,
      },
      {
        key: 'status',
        header: 'Status',
        render: (b) => (
          <Badge variant={b.status === 'published' ? 'success' : 'neutral'}>
            {b.status === 'published' ? 'Published' : 'Draft'}
          </Badge>
        ),
      },
      {
        key: 'views',
        header: 'Views',
        render: (b) => <span className="text-sm">{b.views ?? 0}</span>,
      },
      {
        key: 'createdAt',
        header: 'Created',
        render: (b) => (
          <span className="text-sm text-maroon-500">
            {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : '—'}
          </span>
        ),
      },
      {
        key: 'actions',
        header: 'Actions',
        align: 'right',
        render: (b) => (
          <div className="flex justify-end gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditing(b);
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
                setDeleteId(b._id);
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
          <h1 className="font-serif text-3xl font-semibold text-maroon-900">Blog Posts</h1>
          <p className="mt-1 text-sm text-maroon-500">Manage articles and guides</p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
          className="btn-primary"
        >
          <Plus className="h-4 w-4" /> New Post
        </button>
      </div>

      <div className="card flex flex-wrap items-center gap-3 p-4">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-maroon-300" />
          <input
            placeholder="Search posts..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className="input-field pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setPage(1);
            setStatusFilter(e.target.value);
          }}
          className="input-field min-w-[140px]"
        >
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
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
        emptyTitle="No blog posts found"
        emptyMessage="Try adjusting filters or write a new post."
      />

      <BlogForm
        key={editing?._id ?? 'new'} 
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        blog={editing}
      />

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        message="This blog post will be permanently removed."
      />
    </div>
  );
}