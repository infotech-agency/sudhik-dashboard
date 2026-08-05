import { useEffect, useState } from 'react';
import { Plus, Trash2, ExternalLink, Youtube, Instagram, Loader2 } from 'lucide-react';
// import { videosApi, type Video } from '@/api/videos';

import { useToast } from '@/context/ToastContext';
import { getApiError } from '@/api/client';
import { Modal } from '@/components/common/Modal';
import { Badge } from '@/components/common/Badge';
import { videosApi, type Video } from '@/api/video';

export function VideosManager() {
  const { toast } = useToast();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadVideos = () => {
    setLoading(true);
    videosApi
      .list()
      .then(setVideos)
      .catch((err) => toast(getApiError(err, 'Failed to load videos'), 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadVideos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setTitle('');
    setUrl('');
  };

  const handleAdd = async () => {
    if (!title.trim() || !url.trim()) {
      toast('Title and URL are required', 'error');
      return;
    }
    setSaving(true);
    try {
      const created = await videosApi.create({ title: title.trim(), url: url.trim() });
      setVideos((prev) => [created, ...prev]);
      toast('Video added', 'success');
      resetForm();
      setAddOpen(false);
    } catch (err) {
      toast(getApiError(err, 'Failed to add video — check the URL format'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await videosApi.remove(id);
      setVideos((prev) => prev.filter((v) => v._id !== id));
      toast('Video removed', 'success');
    } catch (err) {
      toast(getApiError(err, 'Failed to remove video'), 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const toggleActive = async (v: Video) => {
    try {
      const updated = await videosApi.update(v._id, { isActive: !v.isActive });
      setVideos((prev) => prev.map((x) => (x._id === v._id ? updated : x)));
    } catch (err) {
      toast(getApiError(err, 'Failed to update video'), 'error');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-xl font-semibold text-maroon-900">Shorts &amp; Reels</h2>
          <p className="text-sm text-maroon-500">YouTube Shorts aur Instagram Reels manage karein</p>
        </div>
        <button onClick={() => setAddOpen(true)} className="btn-primary">
          <Plus className="h-4 w-4" /> Add Video
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-maroon-400" />
        </div>
      ) : videos.length === 0 ? (
        <div className="card p-10 text-center text-sm text-maroon-500">
          Koi video add nahi hui hai abhi. "Add Video" par click karke shuru karein.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((v) => (
            <div key={v._id} className="card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant={v.platform === 'youtube' ? 'error' : 'info'}>
                  {v.platform === 'youtube' ? (
                    <span className="inline-flex items-center gap-1"><Youtube className="h-3.5 w-3.5" /> YouTube</span>
                  ) : (
                    <span className="inline-flex items-center gap-1"><Instagram className="h-3.5 w-3.5" /> Instagram</span>
                  )}
                </Badge>
                <Badge variant={v.isActive ? 'success' : 'neutral'}>
                  {v.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              <p className="text-sm font-medium text-maroon-900 line-clamp-2">{v.title}</p>

              <a
                href={v.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-gold-600 hover:underline break-all"
              >
                {v.url} <ExternalLink className="h-3 w-3 shrink-0" />
              </a>

              <div className="flex items-center justify-between pt-2 border-t border-maroon-100">
                <button
                  onClick={() => toggleActive(v)}
                  className="text-xs font-medium text-maroon-600 hover:underline"
                >
                  {v.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => handleDelete(v._id)}
                  disabled={deletingId === v._id}
                  className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:underline disabled:opacity-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  {deletingId === v._id ? 'Removing...' : 'Remove'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Video" size="sm">
        <div className="space-y-4">
          <div>
            <label className="label-field">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Product demo video"
              className="input-field"
            />
          </div>
          <div>
            <label className="label-field">Video URL</label>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="YouTube ya Instagram Reel link paste karein"
              className="input-field"
            />
            <p className="text-xs text-maroon-400 mt-1.5">
              YouTube: youtube.com/watch?v=... ya youtu.be/...<br />
              Instagram: instagram.com/reel/...
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setAddOpen(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleAdd} disabled={saving} className="btn-primary">
              {saving ? 'Adding...' : 'Add Video'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}