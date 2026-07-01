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
  getAll: async (params?: { is_active?: boolean | 'all'; featured?: boolean; active?: boolean }) => {
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
  getAll: async (params?: { country?: string; featured?: boolean; is_active?: boolean | 'all' }) => {
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
  getAll: async (params?: { category?: string; featured?: boolean; page?: number; published?: string | boolean }) => {
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
  getAll: async (params?: { is_active?: string | boolean; limit?: number }) => {
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

  importLeads: async (leads: Array<Partial<Inquiry>>) => {
    const response = await api.post<{ message: string; imported: number; skipped: number }>(
      '/inquiries/import/',
      { leads }
    );
    return response.data;
  },

  sendCampaign: async (payload: { recipient_ids: string[]; subject: string; body: string }) => {
    const response = await api.post<{ message: string; sent: number; failed: number; failed_emails: string[] }>(
      '/inquiries/campaign/',
      payload
    );
    return response.data;
  },

  sendSubscriptionOtp: async (email: string, phone: string) => {
    const response = await api.post<{ message: string }>(
      '/inquiries/subscribe/otp/send/',
      { email, phone }
    );
    return response.data;
  },

  verifySubscriptionOtp: async (payload: {
    name: string;
    email: string;
    phone: string;
    country_code?: string;
    otp: string;
  }) => {
    const response = await api.post<{ message: string }>(
      '/inquiries/subscribe/otp/verify/',
      payload
    );
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

  getOfficeById: async (id: string) => {
    const response = await api.get<Office>(`/team/offices/${id}/`);
    return response.data;
  },

  createOffice: async (data: Partial<Office>) => {
    const response = await api.post<{ message: string; data: Office }>('/team/offices/', data);
    return response.data.data;
  },

  updateOffice: async (id: string, data: Partial<Office>) => {
    const response = await api.put<{ message: string; data: Office }>(`/team/offices/${id}/`, data);
    return response.data.data;
  },

  deleteOffice: async (id: string) => {
    await api.delete(`/team/offices/${id}/`);
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

  getEnv: async () => {
    const response = await api.get<{ content: string }>('/settings/env/');
    return response.data;
  },

  updateEnv: async (content: string) => {
    const response = await api.post<{ message: string }>('/settings/env/', { content });
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

// Messages & WhatsApp API
export interface WhatsAppContact {
  _id?: string;
  id?: string;
  name: string;
  phone: string;
  created_at?: string;
}

export const messagesApi = {
  getContacts: async (page: number = 1, search?: string) => {
    const params: any = { page };
    if (search) params.search = search;
    const response = await api.get<{ count: number; page: number; total_pages: number; limit: number; results: WhatsAppContact[] }>('/whatsapp/contacts/', { params });
    return response.data;
  },

  importContacts: async (contacts: Array<{ name: string; phone: string }>) => {
    const response = await api.post<{ message: string; imported: number }>('/whatsapp/contacts/import/', { contacts });
    return response.data;
  },

  sendMessage: async (contactIds: string[], message: string, selectAll: boolean = false, search: string = '') => {
    const response = await api.post<{ message: string; status: string; sent_count: number }>('/whatsapp/send/', { 
      contact_ids: contactIds, 
      message,
      select_all: selectAll,
      search
    });
    return response.data;
  },

  getConfig: async () => {
    const response = await api.get<{
      gateway?: string;
      meta_phone_number_id?: string;
      meta_access_token?: string;
      twilio_account_sid?: string;
      twilio_auth_token?: string;
      twilio_sender_phone?: string;
      custom_endpoint?: string;
      custom_token?: string;
    }>('/whatsapp/config/');
    return response.data;
  },

  saveConfig: async (config: {
    gateway: string;
    meta_phone_number_id?: string;
    meta_access_token?: string;
    twilio_account_sid?: string;
    twilio_auth_token?: string;
    twilio_sender_phone?: string;
    custom_endpoint?: string;
    custom_token?: string;
  }) => {
    const response = await api.post<{ message: string }>('/whatsapp/config/', config);
    return response.data;
  },

  sendWhatsAppCampaign: async (inquiryIds: string[], message: string, selectAll: boolean = false) => {
    const response = await api.post<{ message: string; status: string; sent_count: number; failed_count: number; errors?: string[] }>('/whatsapp/campaign/', {
      inquiry_ids: inquiryIds,
      message,
      select_all: selectAll
    });
    return response.data;
  },
};

export interface YouTubeShort {
  _id?: string;
  title: string;
  url: string;
  is_active: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export const shortsApi = {
  getAll: async (params?: { is_active?: boolean | string }) => {
    const response = await api.get<YouTubeShort[]>('/shorts/', { params });
    return response.data || [];
  },

  getById: async (id: string) => {
    const response = await api.get<YouTubeShort>(`/shorts/${id}/`);
    return response.data;
  },

  create: async (data: Partial<YouTubeShort>) => {
    const response = await api.post<{ message: string; data: YouTubeShort }>('/shorts/', data);
    return response.data.data;
  },

  update: async (id: string, data: Partial<YouTubeShort>) => {
    const response = await api.put<{ message: string; data: YouTubeShort }>(`/shorts/${id}/`, data);
    return response.data.data;
  },

  delete: async (id: string) => {
    await api.delete(`/shorts/${id}/`);
  },
};

export interface LeadDripRecord {
  _id?: string;
  lead_id: string;
  name: string;
  phone: string;
  email: string;
  country: string;
  status: 'active' | 'paused' | 'completed';
  current_step: number;
  next_run: string;
  created_at: string;
  updated_at: string;
  logs: Array<{
    step: number;
    sent_at: string;
    whatsapp: boolean;
    email: boolean;
  }>;
}

export const dripsApi = {
  getAll: async (params?: { status?: string; search?: string; page?: number }) => {
    const response = await api.get<{
      count: number;
      page: number;
      total_pages: number;
      is_enabled: boolean;
      results: LeadDripRecord[];
    }>('/inquiries/drips/', { params });
    return response.data;
  },

  toggleGlobal: async (isEnabled: boolean) => {
    const response = await api.post<{ message: string }>('/inquiries/drips/', {
      action: 'toggle_global',
      is_enabled: isEnabled,
    });
    return response.data;
  },

  pauseDrip: async (dripId: string) => {
    const response = await api.post<{ message: string }>('/inquiries/drips/', {
      action: 'pause',
      drip_id: dripId,
    });
    return response.data;
  },

  resumeDrip: async (dripId: string) => {
    const response = await api.post<{ message: string }>('/inquiries/drips/', {
      action: 'resume',
      drip_id: dripId,
    });
    return response.data;
  },

  restartDrip: async (dripId: string) => {
    const response = await api.post<{ message: string }>('/inquiries/drips/', {
      action: 'restart',
      drip_id: dripId,
    });
    return response.data;
  },
};

export const studentService = {
  chat: async (message: string, sessionId: string) => {
    const response = await api.post<{ response: string; message?: string }>('/chat/student/', {
      message,
      session_id: sessionId,
    });
    return response.data;
  },

  submitLead: async (data: {
    phone: string;
    session_id: string;
    name?: string;
    email?: string;
    source?: string;
  }) => {
    const response = await api.post<{ message: string }>('/chat/student/lead/', data);
    return response.data;
  },
};

export interface Brochure {
  _id: string;
  title: string;
  file_url: string;
  country: string;
  type: string; // brochure, prospectus, template
  is_active: boolean;
  downloads_count: number;
  created_at: string;
  updated_at: string;
}

export const brochuresApi = {
  getAll: async (params?: { is_active?: string; country?: string }) => {
    const response = await api.get<Brochure[]>('/brochures/', { params });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<Brochure>(`/brochures/${id}/`);
    return response.data;
  },
  create: async (data: Partial<Brochure>) => {
    const response = await api.post<{ message: string; data: Brochure }>('/brochures/', data);
    return response.data;
  },
  update: async (id: string, data: Partial<Brochure>) => {
    const response = await api.put<{ message: string; data: Brochure }>(`/brochures/${id}/`, data);
    return response.data;
  },
  delete: async (id: string) => {
    await api.delete(`/brochures/${id}/`);
  },
  incrementDownload: async (id: string) => {
    const response = await api.post<{ message: string }>(`/brochures/${id}/download/`);
    return response.data;
  },
};

export interface Glimpse {
  _id?: string;
  title: string;
  category: 'campus' | 'hostel' | 'arrivals' | 'training';
  categoryLabel: string;
  image: string;
  caption: string;
  country: string;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export const glimpsesApi = {
  getAll: async () => {
    const response = await api.get<Glimpse[]>('/glimpses/');
    return response.data || [];
  },
  getById: async (id: string) => {
    const response = await api.get<Glimpse>(`/glimpses/${id}/`);
    return response.data;
  },
  create: async (data: Partial<Glimpse>) => {
    const response = await api.post<{ message: string; data: Glimpse }>('/glimpses/', data);
    return response.data.data;
  },
  update: async (id: string, data: Partial<Glimpse>) => {
    const response = await api.put<{ message: string; data: Glimpse }>(`/glimpses/${id}/`, data);
    return response.data.data;
  },
  delete: async (id: string) => {
    await api.delete(`/glimpses/${id}/`);
  },
};
