'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface UserSession {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  role: 'CUSTOMER' | 'ADMIN';
}

interface AuthContextType {
  user: UserSession | null;
  isLoading: boolean;
  login: (userData: UserSession) => void;
  logout: () => void;
  isCustomer: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('glowbeauty_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (userData: UserSession) => {
    setUser(userData);
    localStorage.setItem('glowbeauty_user', JSON.stringify(userData));
    if (userData.role === 'ADMIN') {
      localStorage.setItem('admin_logged_in', 'true');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('glowbeauty_user');
    localStorage.removeItem('admin_logged_in');
    document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    window.location.href = '/';
  };

  const isCustomer = user?.role === 'CUSTOMER';
  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isCustomer,
        isAdmin,
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
