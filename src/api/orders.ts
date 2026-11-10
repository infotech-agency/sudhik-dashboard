import { api } from './client';

export interface OrderItem {
  product: { _id: string; title: string; images?: string[] };
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  name: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
}

export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Pending';
export type PaymentStatus = 'Paid' | 'Pending' | 'Failed' | 'Refunded';
export type PaymentMethod = 'COD' | 'Online' | 'PhonePe';

export interface Order {
  _id: string;
  orderNumber?: string;
  user?: { _id: string; name: string; email: string; phone?: string };
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  shippingAddress: ShippingAddress;
  phonepeTransactionId?: string;
  shiprocket?: {
    awbCode?: string;
    shipmentStatus?: string;
    trackingLink?: string;
  };
  createdAt: string;
}

export interface OrderQuery {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  paymentMethod?: PaymentMethod;
  from?: string;
  to?: string;
}

export interface OrderListResponse {
  data: Order[];
  total: number;
  page: number;
  pages: number;
}

export const ordersApi = {
  // list: async (query: OrderQuery = {}) =>
  //   (await api.get<Order[] | OrderListResponse>('/orders', { params: query })).data?.data,
  // list: async (query: OrderQuery = {}) =>
  // (await api.get<Order[] | OrderListResponse>('/orders', { params: query })).data,
  list: async (query: OrderQuery = {}) => {
  const body = (await api.get('/orders', { params: query })).data;
  return body?.data ?? body;
},
  get: async (id: string) => (await api.get<Order>(`/orders/${id}`)).data?.data,
  updateStatus: async (id: string, status: OrderStatus) =>
    (await api.put<Order>(`/orders/${id}/status`, { orderStatus: status })).data?.data,
  generateAwb: async (id: string) =>
    (await api.post<{ awbCode: string; shipmentStatus?: string }>(`/orders/${id}/awb`)).data?.data,
  track: async (id: string) =>
    (await api.get<{ awbCode?: string; shipmentStatus?: string; trackingLink?: string }>(
      `/orders/${id}/track`
    )).data?.data,
  cancel: async (id: string) => (await api.put<Order>(`/orders/${id}/cancel`)).data?.data,
};
