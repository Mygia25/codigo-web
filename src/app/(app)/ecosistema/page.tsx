// src/app/(app)/ecosistema/page.tsx
"use client";

import PageTitle from '@/components/PageTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowRight, Globe, Users, MessageSquare, Video, ShoppingCart, Zap, Settings, ExternalLink, PlusCircle } from "lucide-react";
import React from 'react';

interface EcosystemComponent {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string; // Tailwind color class e.g., 'bg-blue-500'
  connections?: string[]; // IDs of components it connects to
}

const ecosystemComponents: EcosystemComponent[] = [
  { id: 'website', name: "Sitio Web Principal", description: "Tu centro de operaciones digital.", icon: Globe, color: "bg-accent" },
  { id: 'social', name: "Redes Sociales", description: "Plataformas de comunidad y alcance.", icon: Users, color: "bg-sky-500" },
  { id: 'email', name: "Email Marketing", description: "Comunicación directa y automatizada.", icon: MessageSquare, color: "bg-amber-500" },
  { id: 'courses', name: "Plataforma de Cursos", description: "Entrega de contenido y valor.", icon: Video, color: "bg-emerald-500" },
  { id: 'payments', name: "Pasarela de Pagos", description: "Monetización y transacciones.", icon: ShoppingCart, color: "bg-purple-500" },
  { id: 'automations', name: "Automatizaciones", description: "Flujos de trabajo eficientes.", icon: Zap, color: "bg-rose-500" },
];

// This is a conceptual representation. A real visual builder would be much more complex.
export default function EcosistemaPage() {
  return (
    <div className="space-y-8">
      <PageTitle 
        title="Constructor Visual de Ecosistemas"
        description="Representación gráfica de tu ecosistema digital y sus interconexiones."
      />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Tu Ecosistema Digital Actual</CardTitle>
          <CardDescription>Visualiza los componentes clave de tu presencia online y cómo se relacionan. (Versión conceptual)</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ecosystemComponents.map((component) => (
              <Card key={component.id} className="hover:shadow-xl transition-shadow duration-300 border-2 border-transparent hover:border-primary/50">
                <CardHeader className={`flex flex-row items-center space-x-4 p-4 rounded-t-lg ${component.color} text-white`}>
                  <component.icon className="h-8 w-8" />
                  <CardTitle className="text-xl font-semibold text-white">{component.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-3">{component.description}</p>
                  <Button variant="outline" size="sm" className="w-full group">
                    <Settings className="h-4 w-4 mr-2 group-hover:animate-spin" />
                    Configurar {component.name}
                    <ExternalLink className="h-3 w-3 ml-auto opacity-50 group-hover:opacity-100"/>
                  </Button>
                </CardContent>
              </Card>
            ))}
             <Card className="border-dashed border-2 border-muted-foreground/50 hover:border-primary/70 hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center min-h-[200px] text-center p-4">
                <PlusCircle className="h-12 w-12 text-muted-foreground/70 mb-3" />
                <h3 className="text-lg font-semibold text-foreground mb-1">Añadir Componente</h3>
                <p className="text-sm text-muted-foreground mb-3">Expande tu ecosistema con nuevas herramientas e integraciones.</p>
                <Button variant="default" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Nuevo Componente
                </Button>
            </Card>
          </div>
          
          <div className="mt-10 pt-6 border-t">
            <h3 className="text-xl font-semibold mb-4 text-center font-headline text-foreground">Flujo Conceptual del Ecosistema</h3>
            <div className="flex flex-col md:flex-row items-center justify-around space-y-4 md:space-y-0 md:space-x-4 p-4 bg-card rounded-lg shadow">
                <div className="text-center">
                    <Users className="h-10 w-10 mx-auto mb-1 text-sky-500" />
                    <p className="font-medium">Audiencia</p>
                    <p className="text-xs text-muted-foreground">(Redes, SEO)</p>
                </div>
                <ArrowRight className="h-8 w-8 text-muted-foreground hidden md:block" />
                 <div className="md:hidden h-8 w-8 text-muted-foreground rotate-90">↓</div>
                <div className="text-center">
                    <Globe className="h-10 w-10 mx-auto mb-1 text-accent" />
                     <p className="font-medium">Sitio Web</p>
                    <p className="text-xs text-muted-foreground">(Contenido, Lead Magnet)</p>
                </div>
                <ArrowRight className="h-8 w-8 text-muted-foreground hidden md:block" />
                 <div className="md:hidden h-8 w-8 text-muted-foreground rotate-90">↓</div>
                <div className="text-center">
                    <MessageSquare className="h-10 w-10 mx-auto mb-1 text-amber-500" />
                    <p className="font-medium">Email List</p>
                    <p className="text-xs text-muted-foreground">(Secuencias, Valor)</p>
                </div>
                <ArrowRight className="h-8 w-8 text-muted-foreground hidden md:block" />
                 <div className="md:hidden h-8 w-8 text-muted-foreground rotate-90">↓</div>
                <div className="text-center">
                    <Video className="h-10 w-10 mx-auto mb-1 text-emerald-500" />
                    <p className="font-medium">Cursos/Productos</p>
                    <p className="text-xs text-muted-foreground">(Ofertas)</p>
                </div>
                 <ArrowRight className="h-8 w-8 text-muted-foreground hidden md:block" />
                 <div className="md:hidden h-8 w-8 text-muted-foreground rotate-90">↓</div>
                <div className="text-center">
                    <ShoppingCart className="h-10 w-10 mx-auto mb-1 text-purple-500" />
                    <p className="font-medium">Ventas</p>
                    <p className="text-xs text-muted-foreground">(Pagos)</p>
                </div>
            </div>
          </div>

        </CardContent>
         <CardFooter>
            <p className="text-xs text-muted-foreground">Nota: Esta es una representación simplificada. Un ecosistema real puede tener más componentes y flujos complejos.</p>
         </CardFooter>
      </Card>
    </div>
  );
}
