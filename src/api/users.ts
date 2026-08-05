import { api } from './client';
import type { AdminUserRow } from './dashboard';

export interface UserDetail extends AdminUserRow {
  orders?: {
    _id: string;
    orderNumber?: string;
    totalAmount: number;
    orderStatus: string;
    paymentStatus: string;
    createdAt: string;
  }[];
}

export const usersApi = {
  list: async (params?: Record<string, unknown>) =>
    (await api.get<AdminUserRow[]>('/dashboard/users', { params })).data,
  get: async (id: string) => (await api.get<UserDetail>(`/dashboard/users/${id}`)).data,
};
