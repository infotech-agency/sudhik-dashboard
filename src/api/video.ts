import { api } from './client';


export type VideoPlatform = 'youtube' | 'instagram';

export type Video = {
  _id: string;
  title: string;
  url: string;
  platform: VideoPlatform;
  isActive: boolean;
  createdAt: string;
};

export const videosApi = {
  list: (platform?: VideoPlatform) =>
    api
      .get<{ data: Video[] }>('/videos', { params: platform ? { platform } : {} })
      .then((res) => res.data.data),

  get: (id: string) =>
    api.get<{ data: Video }>(`/videos/${id}`).then((res) => res.data.data),

  create: (payload: { title: string; url: string }) =>
    api.post<{ data: Video }>('/videos', payload).then((res) => res.data.data),

  update: (id: string, payload: Partial<Pick<Video, 'title' | 'isActive'>>) =>
    api.put<{ data: Video }>(`/videos/${id}`, payload).then((res) => res.data.data),

  remove: (id: string) => api.delete(`/videos/${id}`),
};