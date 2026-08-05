import { api } from './client';

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImage?: { url: string; publicId?: string } | null;
  author?: string;
  tags: string[];
  category?: string;
  status: 'draft' | 'published';
  metaTitle?: string;
  metaDescription?: string;
  views?: number;
  createdAt?: string;
}

export interface BlogListResponse {
  data: Blog[];
  total: number;
  page: number;
  pages: number;
}

export interface BlogQuery {
  page?: number;
  limit?: number;
  search?: string;
  tag?: string;
  category?: string;
  status?: 'draft' | 'published';
}

const toFormData = (blog: Partial<Blog>, imageFile?: File | null) => {
  const formData = new FormData();

  Object.entries(blog).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (key === 'featuredImage') return; // handled separately via file
    if (Array.isArray(value)) {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, String(value));
    }
  });

  if (imageFile) {
    formData.append('featuredImage', imageFile);
  }

  return formData;
};

export const blogsApi = {
  list: async (query: BlogQuery = {}) =>
    (await api.get<BlogListResponse>('/blogs', { params: query })).data as unknown as BlogListResponse,

  getBySlug: async (slug: string) =>
    (await api.get<Blog>(`/blogs/slug/${slug}`)).data?.data,

  getById: async (id: string) =>
    (await api.get<Blog>(`/blogs/admin/${id}`)).data?.data,

  create: async (blog: Partial<Blog>, imageFile?: File | null) =>
    (
      await api.post<Blog>('/blogs', toFormData(blog, imageFile), {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    ).data?.data,

  update: async (id: string, blog: Partial<Blog>, imageFile?: File | null) =>
    (
      await api.put<Blog>(`/blogs/${id}`, toFormData(blog, imageFile), {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    ).data?.data,

  remove: async (id: string) => (await api.delete(`/blogs/${id}`)).data,
};