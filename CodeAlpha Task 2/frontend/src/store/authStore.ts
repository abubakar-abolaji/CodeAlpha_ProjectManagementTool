import { create } from 'zustand';
import { api, setAuthToken } from '../lib/api';
import type { ApiResponse, AuthResponse, User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('pm_token'),
  isLoading: true,
  isAuthenticated: false,
  initialize: async () => {
    const token = localStorage.getItem('pm_token');
    if (!token) {
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      return;
    }

    try {
      set({ token, isLoading: true });
      const { data } = await api.get<ApiResponse<User>>('/auth/me');
      set({ user: data.data, isAuthenticated: true, isLoading: false });
    } catch {
      setAuthToken(null);
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },
  login: async (email, password) => {
    const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/login', { email, password });
    const auth = data.data;
    setAuthToken(auth.token);
    set({ token: auth.token, user: auth.user, isAuthenticated: true, isLoading: false });
  },
  register: async (name, email, password) => {
    const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/register', { name, email, password });
    const auth = data.data;
    setAuthToken(auth.token);
    set({ token: auth.token, user: auth.user, isAuthenticated: true, isLoading: false });
  },
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore backend logout failures for local session cleanup.
    }
    setAuthToken(null);
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },
  fetchMe: async () => {
    const { data } = await api.get<ApiResponse<User>>('/auth/me');
    set({ user: data.data, isAuthenticated: true });
  },
}));
