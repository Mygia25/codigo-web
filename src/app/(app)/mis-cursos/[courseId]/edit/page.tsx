
// src/app/(app)/mis-cursos/[courseId]/edit/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PageTitle from '@/components/PageTitle';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, Save, Edit, ListChecks, BotIcon, FileText, Video } from "lucide-react";
import type { UserCourseData } from '@/types/course';
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from '@/components/LoadingSpinner';

export default function EditCursoPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const { toast } = useToast();

  const [course, setCourse] = useState<UserCourseData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editableTitle, setEditableTitle] = useState('');
  // Add states for other editable fields if needed

  useEffect(() => {
    if (courseId) {
      setIsLoading(true);
      try {
        const storedCourses = localStorage.getItem('userCourses');
        if (storedCourses) {
          const coursesArray: UserCourseData[] = JSON.parse(storedCourses);
          const foundCourse = coursesArray.find(c => c.id === courseId);
          if (foundCourse) {
            setCourse(foundCourse);
            setEditableTitle(foundCourse.title);
          } else {
            toast({ variant: "destructive", title: "Error", description: "Curso no encontrado." });
            router.push('/mis-cursos');
          }
        }
      } catch (error) {
        console.error("Error fetching course:", error);
        toast({ variant: "destructive", title: "Error al cargar", description: "No se pudo cargar el curso." });
      } finally {
        setIsLoading(false);
      }
    }
  }, [courseId, router, toast]);

  const handleSaveChanges = () => {
    if (!course) return;
    // TODO: Implement actual saving logic for edits
    // For now, simulate save and update localStorage if title changed
    const updatedCourse = { ...course, title: editableTitle };
     try {
      const storedCourses = localStorage.getItem('userCourses');
      if (storedCourses) {
        let coursesArray: UserCourseData[] = JSON.parse(storedCourses);
        coursesArray = coursesArray.map(c => c.id === courseId ? updatedCourse : c);
        localStorage.setItem('userCourses', JSON.stringify(coursesArray));
        setCourse(updatedCourse); // Update local state
      }
    } catch (error) {
      console.error("Error saving changes to localStorage:", error);
    }

    toast({
      title: "Cambios Guardados (Simulación)",
      description: "Los cambios al curso han sido guardados (actualmente solo título).",
    });
    setIsEditingTitle(false);
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-var(--header-height,theme(spacing.28)))] items-center justify-center">
        <LoadingSpinner text="Cargando detalles del curso..." size="lg" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-10">
        <PageTitle title="Curso no encontrado" description="No pudimos encontrar los detalles para este curso." />
        <Button onClick={() => router.push('/mis-cursos')} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Mis Cursos
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        {isEditingTitle ? (
          <input 
            type="text" 
            value={editableTitle}
            onChange={(e) => setEditableTitle(e.target.value)}
            className="font-headline text-3xl sm:text-4xl font-bold text-foreground bg-transparent border-b-2 border-primary focus:outline-none"
            autoFocus
            onBlur={() => setIsEditingTitle(false)} // Optionally save on blur or require explicit save
          />
        ) : (
          <div className="flex items-center gap-3">
            <PageTitle title={course.title} description={`Nicho: ${course.niche}`} className="mb-0" />
            <Button variant="ghost" size="icon" onClick={() => setIsEditingTitle(true)} className="text-muted-foreground hover:text-primary">
              <Edit className="h-5 w-5" />
              <span className="sr-only">Editar título</span>
            </Button>
          </div>
        )}
        <Button onClick={() => router.push('/mis-cursos')} variant="outline" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Mis Cursos
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Descripción del Curso</CardTitle>
        </CardHeader>
        <CardContent>
          {/* TODO: Make description editable similarly to title if needed */}
          <p className="text-base text-muted-foreground whitespace-pre-wrap">{course.description}</p>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Contenido del Curso Detallado</CardTitle>
        </CardHeader>
        <CardContent>
          {course.modules && course.modules.length > 0 ? (
            <Accordion type="multiple" className="w-full space-y-3">
              {course.modules.map((module) => (
                <AccordionItem key={module.id} value={module.id} className="bg-card/60 border border-border rounded-lg shadow-sm">
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
                        {module.lessons.map((lesson) => (
                          <li key={lesson.id} className="p-3 bg-background/70 rounded-md border">
                            <p className="font-medium text-foreground">{lesson.lessonTitle}</p>
                            {lesson.topics && lesson.topics.length > 0 && (
                              <ul className="list-disc list-inside pl-4 mt-1 space-y-0.5 text-sm text-muted-foreground">
                                {lesson.topics.map((topic, topicIndex) => (
                                  <li key={`topic-${lesson.id}-${topicIndex}`}>{topic}</li>
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
            <p className="text-muted-foreground">No hay módulos definidos para este curso.</p>
          )}
        </CardContent>
      </Card>

      {/* Placeholders for future features */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center"><ListChecks className="mr-2 h-5 w-5 text-primary" /> Checklist de Pasos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Completa los pasos para finalizar tu curso. (Próximamente)</p>
            {/* Example placeholder items */}
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground list-disc list-inside">
                <li>Definir objetivos de aprendizaje claros.</li>
                <li>Crear contenido detallado para cada lección.</li>
                <li>Diseñar materiales descargables.</li>
                <li>Grabar videos del curso.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center"><BotIcon className="mr-2 h-5 w-5 text-primary" /> Asistente IA de Creación</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Obtén ayuda de la IA para encontrar fuentes, refinar contenido y más. (Próximamente)</p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center"><FileText className="mr-2 h-5 w-5 text-primary" /> Generación de Guías PDF</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Crea guías en PDF para tus alumnos. (Próximamente)</p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center"><Video className="mr-2 h-5 w-5 text-primary" /> Generación de Videos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Herramientas para ayudarte a crear los videos de tu curso. (Próximamente)</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8 flex justify-end">
        <Button onClick={handleSaveChanges} size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Save className="mr-2 h-5 w-5" /> Guardar Cambios
        </Button>
      </div>
    </div>
  );
}

