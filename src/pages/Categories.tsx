import { useEffect, useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, FolderTree } from 'lucide-react';
import { categoriesApi, type Category } from '@/api/categories';
import { useToast } from '@/context/ToastContext';
import { getApiError } from '@/api/client';
import { DataTable, type Column } from '@/components/common/DataTable';
import { Modal } from '@/components/common/Modal';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { formatDate } from '@/utils/format';

export function Categories() {
  const { toast } = useToast();
  const [rows, setRows] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const data = await categoriesApi.list();
      setRows(data);
      console.log("cat", data)
    } catch (err) {
      toast(getApiError(err, 'Failed to load categories'), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setName('');
    setDescription('');
    setFormOpen(true);
  };

  const openEdit = (c: Category) => {
    setEditing(c);
    setName(c.name);
    setDescription(c.description ?? '');
    setFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await categoriesApi.update(editing._id, { name, description });
        toast('Category updated', 'success');
      } else {
        await categoriesApi.create({ name, description });
        toast('Category created', 'success');
      }
      setFormOpen(false);
      fetch();
    } catch (err) {
      toast(getApiError(err, 'Failed to save category'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await categoriesApi.remove(deleteId);
      toast('Category deleted', 'success');
      setDeleteId(null);
      fetch();
    } catch (err) {
      toast(getApiError(err, 'Failed to delete category'), 'error');
    } finally {
      setDeleting(false);
    }
  };

  const columns = useMemo<Column<Category>[]>(
    () => [
      {
        key: 'name',
        header: 'Name',
        render: (c) => (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cream-100 text-maroon-600">
              <FolderTree className="h-4 w-4" />
            </div>
            <span className="font-medium text-maroon-900">{c.name}</span>
          </div>
        ),
      },
      {
        key: 'description',
        header: 'Description',
        render: (c) => (
          <p className="max-w-md truncate text-sm text-maroon-500">{c.description ?? '-'}</p>
        ),
      },
      {
        key: 'products',
        header: 'Products',
        align: 'center',
        render: (c) => <span>{c.productCount ?? '-'}</span>,
      },
      {
        key: 'created',
        header: 'Created',
        render: (c) => <span className="text-xs text-maroon-500">{formatDate(c.createdAt ?? '')}</span>,
      },
      {
        key: 'actions',
        header: 'Actions',
        align: 'right',
        render: (c) => (
          <div className="flex justify-end gap-2">
            <button onClick={() => openEdit(c)} className="rounded-lg p-2 text-maroon-600 hover:bg-cream-100" aria-label="Edit">
              <Pencil className="h-4 w-4" />
            </button>
            <button onClick={() => setDeleteId(c._id)} className="rounded-lg p-2 text-red-500 hover:bg-red-50" aria-label="Delete">
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
          <h1 className="font-serif text-3xl font-semibold text-maroon-900">Categories</h1>
          <p className="mt-1 text-sm text-maroon-500">Organize your product catalog</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        emptyTitle="No categories yet"
        emptyMessage="Create your first category to organize products."
      />

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing ? 'Edit Category' : 'New Category'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="label-field">Name</label>
            <input required value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="label-field">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="input-field" />
          </div>
          <div className="flex justify-end gap-3 border-t border-maroon-100 pt-4">
            <button type="button" onClick={() => setFormOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete category?"
        message="Products in this category may become uncategorized."
      />
    </div>
  );
}
