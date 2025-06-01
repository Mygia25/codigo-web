// src/app/(app)/ruta-aprendizaje/page.tsx
"use client";

import React, { useState } from 'react';
import PageTitle from '@/components/PageTitle';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { generateAdaptiveLearningPath, type AdaptiveLearningPathInput } from '@/ai/flows/adaptive-learning-path';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useToast } from "@/hooks/use-toast";
import { Lightbulb, CheckSquare, BookOpen, Sparkles } from "lucide-react";

// Mock available courses data - in a real app, this would come from a DB or CMS
const MOCK_AVAILABLE_COURSES = `
- Curso A: Fundamentos de CÓDIGO (Ideal para principiantes, cubre Módulo 1 y 2)
- Curso B: Estrategias Avanzadas (Para usuarios con Módulo 1-3 completados, enfocado en Módulo 4 y 5)
- Curso C: Monetización Inteligente (Especializado en Módulo 5, requiere conocimiento previo de marketing digital)
- Curso D: Optimización y Escalado (Para Módulo 6, enfocado en crecimiento sostenible)
- Curso E: Tu Primer Producto Digital (Proyecto práctico basado en Módulo 1-4)
- Curso F: Marketing para Creadores (Complementario, útil para Módulo 5)
`;

export default function RutaAprendizajePage() {
  const [userProgress, setUserProgress] = useState('');
  const [userInterests, setUserInterests] = useState('');
  const [userNeeds, setUserNeeds] = useState('');
  const [learningPath, setLearningPath] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProgress || !userInterests || !userNeeds) {
      toast({
        variant: "destructive",
        title: "Campos incompletos",
        description: "Por favor, completa todos los campos para generar tu ruta.",
      });
      return;
    }

    setIsLoading(true);
    setLearningPath(null);

    try {
      const input: AdaptiveLearningPathInput = {
        userProgress,
        userInterests,
        userNeeds,
        availableCourses: MOCK_AVAILABLE_COURSES,
      };
      const result = await generateAdaptiveLearningPath(input);
      setLearningPath(result.learningPath);
    } catch (error) {
      console.error("Error generating learning path:", error);
      toast({
        variant: "destructive",
        title: "Error de IA",
        description: "No se pudo generar la ruta de aprendizaje. Inténtalo de nuevo.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageTitle 
        title="Ruta de Aprendizaje Adaptativa"
        description="Crea un itinerario personalizado basado en tu progreso, intereses y necesidades."
      />

      <Card className="shadow-lg">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Cuéntanos sobre ti</CardTitle>
            <CardDescription>Esta información ayudará a la IA a crear la mejor ruta para ti.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="userProgress" className="text-base flex items-center">
                <CheckSquare className="h-5 w-5 mr-2 text-primary" />
                Tu Progreso Actual
              </Label>
              <Textarea
                id="userProgress"
                placeholder="Ej: He completado el Módulo 1 y estoy familiarizado con los conceptos básicos de..."
                value={userProgress}
                onChange={(e) => setUserProgress(e.target.value)}
                rows={3}
                className="text-base"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userInterests" className="text-base flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-primary" />
                Tus Intereses
              </Label>
              <Textarea
                id="userInterests"
                placeholder="Ej: Estoy interesado en aplicar el método CÓDIGO para crear cursos online sobre desarrollo personal, marketing de afiliados..."
                value={userInterests}
                onChange={(e) => setUserInterests(e.target.value)}
                rows={3}
                className="text-base"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userNeeds" className="text-base flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-primary" />
                Tus Necesidades Específicas
              </Label>
              <Textarea
                id="userNeeds"
                placeholder="Ej: Necesito ayuda para definir mi nicho, estructurar mi primer producto digital, mejorar mis estrategias de venta..."
                value={userNeeds}
                onChange={(e) => setUserNeeds(e.target.value)}
                rows={3}
                className="text-base"
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-3 px-6">
              {isLoading ? <LoadingSpinner size="sm" /> : <><Sparkles className="h-5 w-5 mr-2" /> Generar Mi Ruta </>}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {isLoading && !learningPath && (
        <Card className="shadow-md">
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <LoadingSpinner text="Generando tu ruta personalizada..." size="lg" />
          </CardContent>
        </Card>
      )}

      {learningPath && (
        <Card className="shadow-lg bg-gradient-to-br from-primary/5 via-background to-primary/10">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary flex items-center">
              <Sparkles className="h-6 w-6 mr-2" />
              Tu Ruta de Aprendizaje Personalizada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-primary prose-strong:text-foreground/80">
              <p className="text-muted-foreground mb-4">Aquí tienes una sugerencia de cursos basada en tu información:</p>
              {/* Splitting by common list markers and rendering as a list */}
              <ul className="list-disc pl-5 space-y-2">
                {learningPath.split(/\n- |\n• |\* /).filter(item => item.trim() !== "" && !item.toLowerCase().includes("lista de cursos")).map((item, index) => (
                  <li key={index} className="text-base leading-relaxed">{item.trim()}</li>
                ))}
              </ul>
            </div>
          </CardContent>
           <CardFooter>
            <p className="text-xs text-muted-foreground">Recuerda que esta es una sugerencia. Siéntete libre de ajustarla según tus prioridades.</p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
