// src/app/(app)/checkout/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Lock, ArrowLeft, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '@/components/Logo';
import LoadingSpinner from '@/components/LoadingSpinner'; // Import LoadingSpinner

export default function CheckoutPage() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const router = useRouter();
  const [viewers, setViewers] = useState(12); // Start with a default static value

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/auth/signin?redirect=/checkout');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    // Set initial random value on client mount
    setViewers(Math.floor(Math.random() * (25 - 6 + 1)) + 6);

    const interval = setInterval(() => {
      setViewers(Math.floor(Math.random() * (25 - 6 + 1)) + 6);
    }, 15000); 
    return () => clearInterval(interval);
  }, []); // Empty dependency array ensures this runs once on mount and cleans up

  const handlePurchase = () => {
    alert(`Simulación de compra para ${user?.email || 'usuario'}. Serás redirigido al dashboard. En una app real, aquí se procesaría el pago y se daría acceso al curso.`);
    router.push('/dashboard'); 
  };

  if (authLoading || (!isAuthenticated && typeof window !== 'undefined')) { // Avoid SSR flicker when redirecting
    return (
      <div className="flex min-h-screen items-center justify-center landing-page-body">
        <LoadingSpinner text="Cargando y verificando autenticación..." size="lg" />
      </div>
    );
  }
  
  // If still not authenticated after loading and on client, AuthGuard or redirect should handle it.
  // This component assumes isAuthenticated will be true or redirect will happen.
  if (!isAuthenticated) {
      return null; // Or a specific message if preferred, but AuthContext should redirect
  }


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-landing-bg p-4 sm:p-6 lg:p-8 font-body antialiased">
      <div className="mb-8">
        <Link href="/landing">
          <Logo />
        </Link>
      </div>
      <Card className="w-full max-w-lg shadow-2xl bg-white text-landing-fg">
        <CardHeader className="text-center border-b border-gray-200 pb-4">
          <ShoppingCart className="mx-auto h-12 w-12 text-primary mb-2" />
          <CardTitle className="text-3xl font-bold">Finaliza Tu Compra</CardTitle>
          <CardDescription className="text-md text-landing-fg/80">
            Estás a un paso de transformar tu conocimiento con el MÉTODO CÓDIGO.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Resumen del Pedido:</h3>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Image src="https://placehold.co/80x80.png" alt="Método Código" width={60} height={60} className="rounded mr-3" data-ai-hint="course product icon"/>
                <div>
                  <p className="font-medium">MÉTODO CÓDIGO - Acceso Completo</p>
                  <p className="text-sm text-landing-fg/70">Oferta de Lanzamiento</p>
                </div>
              </div>
              <p className="text-xl font-bold text-primary">$XX.XX USD</p> 
            </div>
          </div>

          <div className="bg-accent/10 text-accent p-3 rounded-md text-sm flex items-center justify-center">
            <Users className="h-5 w-5 mr-2"/>
            <p>💬 <span className="font-bold">{viewers} personas</span> están viendo esta página ahora mismo.</p>
          </div>
          
          <div className="text-center text-landing-fg/70 py-6 border-2 border-dashed border-gray-300 rounded-lg">
            <Lock className="mx-auto h-8 w-8 text-gray-400 mb-2"/>
            <p className="font-semibold">Aquí iría el formulario de pago seguro.</p>
            <p className="text-xs">(Integración con Stripe/PayPal/etc.)</p>
          </div>

        </CardContent>
        <CardFooter className="flex flex-col gap-4 p-6 border-t border-gray-200">
          <Button 
            onClick={handlePurchase} 
            className="w-full text-lg py-3 bg-primary text-primary-foreground hover:bg-primary/80 rounded-md shadow-md"
          >
            <Lock className="mr-2 h-5 w-5" />
            COMPRAR AHORA Y ACCEDER AL MÉTODO
          </Button>
          <Link href="/landing" legacyBehavior>
            <a className="text-sm text-accent hover:underline flex items-center justify-center">
                <ArrowLeft className="mr-1 h-4 w-4"/> Volver a la página de información
            </a>
          </Link>
          <p className="text-xs text-landing-fg/60 text-center mt-2">
            Transacción segura. Al hacer clic en "Comprar ahora", aceptas nuestros Términos y Condiciones.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
