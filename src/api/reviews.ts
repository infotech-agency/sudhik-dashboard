import { api } from './client';

export interface Review {
  _id: string;
  product: { _id: string; title: string; images?: string[] };
  user?: { _id: string; name: string } | null;
  name?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ReviewQuery {
  product?: string;
  rating?: number;
  search?: string;
}

export const reviewsApi = {
  // Admin-wide reviews endpoint. If backend lacks GET /reviews, add it
  // (same MVC pattern as Products) — see README "Backend additions".
  list: async (query: ReviewQuery = {}) =>
    (await api.get<Review[]>('/reviews', { params: query })).data?.data,
  byProduct: async (productId: string) =>
    (await api.get<Review[]>(`/reviews/product/${productId}`)).data?.data,
  remove: async (id: string) => (await api.delete(`/reviews/${id}`)).data?.data,
};
  