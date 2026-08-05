import { api } from './client';

export interface DashboardSummary {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  lowStockCount: number;
  pendingOrders: number;
  orderStatusBreakdown?: Record<string, number>;
  paymentMethodSplit?: Record<string, number>;
}

export interface MonthlySalesPoint {
  month: string;
  revenue?: number;
  orders?: number;
  unitsSold?: number;
}

export interface UserSpendRow {
  _id: string;
  name: string;
  email?: string;
  totalSpend: number;
  orderCount?: number;
}

export interface AdminUserRow {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  isGuest?: boolean;
  totalOrders?: number;
  totalSpend?: number;
  createdAt: string;
}

export const dashboardApi = {
  summary: async () => (await api.get<DashboardSummary>('/dashboard/summary')).data?.data,
  monthlySales: async () => (await api.get<MonthlySalesPoint[]>('/dashboard/monthly-sales')).data?.data,
  userSpend: async () => (await api.get<UserSpendRow[]>('/dashboard/user-spend')).data?.data,
  users: async (params?: Record<string, unknown>) =>
    (await api.get<AdminUserRow[]>('/dashboard/users', { params })).data?.data,
};
