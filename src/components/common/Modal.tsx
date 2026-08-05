import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';

export function Modal({
  open,
  onClose,
  title,
  children,
  size = 'md',
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  footer?: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-maroon-950/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`relative w-full ${sizes[size]} max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-card-hover animate-scale-in`}
      >
        {title && (
          <div className="flex items-center justify-between border-b border-maroon-100 px-6 py-4">
            <h2 className="font-serif text-xl font-semibold text-maroon-800">{title}</h2>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-maroon-400 transition-colors hover:bg-cream-100 hover:text-maroon-700"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        <div className="max-h-[calc(90vh-8rem)] overflow-y-auto px-6 py-5">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-3 border-t border-maroon-100 bg-cream-50 px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
