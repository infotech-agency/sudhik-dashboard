import { useState, type FormEvent } from 'react';
import { Modal } from '@/components/common/Modal';
import type { Blog } from '@/api/blogs';
import { useToast } from '@/context/ToastContext';
import { getApiError } from '@/api/client';

interface FormState {
  title: string;
  excerpt: string;
  content: string;
  author: string;
  tags: string; // comma-separated in the UI, converted to array on submit
  category: string;
  status: 'draft' | 'published';
  metaTitle: string;
  metaDescription: string;
}

const emptyForm: FormState = {
  title: '',
  excerpt: '',
  content: '',
  author: 'Admin',
  tags: '',
  category: '',
  status: 'draft',
  metaTitle: '',
  metaDescription: '',
};

const tagsFromText = (t: string) =>
  t
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

export function BlogForm({
  open,
  onClose,
  onSave,
  blog,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (data: Partial<Blog>, imageFile: File | null) => Promise<void>;
  blog?: Blog | null;
}) {
  const { toast } = useToast();
  const [form, setForm] = useState<FormState>(() =>
    blog
      ? {
          title: blog.title ?? '',
          excerpt: blog.excerpt ?? '',
          content: blog.content ?? '',
          author: blog.author ?? 'Admin',
          tags: (blog.tags ?? []).join(', '),
          category: blog.category ?? '',
          status: blog.status ?? 'draft',
          metaTitle: blog.metaTitle ?? '',
          metaDescription: blog.metaDescription ?? '',
        }
      : emptyForm
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(blog?.featuredImage?.url ?? null);
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: Partial<Blog> = {
        title: form.title,
        excerpt: form.excerpt || undefined,
        content: form.content,
        author: form.author || undefined,
        tags: tagsFromText(form.tags),
        category: form.category || undefined,
        status: form.status,
        metaTitle: form.metaTitle || undefined,
        metaDescription: form.metaDescription || undefined,
      };
      await onSave(payload, imageFile);
      onClose();
    } catch (err) {
      toast(getApiError(err, 'Failed to save blog post'), 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} size="xl" title={blog ? 'Edit Blog Post' : 'New Blog Post'}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="label-field">Title</label>
            <input
              required
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              className="input-field"
            />
          </div>

          <div className="md:col-span-2">
            <label className="label-field">Excerpt</label>
            <textarea
              value={form.excerpt}
              onChange={(e) => set('excerpt', e.target.value.slice(0, 300))}
              rows={2}
              maxLength={300}
              className="input-field"
              placeholder="Short summary shown in blog listings (max 300 characters)"
            />
            <p className="mt-1 text-xs text-maroon-400">{form.excerpt.length}/300</p>
          </div>

          <div className="md:col-span-2">
            <label className="label-field">Content</label>
            <textarea
              required
              value={form.content}
              onChange={(e) => set('content', e.target.value)}
              rows={10}
              className="input-field"
              placeholder="Full blog content"
            />
          </div>

          <div className="md:col-span-2">
            <label className="label-field">Featured Image</label>
            <div className="flex items-center gap-4">
              {preview && (
                <img
                  src={preview}
                  alt="Featured preview"
                  className="h-20 w-20 rounded-lg border border-maroon-100 object-cover"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="label-field">Author</label>
            <input
              value={form.author}
              onChange={(e) => set('author', e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label className="label-field">Category</label>
            <input
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
              className="input-field"
              placeholder="e.g. Guides"
            />
          </div>

          <div className="md:col-span-2">
            <label className="label-field">Tags (comma separated)</label>
            <input
              value={form.tags}
              onChange={(e) => set('tags', e.target.value)}
              className="input-field"
              placeholder="temple care, cleaning tips, sanatan"
            />
          </div>

          <div>
            <label className="label-field">Status</label>
            <select
              value={form.status}
              onChange={(e) => set('status', e.target.value as 'draft' | 'published')}
              className="input-field"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <div className="border-t border-maroon-100 pt-4">
          <p className="mb-3 text-sm font-medium text-maroon-800">SEO (optional)</p>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="label-field">Meta Title</label>
              <input
                value={form.metaTitle}
                onChange={(e) => set('metaTitle', e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="label-field">Meta Description</label>
              <textarea
                value={form.metaDescription}
                onChange={(e) => set('metaDescription', e.target.value.slice(0, 160))}
                rows={2}
                maxLength={160}
                className="input-field"
              />
              <p className="mt-1 text-xs text-maroon-400">{form.metaDescription.length}/160</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-maroon-100 pt-4">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Saving...' : blog ? 'Update Post' : 'Create Post'}
          </button>
        </div>
      </form>
    </Modal>
  );
}