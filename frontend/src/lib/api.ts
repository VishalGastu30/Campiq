import axios from 'axios';
import { College, User, SavedCollege, PaginatedResponse, FilterMeta } from '@/types';

export interface CollegeQueryParams {
  search?: string;
  state?: string;
  type?: string;
  stream?: string;
  course?: string;
  minFees?: number;
  maxFees?: number;
  page?: number;
  limit?: number;
  sort?: 'nirfRank' | 'fees' | 'placement' | 'name';
  order?: 'asc' | 'desc';
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('campiq_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear auth and redirect
      if (typeof window !== 'undefined') {
        localStorage.removeItem('campiq_token');
        localStorage.removeItem('campiq_user');
        window.dispatchEvent(new Event('auth:logout'));
      }
    }
    
    // Extract the user-friendly backend error message if it exists
    const backendError = error.response?.data?.error;
    if (backendError) {
      if (backendError.code === 'VALIDATION_ERROR' && backendError.details?.length > 0) {
        error.message = backendError.details[0].message;
      } else if (backendError.message) {
        error.message = backendError.message;
      }
    }
    
    return Promise.reject(error);
  }
);

export const api = {
  colleges: {
    async getAll(params: CollegeQueryParams): Promise<PaginatedResponse<College>> {
      const { data } = await axiosInstance.get('/colleges', { params });
      return {
        data: data.data.colleges,
        total: data.data.pagination.total,
        page: data.data.pagination.page,
        totalPages: data.data.pagination.totalPages,
        hasNext: data.data.pagination.hasNext,
        hasPrev: data.data.pagination.hasPrev
      };
    },

    async getById(idOrSlug: string): Promise<College | null> {
      try {
        const { data } = await axiosInstance.get(`/colleges/${idOrSlug}`);
        return data.data;
      } catch (e: any) {
        if (e.response?.status === 404) return null;
        throw e;
      }
    },

    async getCompare(ids: string[]): Promise<College[]> {
      if (!ids.length) return [];
      const { data } = await axiosInstance.get('/compare', {
        params: { ids: ids.join(',') }
      });
      return data.data;
    },

    async getFilterMeta(): Promise<FilterMeta> {
      const { data } = await axiosInstance.get('/colleges/meta/filters');
      return data.data;
    }
  },

  auth: {
    async login(email: string, password: string): Promise<{ token: string; user: User }> {
      const { data } = await axiosInstance.post('/auth/login', { email, password });
      return data.data; 
    },

    async signup(name: string, email: string, password: string): Promise<{ token: string; user: User }> {
      const { data } = await axiosInstance.post('/auth/signup', { name, email, password });
      return data.data;
    },

    async me(token: string): Promise<User> {
      const { data } = await axiosInstance.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data.data;
    }
  },

  saved: {
    async getAll(_token?: string): Promise<SavedCollege[]> {
      const { data } = await axiosInstance.get('/saved');
      return data.data;
    },

    async save(_token: string | undefined, collegeId: string): Promise<SavedCollege> {
      const { data } = await axiosInstance.post('/saved', { collegeId });
      return data.data;
    },

    async remove(_token: string | undefined, collegeId: string): Promise<void> {
      await axiosInstance.delete(`/saved/${collegeId}`);
    }
  },
  ai: {
    async recommend(_token: string, payload: { stream: string, budget: number, priority: string[], state?: string }) {
      const { data } = await axiosInstance.post('/ai/recommend', payload);
      return data.data;
    }
  }
};
