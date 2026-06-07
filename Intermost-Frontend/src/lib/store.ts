import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Auth Store
interface AuthState {
  isAuthenticated: boolean;
  user: {
    email: string;
    name: string;
    role: string;
  } | null;
  accessToken: string | null;
  refreshToken: string | null;
  setAuth: (tokens: { access: string; refresh: string }) => void;
  setUser: (user: { email: string; name: string; role: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null,
      setAuth: (tokens) =>
        set({
          isAuthenticated: true,
          accessToken: tokens.access,
          refreshToken: tokens.refresh,
        }),
      setUser: (user) => set({ user }),
      logout: () =>
        set({
          isAuthenticated: false,
          user: null,
          accessToken: null,
          refreshToken: null,
        }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

// UI Store
interface UIState {
  isSidebarOpen: boolean;
  isModalOpen: boolean;
  modalContent: React.ReactNode | null;
  toggleSidebar: () => void;
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: false,
  isModalOpen: false,
  modalContent: null,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  openModal: (content) => set({ isModalOpen: true, modalContent: content }),
  closeModal: () => set({ isModalOpen: false, modalContent: null }),
}));

// Inquiry Form Store
interface InquiryFormState {
  formData: {
    name: string;
    email: string;
    phone: string;
    countryCode: string;
    interestedCountry: string;
    neetScore: string;
    message: string;
  };
  updateFormData: (data: Partial<InquiryFormState['formData']>) => void;
  resetForm: () => void;
}

const initialFormData = {
  name: '',
  email: '',
  phone: '',
  countryCode: '+91',
  interestedCountry: '',
  neetScore: '',
  message: '',
};

export const useInquiryFormStore = create<InquiryFormState>((set) => ({
  formData: initialFormData,
  updateFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),
  resetForm: () => set({ formData: initialFormData }),
}));

// Countries Store (for caching)
interface Country {
  _id: string;
  name: string;
  slug: string;
  code: string;
  flag_url: string;
}

interface CountriesState {
  countries: Country[];
  isLoading: boolean;
  error: string | null;
  setCountries: (countries: Country[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useCountriesStore = create<CountriesState>((set) => ({
  countries: [],
  isLoading: false,
  error: null,
  setCountries: (countries) => set({ countries, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
}));
