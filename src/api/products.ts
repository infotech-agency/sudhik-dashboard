import { api } from './client';

// export interface Product {
//   _id: string;
//   title: string;
//   description?: string;
//   price: number;
//   stock: number;
//   category: string;
//   images?: string[];
//   status?: 'active' | 'inactive';
//   benefits?: string[];
//   ingredients?: string[];
//   howToUse?: string[];
//   specifications?: Record<string, string>;
//   shippingInfo?: string;
//   productInfo?: string;
//   faqs?: { question: string; answer: string }[];
//   createdAt?: string;
// }
export interface Variant {
  label: string;
  price: number;
  discountPrice?: number;
  stock: number;
  sku?: string;
}
export interface Product {
  _id: string;
  title: string;
  description?: string;
  price: number;
  stock: number;
  category: { _id: string; name: string; slug?: string } | string;
  images?: string[];
  isActive?: boolean;
  benefits?: string;
  ingredients?: string;
  howToUse?: string;
  specifications?: string;
  shippingInfo?: string;
  productInformation?: string;
  faqs?: { question: string; answer: string }[];
    variants?: Variant[];   // 👈 add
  createdAt?: string;
}
export interface ProductListResponse {
  data: Product[];
  total: number;
  page: number;
  pages: number;
}

export interface ProductQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: 'active' | 'inactive';
}

const toFormData = (product: Partial<Product>, imageFiles?: File[]) => {
  const formData = new FormData();
  Object.entries(product).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (Array.isArray(value)) {
      formData.append(key, JSON.stringify(value));
    } else if (typeof value === 'object') {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, String(value));
    }
  });
  imageFiles?.forEach((file) => formData.append('images', file));
  return formData;
};

export const productsApi = {
  list: async (query: ProductQuery = {}) =>
    (await api.get<Product[] | ProductListResponse>('/products', { params: query })).data?.data,
  get: async (id: string) => (await api.get<Product>(`/products/${id}`)).data?.data,
  create: async (product: Partial<Product>, imageFiles?: File[]) =>
    (await api.post<Product>('/products', toFormData(product, imageFiles), {
      headers: { 'Content-Type': 'multipart/form-data' },
    })).data?.data,
  update: async (id: string, product: Partial<Product>, imageFiles?: File[]) =>
    (await api.put<Product>(`/products/${id}`, toFormData(product, imageFiles), {
      headers: { 'Content-Type': 'multipart/form-data' },
    })).data?.data,
  remove: async (id: string) => (await api.delete(`/products/${id}`)).data,
  categories: async () => (await api.get<string[]>('/products/categories/all')).data?.data,
};
