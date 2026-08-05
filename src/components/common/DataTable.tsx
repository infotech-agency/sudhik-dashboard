import type { ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { EmptyState } from './EmptyState';
import { TableSpinner } from './Spinner';

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
  align?: 'left' | 'right' | 'center';
}

export function DataTable<T extends { _id: string }>({
  columns,
  rows,
  loading,
  loadingRows = 6,
  emptyTitle = 'No records found',
  emptyMessage,
  emptyAction,
  onRowClick,
  page = 1,
  pages = 1,
  total,
  onPageChange,
  pageSize = 10,
}: {
  columns: Column<T>[];
  rows: T[];
  loading?: boolean;
  loadingRows?: number;
  emptyTitle?: string;
  emptyMessage?: string;
  emptyAction?: ReactNode;
  onRowClick?: (row: T) => void;
  page?: number;
  pages?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  pageSize?: number;
}) {
  const alignClass = (a?: 'left' | 'right' | 'center') =>
    a === 'right' ? 'text-right' : a === 'center' ? 'text-center' : 'text-left';

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-maroon-100 bg-cream-50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-maroon-600 ${alignClass(col.align)} ${col.className ?? ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-maroon-50">
            {loading ? (
              <tr>
                <td colSpan={columns.length}>
                  <TableSpinner rows={loadingRows} />
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <EmptyState title={emptyTitle} message={emptyMessage} action={emptyAction} />
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row._id}
                  onClick={() => onRowClick?.(row)}
                  className={`table-row-hover ${onRowClick ? 'cursor-pointer' : ''}`}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-5 py-4 text-sm text-maroon-800 ${alignClass(col.align)} ${col.className ?? ''}`}
                    >
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pages > 1 && onPageChange && (
        <div className="flex items-center justify-between border-t border-maroon-100 px-5 py-3.5">
          <p className="text-xs text-maroon-500">
            {total !== undefined
              ? `Showing ${(page - 1) * pageSize + 1}-${Math.min(page * pageSize, total)} of ${total}`
              : `Page ${page} of ${pages}`}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="btn-ghost px-2 py-1.5 disabled:opacity-40"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-3 text-sm font-medium text-maroon-700">
              {page} / {pages}
            </span>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= pages}
              className="btn-ghost px-2 py-1.5 disabled:opacity-40"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
