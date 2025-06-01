// src/app/(app)/generar-curso/page.tsx
"use client";

import React, { useState } from 'react';
import PageTitle from '@/components/PageTitle';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { generatePersonalizedCourse, type PersonalizedCourseInput, type PersonalizedCourseOutput } from '@/ai/flows/personalized-course-generation';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useToast } from "@/hooks/use-toast";
import { Sparkles, FileSignature, Brain, BookHeart, Target } from "lucide-react";

export default function GenerarCursoPage() {
  const [skills, setSkills] = useState('');
  const [knowledge, setKnowledge] = useState('');
  const [passions, setPassions] = useState('');
  const [niche, setNiche] = useState('');
  const [generatedCourse, setGeneratedCourse] = useState<PersonalizedCourseOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skills || !knowledge || !passions || !niche) {
      toast({
        variant: "destructive",
        title: "Campos incompletos",
        description: "Por favor, completa todos los campos para generar tu curso.",
      });
      return;
    }

    setIsLoading(true);
    setGeneratedCourse(null);

    try {
      const input: PersonalizedCourseInput = { skills, knowledge, passions, niche };
      const result = await generatePersonalizedCourse(input);
      setGeneratedCourse(result);
    } catch (error) {
      console.error("Error generating course:", error);
      toast({
        variant: "destructive",
        title: "Error de IA",
        description: "No se pudo generar el curso. Inténtalo de nuevo.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageTitle 
        title="Generación Personalizada de Cursos con IA"
        description="Define tu 'código' único y la IA creará un curso adaptado a tu nicho, habilidades, conocimientos y pasiones."
      />

      <Card className="shadow-lg">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Define tu Curso Ideal</CardTitle>
            <CardDescription>Proporciona la siguiente información para que la IA diseñe tu curso.</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="skills" className="text-base flex items-center">
                <Brain className="h-5 w-5 mr-2 text-primary" />
                Tus Habilidades Actuales
              </Label>
              <Textarea id="skills" placeholder="Ej: Comunicación efectiva, diseño gráfico, programación en Python..." value={skills} onChange={(e) => setSkills(e.target.value)} rows={3} className="text-base" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="knowledge" className="text-base flex items-center">
                <FileSignature className="h-5 w-5 mr-2 text-primary" />
                Tus Conocimientos Existentes
              </Label>
              <Textarea id="knowledge" placeholder="Ej: Marketing digital, neurociencia, historia del arte, finanzas personales..." value={knowledge} onChange={(e) => setKnowledge(e.target.value)} rows={3} className="text-base" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passions" className="text-base flex items-center">
                <BookHeart className="h-5 w-5 mr-2 text-primary" />
                Tus Pasiones e Intereses
              </Label>
              <Textarea id="passions" placeholder="Ej: Ayudar a otros, la tecnología, el desarrollo sostenible, la escritura creativa..." value={passions} onChange={(e) => setPassions(e.target.value)} rows={3} className="text-base" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="niche" className="text-base flex items-center">
                <Target className="h-5 w-5 mr-2 text-primary" />
                Nicho Específico del Curso
              </Label>
              <Input id="niche" placeholder="Ej: Madres emprendedoras, profesionales de la salud, artistas digitales..." value={niche} onChange={(e) => setNiche(e.target.value)} className="text-base" required />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-3 px-6">
              {isLoading ? <LoadingSpinner size="sm" /> : <><Sparkles className="h-5 w-5 mr-2" />Generar Curso con IA</>}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {isLoading && !generatedCourse && (
        <Card className="shadow-md">
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <LoadingSpinner text="Creando tu curso personalizado..." size="lg" />
          </CardContent>
        </Card>
      )}

      {generatedCourse && (
        <Card className="shadow-lg bg-gradient-to-br from-primary/5 via-background to-primary/10">
          <CardHeader>
            <CardTitle className="font-headline text-3xl text-primary flex items-center">
              <Sparkles className="h-7 w-7 mr-3" />
              {generatedCourse.courseTitle}
            </CardTitle>
            <CardDescription className="text-lg">{generatedCourse.courseDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <h3 className="font-headline text-xl font-semibold mb-3 text-foreground/90">Contenido Detallado del Curso:</h3>
            <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-primary prose-strong:text-foreground/80 whitespace-pre-wrap p-4 bg-card/50 rounded-md border border-border">
              {generatedCourse.courseContent}
            </div>
          </CardContent>
          <CardFooter>
             <p className="text-xs text-muted-foreground">Este es un borrador generado por IA. Puedes refinarlo y adaptarlo a tu estilo.</p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
