import { createContext, useContext, useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { User } from "@shared/schema";

interface AuthUser {
  id: number;
  username: string;
  referralCode: string;
  depositWallet: string;
  withdrawalWallet: string;
  referralWallet: string;
  totalEarned?: string;
  totalReferrals?: number;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: {
    username: string;
    password: string;
    recoveryQuestion: string;
    recoveryAnswer: string;
    referredBy?: string;
  }) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  const isLoggedIn = !!user;

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('kirda_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('kirda_user');
      }
    }
    setIsLoading(false);
  }, []);

  const loginMutation = useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      const response = await apiRequest('POST', '/api/auth/login', { username, password });
      return response.json();
    },
    onSuccess: (data) => {
      setUser(data.user);
      localStorage.setItem('kirda_user', JSON.stringify(data.user));
      queryClient.invalidateQueries();
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: {
      username: string;
      password: string;
      recoveryQuestion: string;
      recoveryAnswer: string;
      referredBy?: string;
    }) => {
      const response = await apiRequest('POST', '/api/auth/register', userData);
      return response.json();
    },
    onSuccess: (data) => {
      setUser(data.user);
      localStorage.setItem('kirda_user', JSON.stringify(data.user));
      queryClient.invalidateQueries();
    },
  });

  const login = async (username: string, password: string) => {
    await loginMutation.mutateAsync({ username, password });
  };

  const register = async (userData: {
    username: string;
    password: string;
    recoveryQuestion: string;
    recoveryAnswer: string;
    referredBy?: string;
  }) => {
    await registerMutation.mutateAsync(userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('kirda_user');
    queryClient.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isLoading: isLoading || loginMutation.isPending || registerMutation.isPending,
        isLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
