import type { ReactNode } from 'react';

type Variant = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'gold';

const styles: Record<Variant, string> = {
  success: 'bg-green-50 text-green-700 ring-green-200',
  warning: 'bg-amber-50 text-amber-700 ring-amber-200',
  error: 'bg-red-50 text-red-700 ring-red-200',
  info: 'bg-maroon-50 text-maroon-700 ring-maroon-200',
  neutral: 'bg-cream-100 text-maroon-700 ring-maroon-200',
  gold: 'bg-gold-50 text-gold-700 ring-gold-200',
};

export function Badge({
  children,
  variant = 'neutral',
  className = '',
}: {
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
