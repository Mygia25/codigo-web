// src/contexts/AuthContext.tsx
"use client";

import type { ReactNode } from 'react';
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  user: { name?: string; email?: string; photoURL?: string } | null; // Basic user object
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_KEY = 'codigo_auth_token';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{ name?: string; email?: string; photoURL?: string } | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
      const token = localStorage.getItem(AUTH_KEY);
      if (token) {
        setIsAuthenticated(true);
        // In a real app, you'd fetch user details here or decode the token
        setUser({ name: 'Usuario Ejemplo', email: 'usuario@ejemplo.com', photoURL: 'https://placehold.co/100x100.png' });
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      // localStorage might not be available (e.g. SSR initial render before hydration)
      // or could throw an error in private browsing mode on some browsers
      console.warn("Could not access localStorage for auth state:", error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(() => {
    try {
      localStorage.setItem(AUTH_KEY, 'mock_google_token'); // Simulate token
      setIsAuthenticated(true);
      setUser({ name: 'Usuario Ejemplo', email: 'usuario@ejemplo.com', photoURL: 'https://placehold.co/100x100.png' });
      router.push('/dashboard');
    } catch (error) {
      console.error("Failed to set auth token in localStorage:", error);
      // Handle error, maybe show a toast
    }
  }, [router]);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(AUTH_KEY);
      setIsAuthenticated(false);
      setUser(null);
      router.push('/auth/signin');
    } catch (error) {
      console.error("Failed to remove auth token from localStorage:", error);
    }
  }, [router]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
