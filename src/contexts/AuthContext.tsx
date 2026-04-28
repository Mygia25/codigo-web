// src/contexts/AuthContext.tsx
"use client";

import type { ReactNode } from 'react';
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import type { AuthChangeEvent, Session, User as SupabaseUser } from '@supabase/supabase-js';
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  id?: string; // Supabase user ID
  name?: string | null;
  email?: string | null;
  photoURL?: string | null;
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
  simulateLogin: () => void; // New function for simulation
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error getting initial session:", error);
          setUser(null);
          setSession(null);
          setIsLoading(false);
          return;
        }
        
        setSession(initialSession);
        if (initialSession?.user) {
          setUser({
            id: initialSession.user.id,
            email: initialSession.user.email,
            name: initialSession.user.user_metadata?.name || initialSession.user.email?.split('@')[0],
            photoURL: initialSession.user.user_metadata?.photo_url || initialSession.user.user_metadata?.avatar_url,
          });
        } else {
          setUser(null);
        }
      } catch (e) {
        console.error("Exception in getInitialSession:", e);
        setUser(null);
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, currentSession: Session | null) => {
        // Prevent real auth changes from overwriting simulated session
        if (user?.id === 'simulated-user-id' && session?.access_token === 'simulated-access-token' && event !== 'SIGNED_OUT') {
          return;
        }
        
        setSession(currentSession);
        if (currentSession?.user) {
          setUser({
            id: currentSession.user.id,
            email: currentSession.user.email,
            name: currentSession.user.user_metadata?.name || currentSession.user.email?.split('@')[0],
            photoURL: currentSession.user.user_metadata?.photo_url || currentSession.user.user_metadata?.avatar_url,
          });
           if (event === 'SIGNED_IN' && (pathname === '/auth/signin' || pathname === '/auth/signup')) {
            router.push('/dashboard');
          }
        } else {
          setUser(null);
          if (event === 'SIGNED_OUT' && !pathname.startsWith('/auth')) {
             router.push('/auth/signin');
          }
        }
        setIsLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [router, pathname, user?.id, session?.access_token]);

  const loginWithPassword = useCallback(async (credentials: { email_?: string; password_?: string }) => {
    if (!credentials.email_ || !credentials.password_) {
        throw new Error("Email y contraseña son requeridos.");
    }
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: credentials.email_,
      password: credentials.password_,
    });
    setIsLoading(false);
    if (error) {
      throw error;
    }
  }, []);
  
  const loginWithGoogle = useCallback(async () => {
    setIsLoading(true);
    const redirectTo = typeof window !== 'undefined' ? window.location.origin : '';
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectTo,
      },
    });
    if (error) {
      setIsLoading(false);
      toast({ variant: "destructive", title: "Error con Google Sign-In", description: error.message });
      throw error; 
    }
  }, [toast]);

  const signupWithPassword = useCallback(async (credentials: { email_?: string; password_?: string, name_?: string }) => {
    if (!credentials.email_ || !credentials.password_ || !credentials.name_) {
        throw new Error("Email, contraseña y nombre son requeridos para el registro.");
    }
    setIsLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email_,
      password: credentials.password_,
      options: {
        data: { 
          name: credentials.name_,
          photo_url: `https://placehold.co/100x100.png?text=${credentials.name_?.charAt(0).toUpperCase() || 'U'}`,
        },
      },
    });
    setIsLoading(false);
    if (error) {
      throw error;
    }
    if (data.user && data.user.identities && data.user.identities.length === 0) {
      toast({ title: "Registro Casi Completo", description: "Por favor, revisa tu correo para confirmar tu cuenta." });
    } else if (data.user) {
        toast({ title: "Registro Exitoso", description: "¡Bienvenido! Redirigiendo..."});
    }
  }, [toast]);

  const simulateLogin = useCallback(() => {
    console.log('[AuthContext] Simulating login...');
    const simulatedUserName = 'Usuario Simulado';
    setUser({
      id: 'simulated-user-id',
      name: simulatedUserName,
      email: 'simulado@ejemplo.com',
      photoURL: `https://placehold.co/100x100.png?text=${simulatedUserName.charAt(0).toUpperCase()}`,
    });
    setSession({
      access_token: 'simulated-access-token',
      refresh_token: 'simulated-refresh-token',
      user: { 
        id: 'simulated-user-id',
        app_metadata: {},
        user_metadata: { name: simulatedUserName, photo_url: `https://placehold.co/100x100.png?text=${simulatedUserName.charAt(0).toUpperCase()}` },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        // Cast to any to satisfy SupabaseUser if not all fields are needed for app functionality
      } as any as SupabaseUser,
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      token_type: 'bearer',
    });
    setIsLoading(false); 
    toast({
      title: "Modo Simulación Activado",
      description: "Has iniciado sesión como Usuario Simulado.",
    });
  }, [toast]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    if (user?.id === 'simulated-user-id' && session?.access_token === 'simulated-access-token') {
      setUser(null);
      setSession(null);
      setIsLoading(false);
      toast({ title: "Simulación Terminada", description: "Has cerrado la sesión simulada." });
      if (pathname !== '/auth/signin') {
          router.push('/auth/signin');
      }
      return;
    }

    const { error } = await supabase.auth.signOut();
    if (!error) {
        setUser(null); 
        setSession(null);
    }
    setIsLoading(false); 
    if (error) {
      toast({ variant: "destructive", title: "Error al Cerrar Sesión", description: error.message });
      throw error;
    }
    // onAuthStateChange should also handle redirect if user is not on auth page
     if (!pathname.startsWith('/auth')) {
        router.push('/auth/signin');
     }
  }, [user, session, toast, router, pathname]);
  
  const updateUserAccount = useCallback(async (updatedData: { name?: string; photoURL?: string, password?: string }) => {
    if (!session?.user) {
        toast({variant: "destructive", title: "Error", description: "Usuario no autenticado."});
        throw new Error("Usuario no autenticado.");
    }

    const updatePayload: { data?: { name?: string; photo_url?: string }; password?: string } = { data: {} };
    let changed = false;

    if (updatedData.name && updatedData.name !== user?.name) {
      updatePayload.data!.name = updatedData.name;
      changed = true;
    }
    if (updatedData.photoURL && updatedData.photoURL !== user?.photoURL) {
      updatePayload.data!.photo_url = updatedData.photoURL;
      changed = true;
    }
    if (updatedData.password) {
      updatePayload.password = updatedData.password;
      changed = true;
    }
    
    if (!changed && !updatedData.password) { 
        toast({ title: "Sin cambios", description: "No se detectaron cambios para guardar." });
        return;
    }

    setIsLoading(true);
    const { data: updatedUserResponse, error } = await supabase.auth.updateUser(updatePayload);
    setIsLoading(false);

    if (error) {
      toast({variant: "destructive", title: "Error al Actualizar", description: error.message});
      throw error;
    }
    if (updatedUserResponse.user) {
        setUser(prevUser => ({
            ...(prevUser ?? {}),
            id: updatedUserResponse.user!.id,
            email: updatedUserResponse.user!.email,
            name: updatedData.name || prevUser?.name,
            photoURL: updatedData.photoURL || prevUser?.photoURL,
        }));
        toast({ title: "Perfil Actualizado", description: "Tus cambios han sido guardados." });
    }
  }, [session, user, toast]);


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
      updateUserAccount,
      simulateLogin // Expose simulateLogin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
