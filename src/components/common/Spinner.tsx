import { Loader2 } from 'lucide-react';

export function Spinner({ size = 24, className = '' }: { size?: number; className?: string }) {
  return <Loader2 className={`animate-spin text-maroon-600 ${className}`} style={{ width: size, height: size }} />;
}

export function FullPageSpinner({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <Spinner size={40} />
      <p className="text-sm font-medium text-maroon-600">{label}</p>
    </div>
  );
}

export function TableSpinner({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-3 p-6">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="h-10 w-10 shrink-0 animate-pulse rounded-lg bg-cream-200" />
          <div className="h-4 flex-1 animate-pulse rounded bg-cream-200" />
          <div className="h-4 w-24 animate-pulse rounded bg-cream-200" />
          <div className="h-6 w-20 animate-pulse rounded-full bg-cream-200" />
        </div>
      ))}
    </div>
  );
}
