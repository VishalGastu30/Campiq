'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('campiq_token');
    if (storedToken) {
      setToken(storedToken);
      api.auth.me(storedToken)
        .then(usr => setUser(usr))
        .catch(() => {
          localStorage.removeItem('campiq_token');
          setToken(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      const res = await api.auth.login(email, pass);
      localStorage.setItem('campiq_token', res.token);
      setToken(res.token);
      setUser(res.user);
      toast.success('Logged in successfully');
    } catch (err: any) {
      throw new Error(err.message || 'Login failed');
    }
  };

  const signup = async (name: string, email: string, pass: string) => {
    try {
      const res = await api.auth.signup(name, email, pass);
      localStorage.setItem('campiq_token', res.token);
      setToken(res.token);
      setUser(res.user);
      toast.success('Account created successfully');
    } catch (err: any) {
      throw new Error(err.message || 'Signup failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('campiq_token');
    setToken(null);
    setUser(null);
    toast.success('Logged out');
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const useRequireAuth = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  return { user, isLoading };
};
