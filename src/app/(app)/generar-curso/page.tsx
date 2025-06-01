
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
import { Sparkles, FileSignature, Brain, BookHeart, Target, Save, List, ChevronDown, ChevronRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { UserCourseData, CourseModule as UserCourseModule, CourseLesson as UserCourseLesson } from '@/types/course'; // Asegúrate que CourseModule y CourseLesson se exporten
import { useRouter } from 'next/navigation';

export default function GenerarCursoPage() {
  const [skills, setSkills] = useState('');
  const [knowledge, setKnowledge] = useState('');
  const [passions, setPassions] = useState('');
  const [niche, setNiche] = useState('');
  
  // Usaremos el tipo PersonalizedCourseOutput que ahora incluye la estructura de módulos.
  const [generatedCourse, setGeneratedCourse] = useState<PersonalizedCourseOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

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
        description: `No se pudo generar el curso. ${error instanceof Error ? error.message : 'Inténtalo de nuevo.'}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCourse = () => {
    if (!generatedCourse) {
      toast({
        variant: "destructive",
        title: "Sin curso para guardar",
        description: "Primero genera un curso.",
      });
      return;
    }

    const newCourse: UserCourseData = {
      id: Date.now().toString(),
      title: generatedCourse.courseTitle,
      description: generatedCourse.courseDescription,
      // Mapear módulos y lecciones generados a la estructura UserCourseData
      // La IA ya añade IDs a modules y lessons en el flow
      modules: generatedCourse.modules.map(mod => ({
        id: (mod as any).id || `mod-${Date.now()}-${Math.random()}`, // Fallback si la IA no proveyó ID
        moduleTitle: mod.moduleTitle,
        moduleDescription: mod.moduleDescription,
        lessons: mod.lessons.map(les => ({
          id: (les as any).id || `les-${Date.now()}-${Math.random()}`, // Fallback
          lessonTitle: les.lessonTitle,
          topics: les.topics,
        })),
      })),
      skills,
      knowledge,
      passions,
      niche,
      createdAt: new Date().toISOString(),
    };

    try {
      const existingCoursesStr = localStorage.getItem('userCourses');
      const existingCourses: UserCourseData[] = existingCoursesStr ? JSON.parse(existingCoursesStr) : [];
      localStorage.setItem('userCourses', JSON.stringify([...existingCourses, newCourse]));
      toast({
        title: "Curso Guardado",
        description: "Tu curso ha sido guardado en 'Mis Cursos'.",
      });
      router.push(`/mis-cursos/${newCourse.id}/edit`);
    } catch (error) {
      console.error("Error saving course to localStorage:", error);
      toast({
        variant: "destructive",
        title: "Error al Guardar",
        description: "No se pudo guardar el curso en el almacenamiento local.",
      });
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
          <CardFooter className="flex flex-col sm:flex-row gap-4 items-center">
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-3 px-6">
              {isLoading ? <LoadingSpinner size="sm" /> : <><Sparkles className="h-5 w-5 mr-2" />Generar Esquema del Curso</>}
            </Button>
            {generatedCourse && (
              <Button onClick={handleSaveCourse} variant="default" className="w-full sm:w-auto text-lg py-3 px-6">
                <Save className="h-5 w-5 mr-2" /> Guardar y Ver Curso
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>

      {isLoading && !generatedCourse && (
        <Card className="shadow-md mt-8">
          <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px]">
            <LoadingSpinner text="Creando tu curso personalizado..." size="lg" />
          </CardContent>
        </Card>
      )}

      {generatedCourse && (
        <Card className="shadow-lg bg-gradient-to-br from-primary/5 via-background to-primary/10 mt-8">
          <CardHeader>
            <CardTitle className="font-headline text-3xl text-primary flex items-center">
              <Sparkles className="h-7 w-7 mr-3" />
              {generatedCourse.courseTitle}
            </CardTitle>
            <CardDescription className="text-lg">{generatedCourse.courseDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <h3 className="font-headline text-xl font-semibold mb-4 text-foreground/90">Módulos del Curso:</h3>
            {generatedCourse.modules && generatedCourse.modules.length > 0 ? (
              <Accordion type="multiple" className="w-full space-y-3">
                {generatedCourse.modules.map((module, moduleIndex) => (
                  <AccordionItem key={(module as any).id || `module-${moduleIndex}`} value={(module as any).id || `module-${moduleIndex}`} className="bg-card/60 border border-border rounded-lg shadow-sm">
                    <AccordionTrigger className="p-4 hover:no-underline">
                      <div className="flex flex-col text-left">
                        <span className="text-lg font-semibold text-primary">{module.moduleTitle}</span>
                        <span className="text-sm text-muted-foreground mt-1">{module.moduleDescription}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-4 pt-0">
                      <h4 className="font-semibold text-md mb-2 text-foreground/80">Lecciones:</h4>
                      {module.lessons && module.lessons.length > 0 ? (
                        <ul className="space-y-3 pl-2">
                          {module.lessons.map((lesson, lessonIndex) => (
                            <li key={(lesson as any).id || `lesson-${lessonIndex}`} className="p-3 bg-background/70 rounded-md border">
                              <p className="font-medium text-foreground">{lesson.lessonTitle}</p>
                              {lesson.topics && lesson.topics.length > 0 && (
                                <ul className="list-disc list-inside pl-4 mt-1 space-y-0.5 text-sm text-muted-foreground">
                                  {lesson.topics.map((topic, topicIndex) => (
                                    <li key={`topic-${topicIndex}`}>{topic}</li>
                                  ))}
                                </ul>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">No hay lecciones detalladas para este módulo.</p>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <p className="text-muted-foreground">No se generaron módulos para este curso.</p>
            )}
          </CardContent>
          <CardFooter className="flex-col items-start">
             <p className="text-xs text-muted-foreground mb-4">Este es un borrador generado por IA. Puedes refinarlo y adaptarlo a tu estilo en la sección 'Mis Cursos'.</p>
             <Button onClick={handleSaveCourse} variant="default" className="w-full sm:w-auto">
                <Save className="h-5 w-5 mr-2" /> Guardar este Curso y Ver en Mis Cursos
              </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
