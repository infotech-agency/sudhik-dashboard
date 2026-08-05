import { api } from './client';

export interface Category {
  _id: string;
  name: string;
  description?: string;
  productCount?: number;
  createdAt?: string;
}

// export const categoriesApi = {
//   list: async () => (await api.get<Category[]>('/products/categories')).data?.data,
//   create: async (category: Partial<Category>) =>
//     (await api.post<Category>('/products/categories', category)).data?.data,
//   update: async (id: string, category: Partial<Category>) =>
//     (await api.put<Category>(`/products/categories/${id}`, category)).data?.data,
//   remove: async (id: string) => (await api.delete(`/products/categories/${id}`)).data?.data,
// };

export const categoriesApi = {
  list: async () => (await api.get<Category[]>('/products/categories/all')).data?.data,
  create: async (category: Partial<Category>) =>
    (await api.post<Category>('/products/categories', category)).data?.data,
  update: async (id: string, category: Partial<Category>) =>
    (await api.put<Category>(`/products/categories/${id}`, category)).data?.data,
  remove: async (id: string) => (await api.delete(`/products/categories/${id}`)).data?.data,
};