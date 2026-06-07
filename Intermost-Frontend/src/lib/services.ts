import api, {
  Country,
  College,
  Testimonial,
  Blog,
  News,
  Inquiry,
  TeamMember,
  Office,
  SiteSettings,
  PaginatedResponse,
} from './api';

// Countries API
export const countriesApi = {
  getAll: async (params?: { active?: boolean; featured?: boolean }) => {
    const response = await api.get<{ count: number; results: Country[] }>('/countries/', { params });
    return response.data.results || [];
  },

  getBySlug: async (slug: string) => {
    const response = await api.get<Country>(`/countries/slug/${slug}/`);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<Country>(`/countries/${id}/`);
    return response.data;
  },

  create: async (data: Partial<Country>) => {
    const response = await api.post<{ message: string; data: Country }>('/countries/', data);
    return response.data.data;
  },

  update: async (id: string, data: Partial<Country>) => {
    const response = await api.put<{ message: string; data: Country }>(`/countries/${id}/`, data);
    return response.data.data;
  },

  delete: async (id: string) => {
    await api.delete(`/countries/${id}/`);
  },
};

// Colleges API
export const collegesApi = {
  getAll: async (params?: { country?: string; featured?: boolean }) => {
    const response = await api.get<{ results: College[] }>('/colleges/', { params });
    return response.data.results || [];
  },

  getBySlug: async (slug: string) => {
    const response = await api.get<College>(`/colleges/${slug}/`);
    return response.data;
  },

  getByCountry: async (countrySlug: string) => {
    const response = await api.get<{ results: College[] }>(`/colleges/country/${countrySlug}/`);
    return response.data.results || [];
  },

  create: async (data: Partial<College>) => {
    const response = await api.post<College>('/colleges/', data);
    return response.data;
  },

  update: async (id: string, data: Partial<College>) => {
    const response = await api.put<College>(`/colleges/${id}/`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/colleges/${id}/`);
  },
};

// Testimonials API
export const testimonialsApi = {
  getAll: async (params?: { featured?: boolean; country?: string }) => {
    const response = await api.get<{ count: number; results: Testimonial[] }>('/testimonials/', { params });
    return response.data.results || [];
  },

  getById: async (id: string) => {
    const response = await api.get<Testimonial>(`/testimonials/${id}/`);
    return response.data;
  },

  create: async (data: Partial<Testimonial>) => {
    const response = await api.post<{ message: string; data: Testimonial }>('/testimonials/', data);
    return response.data.data;
  },

  update: async (id: string, data: Partial<Testimonial>) => {
    const response = await api.put<{ message: string; data: Testimonial }>(`/testimonials/${id}/`, data);
    return response.data.data;
  },

  delete: async (id: string) => {
    await api.delete(`/testimonials/${id}/`);
  },
};

// Blogs API
export const blogsApi = {
  getAll: async (params?: { category?: string; featured?: boolean; page?: number }) => {
    const response = await api.get<PaginatedResponse<Blog>>('/blogs/', { params });
    return response.data.results || [];
  },

  getBySlug: async (slug: string) => {
    const response = await api.get<Blog>(`/blogs/${slug}/`);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<Blog>(`/blogs/${id}/`);
    return response.data;
  },

  create: async (data: Partial<Blog>) => {
    const response = await api.post<{ message: string; data: Blog }>('/blogs/', data);
    return response.data.data;
  },

  update: async (id: string, data: Partial<Blog>) => {
    const response = await api.put<{ message: string; data: Blog }>(`/blogs/${id}/`, data);
    return response.data.data;
  },

  delete: async (id: string) => {
    await api.delete(`/blogs/${id}/`);
  },
};

// News API
export const newsApi = {
  getAll: async (params?: { active?: boolean; limit?: number }) => {
    const response = await api.get<{ count: number; results: News[] }>('/news/', { params });
    return response.data.results || [];
  },

  getById: async (id: string) => {
    const response = await api.get<News>(`/news/${id}/`);
    return response.data;
  },

  create: async (data: Partial<News>) => {
    const response = await api.post<{ message: string; data: News }>('/news/', data);
    return response.data.data;
  },

  update: async (id: string, data: Partial<News>) => {
    const response = await api.put<{ message: string; data: News }>(`/news/${id}/`, data);
    return response.data.data;
  },

  delete: async (id: string) => {
    await api.delete(`/news/${id}/`);
  },
};

// Inquiries API
export const inquiriesApi = {
  getAll: async (params?: { status?: string; page?: number }) => {
    const response = await api.get<PaginatedResponse<Inquiry>>('/inquiries/', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<Inquiry>(`/inquiries/${id}/`);
    return response.data;
  },

  create: async (data: Partial<Inquiry>) => {
    const response = await api.post<Inquiry>('/inquiries/', data);
    return response.data;
  },

  updateStatus: async (id: string, status: string) => {
    const response = await api.patch<Inquiry>(`/inquiries/${id}/status/`, { status });
    return response.data;
  },

  addNote: async (id: string, note: string) => {
    const response = await api.post<Inquiry>(`/inquiries/${id}/notes/`, { text: note });
    return response.data;
  },

  getStats: async () => {
    const response = await api.get<{
      total: number;
      new: number;
      contacted: number;
      qualified: number;
      converted: number;
    }>('/inquiries/stats/');
    return response.data;
  },
};

// Team API
export const teamApi = {
  getAll: async (params?: { region?: string }) => {
    const response = await api.get<{ count: number; results: TeamMember[] }>('/team/', { params });
    return response.data.results || [];
  },

  getById: async (id: string) => {
    const response = await api.get<TeamMember>(`/team/${id}/`);
    return response.data;
  },

  create: async (data: Partial<TeamMember>) => {
    const response = await api.post<{ message: string; data: TeamMember }>('/team/', data);
    return response.data.data;
  },

  update: async (id: string, data: Partial<TeamMember>) => {
    const response = await api.put<{ message: string; data: TeamMember }>(`/team/${id}/`, data);
    return response.data.data;
  },

  delete: async (id: string) => {
    await api.delete(`/team/${id}/`);
  },

  getOffices: async () => {
    const response = await api.get<{ count: number; results: Office[] }>('/team/offices/');
    return response.data.results || [];
  },
};

// Core API (Settings, Auth, etc.)
export const coreApi = {
  getSettings: async () => {
    const response = await api.get<SiteSettings>('/settings/');
    return response.data;
  },

  updateSettings: async (data: Partial<SiteSettings>) => {
    const response = await api.put<SiteSettings>('/settings/', data);
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post<{ access: string; refresh: string }>('/auth/login/', {
      email,
      password,
    });
    return response.data;
  },

  register: async (data: { email: string; password: string; name: string }) => {
    const response = await api.post<{ access: string; refresh: string }>('/auth/register/', data);
    return response.data;
  },

  refreshToken: async (refresh: string) => {
    const response = await api.post<{ access: string }>('/auth/refresh/', { refresh });
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile/');
    return response.data;
  },

  healthCheck: async () => {
    const response = await api.get('/health/');
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/stats/');
    return response.data;
  },
};

// Analytics API
export const analyticsApi = {
  trackPageview: async (data: { url: string; title: string; referrer: string; session_id: string }) => {
    const response = await api.post('/analytics/track/', data);
    return response.data;
  },

  getSummary: async () => {
    const response = await api.get('/analytics/summary/');
    return response.data;
  },

  getVisitorStats: async (days: number = 30) => {
    const response = await api.get(`/analytics/visitors/?days=${days}`);
    return response.data;
  },

  getPageviewStats: async (days: number = 30) => {
    const response = await api.get(`/analytics/pageviews/?days=${days}`);
    return response.data;
  },

  getLocationStats: async (days: number = 30) => {
    const response = await api.get(`/analytics/locations/?days=${days}`);
    return response.data;
  },

  getTopPages: async (days: number = 30, limit: number = 10) => {
    const response = await api.get(`/analytics/pages/?days=${days}&limit=${limit}`);
    return response.data;
  },

  getDeviceStats: async (days: number = 30) => {
    const response = await api.get(`/analytics/devices/?days=${days}`);
    return response.data;
  },

  getRealtimeVisitors: async () => {
    const response = await api.get('/analytics/realtime/');
    return response.data;
  },

  getTrends: async () => {
    const response = await api.get('/analytics/trends/');
    return response.data;
  },
};

// Uploads API
export interface UploadedFile {
  original_name: string;
  filename: string;
  url: string;
  size: number;
  category: string;
}

export const uploadsApi = {
  uploadFile: async (file: File, category: string = 'general') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    
    const response = await api.post<{ message: string; files: UploadedFile[] }>(
      '/uploads/',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  uploadFiles: async (files: File[], category: string = 'general') => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    formData.append('category', category);
    
    const response = await api.post<{ message: string; files: UploadedFile[] }>(
      '/uploads/',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  deleteFile: async (path: string) => {
    const response = await api.delete('/uploads/delete/', { data: { path } });
    return response.data;
  },

  listFiles: async (category: string = 'general') => {
    const response = await api.get<{ category: string; count: number; files: Array<{ filename: string; url: string; size: number; modified: string }> }>(
      '/uploads/list/',
      { params: { category } }
    );
    return response.data;
  },
};
