// src/contexts/AuthContext.tsx
"use client";

import type { ReactNode } from 'react';
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js';

interface UserProfile {
  id?: string; // Supabase user ID
  name?: string | null;
  email?: string | null;
  photoURL?: string | null;
  // Add any other custom profile fields you might store in user_metadata or a separate table
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserProfile | null;
  session: Session | null;
  loginWithPassword: (credentials: { email_?: string; password_?: string }) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signupWithPassword: (credentials: { email_?: string; password_?: string, name_?: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateUserAccount: (updatedData: { name?: string; photoURL?: string, password?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      setSession(initialSession);
      if (initialSession?.user) {
        setUser({
          id: initialSession.user.id,
          email: initialSession.user.email,
          name: initialSession.user.user_metadata?.name || initialSession.user.email?.split('@')[0],
          photoURL: initialSession.user.user_metadata?.photo_url,
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };

    getInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        setSession(session);
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
            photoURL: session.user.user_metadata?.photo_url,
          });
           if (event === 'SIGNED_IN' && (pathname === '/auth/signin' || pathname === '/auth/signup')) {
            router.push('/dashboard');
          }
        } else {
          setUser(null);
          if (event === 'SIGNED_OUT') {
             router.push('/auth/signin');
          }
        }
        setIsLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [router, pathname]);

  const loginWithPassword = useCallback(async (credentials: { email_?: string; password_?: string }) => {
    if (!credentials.email_ || !credentials.password_) {
        throw new Error("Email y contraseña son requeridos.");
    }
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: credentials.email_,
      password: credentials.password_,
    });
    if (error) {
      setIsLoading(false);
      throw error;
    }
    // Auth state change will handle setting user and redirecting
  }, []);
  
  const loginWithGoogle = useCallback(async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`, // Ensure you have an auth callback page or handle appropriately
      },
    });
    if (error) {
      setIsLoading(false);
      throw error;
    }
  }, []);

  const signupWithPassword = useCallback(async (credentials: { email_?: string; password_?: string, name_?: string }) => {
    if (!credentials.email_ || !credentials.password_ || !credentials.name_) {
        throw new Error("Email, contraseña y nombre son requeridos para el registro.");
    }
    setIsLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email_,
      password: credentials.password_,
      options: {
        data: { // This data is stored in user_metadata
          name: credentials.name_,
          photo_url: `https://placehold.co/100x100.png?text=${credentials.name_?.charAt(0).toUpperCase()}`, // Default placeholder
        },
      },
    });
    if (error) {
      setIsLoading(false);
      throw error;
    }
    if (data.user) {
      // Optionally handle new user (e.g. send welcome email, create profile in DB)
      // For now, onAuthStateChange will pick it up.
      // If email confirmation is required, user won't be fully signed in until confirmed.
    }
    // Auth state change will handle setting user and redirecting if auto-confirm is on
    // or user confirms email
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      setIsLoading(false);
      throw error;
    }
    // onAuthStateChange will handle setting user to null and redirecting
  }, []);
  
  const updateUserAccount = useCallback(async (updatedData: { name?: string; photoURL?: string, password?: string }) => {
    if (!session?.user) throw new Error("Usuario no autenticado.");

    const updatePayload: any = { data: {} };
    if (updatedData.name) updatePayload.data.name = updatedData.name;
    if (updatedData.photoURL) updatePayload.data.photo_url = updatedData.photoURL;
    if (updatedData.password) updatePayload.password = updatedData.password;


    setIsLoading(true);
    const { data, error } = await supabase.auth.updateUser(updatePayload);
    setIsLoading(false);

    if (error) {
      throw error;
    }
    if (data.user) {
        setUser({ // Update local user state immediately for responsiveness
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.name,
            photoURL: data.user.user_metadata?.photo_url,
        });
    }
  }, [session]);


  return (
    <AuthContext.Provider value={{ 
      isAuthenticated: !!session?.user, 
      isLoading, 
      user, 
      session,
      loginWithPassword, 
      loginWithGoogle,
      signupWithPassword,
      logout,
      updateUserAccount
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
