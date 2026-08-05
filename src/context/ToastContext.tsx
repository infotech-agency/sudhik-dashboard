import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import { CheckCircle2, XCircle, Info, AlertTriangle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

let toastId = 0;

const config: Record<ToastType, { icon: typeof CheckCircle2; bg: string; ring: string }> = {
  success: { icon: CheckCircle2, bg: 'bg-green-50', ring: 'text-green-600' },
  error: { icon: XCircle, bg: 'bg-red-50', ring: 'text-red-600' },
  info: { icon: Info, bg: 'bg-maroon-50', ring: 'text-maroon-700' },
  warning: { icon: AlertTriangle, bg: 'bg-amber-50', ring: 'text-amber-600' },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = 'success') => {
    const id = ++toastId;
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3500);
  }, []);

  const remove = (id: number) => setToasts((t) => t.filter((x) => x.id !== id));

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
        {toasts.map((t) => {
          const { icon: Icon, bg, ring } = config[t.type];
          return (
            <div
              key={t.id}
              className={`flex items-center gap-3 rounded-xl border border-maroon-100 ${bg} px-4 py-3 shadow-card-hover animate-fade-in min-w-[260px] max-w-sm`}
            >
              <Icon className={`h-5 w-5 shrink-0 ${ring}`} />
              <p className="text-sm font-medium text-maroon-900 flex-1">{t.message}</p>
              <button
                onClick={() => remove(t.id)}
                className="text-maroon-300 hover:text-maroon-700 text-xs"
                aria-label="Dismiss"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
