import axios from 'axios';
import { College, User, SavedCollege, PaginatedResponse, FilterMeta } from '@/types';

export interface CollegeQueryParams {
  search?: string;
  state?: string;
  type?: string;
  minFees?: number;
  maxFees?: number;
  course?: string;
  page?: number;
  limit?: number;
  sortBy?: 'rating' | 'nirfRank' | 'fees' | 'placement';
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

export const api = {
  colleges: {
    async getAll(params: CollegeQueryParams): Promise<PaginatedResponse<College>> {
      const { data } = await axiosInstance.get('/colleges', { params });
      return data.data;
    },

    async getById(id: string): Promise<College | null> {
      try {
        const { data } = await axiosInstance.get(`/colleges/${id}`);
        return data;
      } catch (e: any) {
        if (e.response?.status === 404) return null;
        throw e;
      }
    },

    async getCompare(ids: string[]): Promise<College[]> {
      if (!ids.length) return [];
      const { data } = await axiosInstance.get('/colleges/compare', {
        params: { ids: ids.join(',') }
      });
      return data;
    },

    async getFilterMeta(): Promise<FilterMeta> {
      const { data } = await axiosInstance.get('/colleges/filters/meta');
      return data;
    }
  },

  auth: {
    async login(email: string, password: string): Promise<{ token: string; user: User }> {
      const { data } = await axiosInstance.post('/auth/login', { email, password });
      return data; // { success, token, user }
    },

    async signup(name: string, email: string, password: string): Promise<{ token: string; user: User }> {
      const { data } = await axiosInstance.post('/auth/signup', { name, email, password });
      return data;
    },

    async me(token: string): Promise<User> {
      const { data } = await axiosInstance.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data.user;
    }
  },

  saved: {
    async getAll(_token?: string): Promise<SavedCollege[]> {
      const { data } = await axiosInstance.get('/saved');
      return data;
    },

    async save(_token: string | undefined, collegeId: string): Promise<SavedCollege> {
      const { data } = await axiosInstance.post('/saved', { collegeId });
      return data;
    },

    async remove(_token: string | undefined, collegeId: string): Promise<void> {
      await axiosInstance.delete(`/saved/${collegeId}`);
    }
  },
  ai: {
    recommend: async (token: string, data: { stream: string, budget: string, priority: string, state?: string }) => {
      const res = await fetch(`${API_URL}/ai/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to get recommendations');
      return res.json();
    }
  }
};
