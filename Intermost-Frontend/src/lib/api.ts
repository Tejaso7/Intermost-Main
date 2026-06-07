import axios, { AxiosError, AxiosResponse } from 'axios';
import { storage } from './utils';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    if (typeof window !== 'undefined') {
      const token = storage.get<string>('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Handle 401 - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = storage.get<string>('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh/`, {
            refresh: refreshToken,
          });
          
          const { access } = response.data;
          storage.set('access_token', access);
          
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Clear tokens and redirect to login
        storage.remove('access_token');
        storage.remove('refresh_token');
        if (typeof window !== 'undefined') {
          window.location.href = '/admin/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;

// API Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  count?: number;
  next?: string;
  previous?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Country Types
export interface Country {
  _id: string;
  name: string;
  slug: string;
  code: string;
  flag_url: string;
  hero_video?: string;
  hero_image?: string;
  banner_image?: string;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  overview: {
    title: string;
    description: string;
    highlights: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
  pricing: {
    tuition_fee: string;
    hostel_fee: string;
    living_cost: string;
    total_course_fee: string;
    currency: string;
  };
  eligibility: {
    academic: string;
    minimum_marks: string;
    neet_required: boolean;
    age_requirement: string;
    other_requirements: string[];
  };
  course_details: {
    duration: string;
    medium: string;
    degree_awarded: string;
    recognition: string[];
  };
  features: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  advantages: string[];
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  gallery: Array<{
    url: string;
    caption?: string;
    type: 'image' | 'video';
  }>;
  meta: {
    display_order: number;
    is_active: boolean;
    is_featured: boolean;
    created_at: string;
    updated_at: string;
  };
}

// College Types
export interface College {
  _id: string;
  name: string;
  slug: string;
  country_id: string;
  country_name?: string;
  logo?: string;
  banner_image?: string;
  overview: {
    description: string;
    established?: number;
    type?: string;
    location?: string;
  };
  contact?: {
    website?: string;
    email?: string;
    phone?: string;
  };
  recognition: string[];
  fees?: {
    tuition_per_year?: string;
    hostel_per_year?: string;
    total_course_fee?: string;
  };
  eligibility?: {
    minimum_marks?: string;
    entrance_exam?: string;
    age_requirement?: string;
  };
  facilities: string[];
  rankings?: {
    world_rank?: number;
    country_rank?: number;
  };
  meta: {
    is_active: boolean;
    is_featured: boolean;
    display_order: number;
    created_at: string;
    updated_at: string;
  };
}

// Testimonial Types
export interface Testimonial {
  _id: string;
  name: string;
  title?: string;
  designation?: string;
  university: string;
  country: string;
  batch_year?: string;
  year?: number;
  rating: number;
  quote: string;
  content?: string;
  photo?: string;
  video_url?: string;
  additional_info?: string;
  is_featured?: boolean;
  is_active: boolean;
  display_order?: number;
  created_at: string;
}

// Blog Types
export interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image?: string;
  category: string;
  tags: string[];
  author: string;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  is_published: boolean;
  is_featured: boolean;
  views: number;
  created_at: string;
  updated_at: string;
}

// News Types
export interface News {
  _id: string;
  title: string;
  description: string;
  media_type: 'image' | 'video' | 'marquee';
  media_url?: string;
  media_urls?: string[];
  location?: string;
  date?: string;
  badge_text?: string;
  badge_color?: string;
  link?: string;
  is_active: boolean;
  is_featured?: boolean;
  display_order: number;
  created_at: string;
}

// Inquiry Types
export interface Inquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  country_code: string;
  interested_country?: string;
  neet_score?: number;
  message?: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'closed';
  notes: Array<{
    text: string;
    created_at: string;
    created_by?: string;
  }>;
  created_at: string;
  updated_at: string;
}

// Team Types
export interface TeamMember {
  _id: string;
  name: string;
  title?: string;
  designation: string;
  region: string;
  photo?: string;
  phone: string;
  email?: string;
  bio?: string;
  specialization?: string;
  social?: {
    linkedin?: string;
    twitter?: string;
  };
  is_active: boolean;
  display_order: number;
  created_at: string;
}

// Office Types
export interface Office {
  _id: string;
  name: string;
  company_name: string;
  address: string;
  city: string;
  state?: string;
  pincode?: string;
  country: string;
  phone: string;
  email: string;
  is_head_office: boolean;
  is_active: boolean;
  display_order: number;
}

// Site Settings Types
export interface SiteSettings {
  site_name: string;
  tagline: string;
  logo: string;
  contact: {
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
  };
  social: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    whatsapp?: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
  stats: {
    students_placed: number;
    partner_universities: number;
    years_experience: number;
    visa_success_rate: number;
  };
}

// Chat Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatResponse {
  session_id: string;
  message: string;
  timestamp: string;
}

export interface LeadData {
  name: string;
  email?: string;
  phone: string;
  preferred_country?: string;
  course_interest?: string;
  message?: string;
}

export interface LeadCaptureResponse {
  success: boolean;
  lead_id: string;
  message: string;
}

export interface AdminInsights {
  insights: {
    type: string;
    title: string;
    message: string;
    priority: string;
  }[];
  summary: {
    total_countries: number;
    total_colleges: number;
    total_inquiries: number;
    total_testimonials: number;
    total_blogs: number;
    total_news: number;
    total_team_members: number;
  };
  inquiry_stats: {
    pending: number;
    contacted: number;
    converted: number;
  };
}

// Chat API Functions
export const chatAPI = {
  // Student chat - send message
  sendStudentMessage: async (message: string, sessionId?: string): Promise<ChatResponse> => {
    const response = await api.post('/chat/student/', {
      message,
      session_id: sessionId,
    });
    return response.data;
  },

  // Student lead capture
  captureStudentLead: async (sessionId: string, leadData: LeadData): Promise<LeadCaptureResponse> => {
    const response = await api.post('/chat/student/lead/', {
      session_id: sessionId,
      lead_data: leadData,
    });
    return response.data;
  },

  // Admin chat - send message
  sendAdminMessage: async (message: string, sessionId?: string): Promise<ChatResponse> => {
    const response = await api.post('/chat/admin/', {
      message,
      session_id: sessionId,
    });
    return response.data;
  },

  // Get admin insights
  getAdminInsights: async (): Promise<AdminInsights> => {
    const response = await api.get('/chat/admin/insights/');
    return response.data;
  },
};

// RAG Document Types
export interface RAGDocument {
  _id: string;
  title: string;
  content_preview: string;
  category: string;
  chunk_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RAGDocumentDetail extends Omit<RAGDocument, 'content_preview'> {
  content: string;
  metadata: Record<string, any>;
}

export interface RAGDocumentStats {
  total_documents: number;
  active_documents: number;
  total_chunks: number;
  categories: string[];
}

export interface RAGDocumentListResponse {
  documents: RAGDocument[];
  stats: RAGDocumentStats;
}

// RAG Document API Functions
export const ragAPI = {
  // List all documents
  listDocuments: async (category?: string): Promise<RAGDocumentListResponse> => {
    const params = category ? { category } : {};
    const response = await api.get('/chat/documents/', { params });
    return response.data;
  },

  // Get single document
  getDocument: async (documentId: string): Promise<RAGDocumentDetail> => {
    const response = await api.get(`/chat/documents/${documentId}/`);
    return response.data;
  },

  // Add new document
  addDocument: async (data: {
    title: string;
    content: string;
    category?: string;
    metadata?: Record<string, any>;
  }): Promise<{ success: boolean; document_id: string; message: string }> => {
    const response = await api.post('/chat/documents/', data);
    return response.data;
  },

  // Toggle document active status
  toggleDocument: async (documentId: string, isActive: boolean): Promise<{ success: boolean; message: string }> => {
    const response = await api.patch(`/chat/documents/${documentId}/`, { is_active: isActive });
    return response.data;
  },

  // Delete document
  deleteDocument: async (documentId: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/chat/documents/${documentId}/`);
    return response.data;
  },

  // Get stats
  getStats: async (): Promise<RAGDocumentStats> => {
    const response = await api.get('/chat/documents/stats/');
    return response.data;
  },
};
