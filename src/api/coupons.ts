// import { api } from './client';

// export interface Coupon {
//   _id: string;
//   code: string;
//   discountType: 'flat' | 'percentage';
//   value: number;
//   minOrderAmount?: number;
//   expiryDate?: string;
//   usageLimit?: number;
//   usedCount?: number;
//   active: boolean;
//   createdAt?: string;
// }

// export interface CouponQuery {
//   page?: number;
//   limit?: number;
//   search?: string;
//   active?: boolean;
// }

// export interface CouponListResponse {
//   data: Coupon[];
//   total: number;
//   page: number;
//   pages: number;
// }

// // NOTE: Coupons are a new feature. The backend needs a `Coupon` model +
// // CRUD controller/routes (same MVC pattern as Products), plus validation
// // logic in the Order creation flow to apply a coupon and recompute
// // totalAmount. See README "Backend additions".
// export const couponsApi = {
//   list: async (query: CouponQuery = {}) =>
//     (await api.get<Coupon[] | CouponListResponse>('/coupons', { params: query })).data,
//   get: async (id: string) => (await api.get<Coupon>(`/coupons/${id}`)).data,
//   create: async (coupon: Partial<Coupon>) => (await api.post<Coupon>('/coupons', coupon)).data,
//   update: async (id: string, coupon: Partial<Coupon>) =>
//     (await api.put<Coupon>(`/coupons/${id}`, coupon)).data,
//   remove: async (id: string) => (await api.delete(`/coupons/${id}`)).data,
// };
import { api } from './client';
// export interface Coupon {
//   _id: string;
//   code: string;
//   discountType: 'FLAT' | 'PERCENTAGE';
//   amount: number;
//   minOrderAmount?: number;
//   expiryDate?: string;
//   usageLimit?: number;
//   usedCount?: number;
//   isActive: boolean;
//   createdAt?: string;
// }
export interface Coupon {
  _id: string;
  code: string;
  discountType: 'FLAT' | 'PERCENTAGE';
  amount: number;
  minOrderAmount?: number;
  expiryDate?: string;
  usageLimit?: number;
  usedCount?: number;
  isActive: boolean;
  createdAt?: string;
}
export interface CouponQuery {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

export interface CouponListResponse {
  data: Coupon[];
  total: number;
  page: number;
  pages: number;
}

export const couponsApi = {
  list: async (query: CouponQuery = {}) =>
    (await api.get<Coupon[] | CouponListResponse>('/coupons', { params: query })).data?.data,
  get: async (id: string) => (await api.get<Coupon>(`/coupons/${id}`)).data?.data,
  create: async (coupon: Partial<Coupon>) => (await api.post<Coupon>('/coupons', coupon)).data?.data,
  update: async (id: string, coupon: Partial<Coupon>) =>
    (await api.put<Coupon>(`/coupons/${id}`, coupon)).data?.data,
  remove: async (id: string) => (await api.delete(`/coupons/${id}`)).data,
};