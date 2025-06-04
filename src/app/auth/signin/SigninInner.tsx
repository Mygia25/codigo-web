// src/app/auth/signin/SigninInner.tsx
"use client";

import React, { useEffect, useState, FormEvent } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircleDollarSign, ExternalLink } from "lucide-react";
import Link from 'next/link';
import Logo from '@/components/Logo';
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from '@/components/LoadingSpinner';

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2 fill-current">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    <path d="M1 1h22v22H1z" fill="none"/>
  </svg>
);

// Componente principal que contiene la lógica y UI de la página de inicio de sesión
export default function SignInInner() {
  const { 
    loginWithPassword, 
    loginWithGoogle, 
    signupWithPassword, 
    isAuthenticated, 
    isLoading: authIsLoading,
    simulateLogin // Get simulateLogin from useAuth
  } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams(); 
  const { toast } = useToast();

  const [email, setEmail] = useState('test@example.com'); // Pre-fill for quicker simulation
  const [password, setPassword] = useState('password'); // Pre-fill for quicker simulation
  const [name, setName] = useState('Test User'); // For signup
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authIsLoading && isAuthenticated) {
      const redirectUrl = searchParams.get('redirect') || '/dashboard';
      router.replace(redirectUrl);
    }
  }, [isAuthenticated, authIsLoading, router, searchParams]);

  const handleEmailPasswordSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // --- SIMULATION ---
    simulateLogin(); 
    // setIsSubmitting(false); // useEffect will handle unmount or state change
    // --- END SIMULATION ---
    
    // Original logic (commented out for simulation):
    // try {
    //   await loginWithPassword({ email_: email, password_: password });
    // } catch (error: any) {
    //   toast({ variant: "destructive", title: "Error al Iniciar Sesión", description: error.message });
    //   setIsSubmitting(false); // Reset on error
    // }
  };
  
  const handleEmailPasswordSignUp = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await signupWithPassword({ email_: email, password_: password, name_: name });
      toast({ title: "Registro Exitoso", description: "Por favor, revisa tu correo para confirmar tu cuenta si es necesario." });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error en el Registro", description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    // --- SIMULATION ---
    simulateLogin();
    // setIsSubmitting(false); // useEffect will handle unmount or state change
    // --- END SIMULATION ---

    // Original logic (commented out for simulation):
    // try {
    //   await loginWithGoogle();
    // } catch (error: any) {
    //   toast({ variant: "destructive", title: "Error con Google Sign-In", description: error.message });
    //   setIsSubmitting(false); // Reset on error
    // }
  };

  if (authIsLoading || (!authIsLoading && isAuthenticated)) {
     return (
        <div className="flex h-screen items-center justify-center">
          <LoadingSpinner text="Verificando sesión y redirigiendo..." size="lg"/>
        </div>
     );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-6 w-fit">
            <Logo />
          </div>
          <CardTitle className="font-headline text-3xl">Bienvenido a CÓDIGO</CardTitle>
          <CardDescription className="text-md">
            Tu Start Inteligente para el éxito digital.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Iniciar Sesión</TabsTrigger>
              <TabsTrigger value="signup">Registrarse</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <form onSubmit={handleEmailPasswordSignIn} className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="email-signin-inner">Correo Electrónico</Label>
                  <Input 
                    id="email-signin-inner" 
                    type="email" 
                    placeholder="tu@email.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="password-signin-inner">Contraseña</Label>
                  <Input 
                    id="password-signin-inner" 
                    type="password" 
                    placeholder="Tu contraseña" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <Button type="submit" className="w-full text-lg py-6" disabled={isSubmitting}>
                  {isSubmitting ? <LoadingSpinner size="sm" /> : 'Iniciar Sesión (Simulado)'}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleEmailPasswordSignUp} className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="name-signup-inner">Nombre Completo</Label>
                  <Input 
                    id="name-signup-inner" 
                    type="text" 
                    placeholder="Tu Nombre Completo" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="email-signup-inner">Correo Electrónico</Label>
                  <Input 
                    id="email-signup-inner" 
                    type="email" 
                    placeholder="tu@email.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="password-signup-inner">Contraseña</Label>
                  <Input 
                    id="password-signup-inner" 
                    type="password" 
                    placeholder="Crea una contraseña segura" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1"
                    required
                    disabled={isSubmitting}
                  />
                   <p className="text-xs text-muted-foreground mt-1">Mínimo 6 caracteres.</p>
                </div>
                <Button type="submit" className="w-full text-lg py-6" disabled={isSubmitting}>
                  {isSubmitting ? <LoadingSpinner size="sm" /> : 'Crear Cuenta'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">O</span>
            </div>
          </div>

          <Button onClick={handleGoogleSignIn} variant="outline" className="w-full text-lg py-6 border-2 border-foreground/50 hover:border-primary" disabled={isSubmitting}>
            {isSubmitting ? <LoadingSpinner size="sm" text="Conectando..." /> : <><GoogleIcon /> Continuar con Google (Simulado)</>}
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">O</span>
            </div>
          </div>
          <Button asChild variant="default" className="w-full text-lg py-6 bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="https://buy.stripe.com/cNi8wRcnJdbH8Eh0qJgbm02" target="_blank" rel="noopener noreferrer">
              <CircleDollarSign className="mr-2 h-5 w-5" />
              Adquirir Acceso Completo
              <ExternalLink className="ml-2 h-4 w-4 opacity-70" />
            </Link>
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} CÓDIGO. Todos los derechos reservados.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

    
