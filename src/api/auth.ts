import { api } from './client';

export interface AdminLoginPayload {
  email: string;
  password: string;
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role?: string;
}

export interface AuthResponse {
  token: string;
  admin?: AdminUser;
  user?: AdminUser;
}

export const authApi = {
  login: async (payload: AdminLoginPayload) => {
    const { data } = await api.post<AuthResponse>('/auth/admin/login', payload);
    return data?.data;
  },
  me: async () => {
    const { data } = await api.get<AdminUser>('/auth/me');
    return data?.data;
  },
};
