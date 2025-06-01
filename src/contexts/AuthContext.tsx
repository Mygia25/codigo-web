// src/contexts/AuthContext.tsx
"use client";

import type { ReactNode } from 'react';
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface UserProfile {
  name?: string;
  email?: string;
  photoURL?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  user: UserProfile | null;
  updateUser: (newUserData: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_KEY = 'codigo_auth_token';
const USER_PROFILE_KEY = 'codigo_user_profile'; // Key to store user profile details

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const router = useRouter();

  useEffect(() => {
    try {
      const token = localStorage.getItem(AUTH_KEY);
      const storedUserProfile = localStorage.getItem(USER_PROFILE_KEY);

      if (token) {
        setIsAuthenticated(true);
        if (storedUserProfile) {
          setUser(JSON.parse(storedUserProfile));
        } else {
          // Fallback if profile not in localStorage but token exists
          setUser({ name: 'Usuario Ejemplo', email: 'usuario@ejemplo.com', photoURL: 'https://placehold.co/100x100.png' });
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.warn("Could not access localStorage for auth state:", error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(() => {
    try {
      const defaultUser: UserProfile = { name: 'Usuario Ejemplo', email: 'usuario@ejemplo.com', photoURL: 'https://placehold.co/100x100.png' };
      localStorage.setItem(AUTH_KEY, 'mock_google_token'); // Simulate token
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(defaultUser)); // Store profile
      setIsAuthenticated(true);
      setUser(defaultUser);
      router.push('/dashboard');
    } catch (error) {
      console.error("Failed to set auth token/profile in localStorage:", error);
    }
  }, [router]);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(AUTH_KEY);
      localStorage.removeItem(USER_PROFILE_KEY); // Remove profile on logout
      setIsAuthenticated(false);
      setUser(null);
      router.push('/auth/signin');
    } catch (error) {
      console.error("Failed to remove auth token/profile from localStorage:", error);
    }
  }, [router]);

  const updateUser = useCallback((newUserData: Partial<UserProfile>) => {
    setUser(prevUser => {
      const updatedUser = { ...prevUser, ...newUserData } as UserProfile; // Type assertion
      try {
        localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(updatedUser));
      } catch (error) {
        console.error("Failed to update user profile in localStorage:", error);
      }
      return updatedUser;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout, user, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
