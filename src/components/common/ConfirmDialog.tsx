import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  loading = false,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
}) {
  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
          <AlertTriangle className="h-7 w-7" />
        </div>
        <div>
          <h3 className="font-serif text-lg font-semibold text-maroon-900">{title}</h3>
          <p className="mt-1.5 text-sm text-maroon-500">{message}</p>
        </div>
        <div className="mt-2 flex w-full gap-3">
          <button onClick={onClose} className="btn-secondary flex-1" disabled={loading}>
            {cancelLabel}
          </button>
          <button onClick={onConfirm} className="btn-danger flex-1" disabled={loading}>
            {loading ? 'Please wait...' : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
