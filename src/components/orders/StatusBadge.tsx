import { Badge } from '@/components/common/Badge';
import type { OrderStatus, PaymentStatus } from '@/api/orders';

const orderVariant: Record<OrderStatus, 'success' | 'warning' | 'info' | 'error' | 'neutral'> = {
  Delivered: 'success',
  Processing: 'warning',
  Shipped: 'info',
  Cancelled: 'error',
  Pending: 'neutral',
};

const payVariant: Record<PaymentStatus, 'success' | 'warning' | 'error' | 'neutral'> = {
  Paid: 'success',
  Pending: 'warning',
  Failed: 'error',
  Refunded: 'neutral',
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <Badge variant={orderVariant[status] ?? 'neutral'}>{status}</Badge>;
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return <Badge variant={payVariant[status] ?? 'neutral'}>{status}</Badge>;
}
