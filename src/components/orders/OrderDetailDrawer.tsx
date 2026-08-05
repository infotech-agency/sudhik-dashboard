import { useEffect, useState } from 'react';
import { X, Truck, Ban, Package, CreditCard, MapPin, ExternalLink } from 'lucide-react';
import { ordersApi, type Order, type OrderStatus } from '@/api/orders';
import { useToast } from '@/context/ToastContext';
import { getApiError } from '@/api/client';
import { Modal } from '@/components/common/Modal';
import { Badge } from '@/components/common/Badge';
import { OrderStatusBadge, PaymentStatusBadge } from './StatusBadge';
import { formatCurrency, formatDateTime } from '@/utils/format';

const STATUSES: OrderStatus[] = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

export function OrderDetailDrawer({
  orderId,
  onClose,
}: {
  orderId: string | null;
  onClose: () => void;
}) {
  const { toast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<OrderStatus>('Processing');
  const [updating, setUpdating] = useState(false);
  const [awbLoading, setAwbLoading] = useState(false);
  const [trackLoading, setTrackLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    if (!orderId) return;
    setLoading(true);
    ordersApi
      .get(orderId)
      .then((o) => setOrder(o))
      .catch((err) => toast(getApiError(err, 'Failed to load order'), 'error'))
      .finally(() => setLoading(false));
  }, [orderId, toast]);

  if (!orderId) return null;

  const updateStatus = async () => {
    setUpdating(true);
    try {
      const updated = await ordersApi.updateStatus(orderId, newStatus);
      setOrder(updated);
      toast('Order status updated', 'success');
      setStatusOpen(false);
    } catch (err) {
      toast(getApiError(err, 'Failed to update status'), 'error');
    } finally {
      setUpdating(false);
    }
  };

  const generateAwb = async () => {
    setAwbLoading(true);
    try {
      const res = await ordersApi.generateAwb(orderId);
      setOrder((o) => (o ? { ...o, shiprocket: { ...o.shiprocket, awbCode: res.awbCode, shipmentStatus: res.shipmentStatus } } : o));
      toast('AWB generated', 'success');
    } catch (err) {
      toast(getApiError(err, 'Failed to generate AWB'), 'error');
    } finally {
      setAwbLoading(false);
    }
  };

  const trackShipment = async () => {
    setTrackLoading(true);
    try {
      const res = await ordersApi.track(orderId);
      setOrder((o) => (o ? { ...o, shiprocket: { ...o.shiprocket, ...res } } : o));
      toast('Tracking refreshed', 'success');
    } catch (err) {
      toast(getApiError(err, 'Failed to track shipment'), 'error');
    } finally {
      setTrackLoading(false);
    }
  };

  const cancelOrder = async () => {
    setCancelLoading(true);
    try {
      const updated = await ordersApi.cancel(orderId);
      setOrder(updated);
      toast('Order cancelled', 'success');
    } catch (err) {
      toast(getApiError(err, 'Failed to cancel order'), 'error');
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 flex justify-end">
        <div className="absolute inset-0 bg-maroon-950/40 backdrop-blur-sm" onClick={onClose} />
        <div className="relative h-full w-full max-w-2xl overflow-y-auto bg-cream-100 shadow-card-hover animate-slide-in">
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-maroon-100 bg-cream-50 px-6 py-4">
            <div>
              <h2 className="font-serif text-xl font-semibold text-maroon-900">
                Order {order?.orderNumber ?? orderId}
              </h2>
              {order && <p className="text-xs text-maroon-500">{formatDateTime(order.createdAt)}</p>}
            </div>
            <button onClick={onClose} className="rounded-lg p-2 text-maroon-400 hover:bg-cream-100" aria-label="Close">
              <X className="h-5 w-5" />
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-maroon-300 border-t-maroon-700" />
            </div>
          ) : order ? (
            <div className="space-y-5 p-6">
              {/* Status row */}
              <div className="flex flex-wrap items-center gap-3">
                <OrderStatusBadge status={order.orderStatus} />
                <PaymentStatusBadge status={order.paymentStatus} />
                <Badge variant="gold">{order.paymentMethod}</Badge>
                <span className="ml-auto font-serif text-2xl font-semibold text-maroon-900">
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>

              {/* Shipping address */}
              <section className="card p-5">
                <div className="mb-3 flex items-center gap-2 text-maroon-700">
                  <MapPin className="h-4 w-4" />
                  <h3 className="text-sm font-semibold uppercase tracking-wider">Shipping Address</h3>
                </div>
                <div className="text-sm text-maroon-800">
                  <p className="font-medium">{order.shippingAddress.name}</p>
                  <p>{order.shippingAddress.addressLine}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                  </p>
                  <p>Phone: {order.shippingAddress.phone}</p>
                    <p>Landmark: {order?.shippingAddress.landmark}</p>
                </div>
              </section>

              {/* Items */}
              <section className="card p-5">
                <div className="mb-3 flex items-center gap-2 text-maroon-700">
                  <Package className="h-4 w-4" />
                  <h3 className="text-sm font-semibold uppercase tracking-wider">Items</h3>
                </div>
                <div className="space-y-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="h-12 w-12 overflow-hidden rounded-lg border border-maroon-100 bg-cream-50">
                        {item.product.images?.[0] && (
                          <img src={item.product.images[0]} alt="" className="h-full w-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-maroon-900">{item.product.title}</p>
                        <p className="text-xs text-maroon-400">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Payment info */}
              <section className="card p-5">
                <div className="mb-3 flex items-center gap-2 text-maroon-700">
                  <CreditCard className="h-4 w-4" />
                  <h3 className="text-sm font-semibold uppercase tracking-wider">Payment</h3>
                </div>
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <dt className="text-maroon-500">Method</dt>
                  <dd className="text-right font-medium">{order.paymentMethod}</dd>
                  <dt className="text-maroon-500">Status</dt>
                  <dd className="text-right"><PaymentStatusBadge status={order.paymentStatus} /></dd>
                  {order.phonepeTransactionId && (
                    <>
                      <dt className="text-maroon-500">PhonePe Txn ID</dt>
                      <dd className="text-right font-mono text-xs">{order.phonepeTransactionId}</dd>
                    </>
                  )}
                </dl>
              </section>

              {/* Shiprocket */}
              <section className="card p-5">
                <div className="mb-3 flex items-center gap-2 text-maroon-700">
                  <Truck className="h-4 w-4" />
                  <h3 className="text-sm font-semibold uppercase tracking-wider">Shiprocket</h3>
                </div>
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <dt className="text-maroon-500">AWB Code</dt>
                  <dd className="text-right font-mono text-xs">{order.shiprocket?.awbCode ?? '-'}</dd>
                  <dt className="text-maroon-500">Shipment Status</dt>
                  <dd className="text-right">{order.shiprocket?.shipmentStatus ?? '-'}</dd>
                  {order.shiprocket?.trackingLink && (
                    <>
                      <dt className="text-maroon-500">Tracking</dt>
                      <dd className="text-right">
                        <a href={order.shiprocket.trackingLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-gold-600 hover:underline">
                          Track <ExternalLink className="h-3 w-3" />
                        </a>
                      </dd>
                    </>
                  )}
                </dl>
              </section>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <button onClick={() => { setNewStatus(order.orderStatus); setStatusOpen(true); }} className="btn-secondary">
                  Update Status
                </button>
                <button onClick={generateAwb} disabled={awbLoading} className="btn-secondary">
                  {awbLoading ? 'Generating...' : 'Generate AWB'}
                </button>
                <button onClick={trackShipment} disabled={trackLoading} className="btn-secondary">
                  {trackLoading ? 'Tracking...' : 'Track Shipment'}
                </button>
                {order.orderStatus !== 'Cancelled' && (
                  <button onClick={cancelOrder} disabled={cancelLoading} className="btn-danger ml-auto">
                    <Ban className="h-4 w-4" /> {cancelLoading ? 'Cancelling...' : 'Cancel Order'}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <p className="py-20 text-center text-sm text-maroon-500">Order not found.</p>
          )}
        </div>
      </div>

      <Modal open={statusOpen} onClose={() => setStatusOpen(false)} title="Update Order Status" size="sm">
        <div className="space-y-4">
          <label className="label-field">New Status</label>
          <select value={newStatus} onChange={(e) => setNewStatus(e.target.value as OrderStatus)} className="input-field">
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <div className="flex justify-end gap-3">
            <button onClick={() => setStatusOpen(false)} className="btn-secondary">Cancel</button>
            <button onClick={updateStatus} disabled={updating} className="btn-primary">
              {updating ? 'Updating...' : 'Update'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
