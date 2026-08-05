import { Inbox } from 'lucide-react';
import type { ReactNode } from 'react';

export function EmptyState({
  title = 'Nothing here yet',
  message,
  action,
  icon,
}: {
  title?: string;
  message?: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cream-100 text-maroon-300">
        {icon ?? <Inbox className="h-8 w-8" />}
      </div>
      <h3 className="text-lg font-semibold text-maroon-800">{title}</h3>
      {message && <p className="max-w-sm text-sm text-maroon-500">{message}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
