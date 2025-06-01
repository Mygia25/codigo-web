
// src/app/(app)/mis-cursos/[courseId]/edit/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import PageTitle from '@/components/PageTitle';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Save, Edit, ListChecks, BotIcon, FileText, Video, PlusCircle, Trash2, Sparkles } from "lucide-react";
import type { UserCourseData, CourseModule, CourseLesson, ChecklistItem } from '@/types/course';
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from '@/components/LoadingSpinner';

const initialChecklist: ChecklistItem[] = [
  { id: 'chk-define-obj', text: "Definir objetivos de aprendizaje claros para el curso", completed: false, link: "/cursos/1" }, // Example link
  { id: 'chk-structure-modules', text: "Estructurar los módulos y lecciones principales", completed: false },
  { id: 'chk-audience-profile', text: "Perfilar audiencia ideal y sus necesidades", completed: false },
  { id: 'chk-create-content-detailed', text: "Crear contenido detallado para cada lección (textos, scripts)", completed: false },
  { id: 'chk-design-materials', text: "Diseñar materiales descargables (guías, plantillas, worksheets)", completed: false },
  { id: 'chk-visual-identity', text: "Definir identidad visual del curso (colores, tipografía)", completed: false },
  { id: 'chk-record-videos', text: "Grabar y editar videos del curso", completed: false },
  { id: 'chk-upload-platform', text: "Subir contenido a la plataforma elegida", completed: false, link: "/ecosistema" },
  { id: 'chk-pricing-strategy', text: "Establecer estrategia de precios y ofertas", completed: false },
  { id: 'chk-marketing-plan', text: "Crear plan de marketing y lanzamiento", completed: false },
  { id: 'chk-pilot-test', text: "Realizar prueba piloto con un grupo beta", completed: false },
  { id: 'chk-collect-feedback', text: "Recolectar y aplicar feedback de prueba piloto", completed: false },
  { id: 'chk-legal-aspects', text: "Revisar aspectos legales (términos, privacidad)", completed: false },
];


export default function EditCursoPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const { toast } = useToast();

  const [editableCourse, setEditableCourse] = useState<UserCourseData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCourse = useCallback(() => {
    if (courseId) {
      setIsLoading(true);
      try {
        const storedCourses = localStorage.getItem('userCourses');
        if (storedCourses) {
          const coursesArray: UserCourseData[] = JSON.parse(storedCourses);
          const foundCourse = coursesArray.find(c => c.id === courseId);
          if (foundCourse) {
            setEditableCourse({
              ...foundCourse,
              checklist: foundCourse.checklist && foundCourse.checklist.length > 0 ? foundCourse.checklist : [...initialChecklist.map(item => ({...item, completed: false}))] // Ensure checklist exists
            });
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

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  const handleInputChange = (field: keyof UserCourseData, value: any) => {
    setEditableCourse(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleModuleChange = (moduleIndex: number, field: keyof CourseModule, value: string) => {
    setEditableCourse(prev => {
      if (!prev) return null;
      const updatedModules = [...prev.modules];
      updatedModules[moduleIndex] = { ...updatedModules[moduleIndex], [field]: value };
      return { ...prev, modules: updatedModules };
    });
  };
  
  const handleLessonChange = (moduleIndex: number, lessonIndex: number, field: keyof CourseLesson, value: any) => {
    setEditableCourse(prev => {
      if (!prev) return null;
      const updatedModules = [...prev.modules];
      const updatedLessons = [...updatedModules[moduleIndex].lessons];
      updatedLessons[lessonIndex] = { ...updatedLessons[lessonIndex], [field]: value };
      updatedModules[moduleIndex] = { ...updatedModules[moduleIndex], lessons: updatedLessons };
      return { ...prev, modules: updatedModules };
    });
  };

  const handleTopicChange = (moduleIndex: number, lessonIndex: number, topicIndex: number, value: string) => {
    setEditableCourse(prev => {
        if (!prev) return null;
        const updatedModules = [...prev.modules];
        const updatedLessons = [...updatedModules[moduleIndex].lessons];
        const updatedTopics = [...updatedLessons[lessonIndex].topics];
        updatedTopics[topicIndex] = value;
        updatedLessons[lessonIndex] = { ...updatedLessons[lessonIndex], topics: updatedTopics };
        updatedModules[moduleIndex] = { ...updatedModules[moduleIndex], lessons: updatedLessons };
        return { ...prev, modules: updatedModules };
    });
  };

  const addTopic = (moduleIndex: number, lessonIndex: number) => {
    setEditableCourse(prev => {
        if (!prev) return null;
        const updatedModules = [...prev.modules];
        const updatedLessons = [...updatedModules[moduleIndex].lessons];
        const updatedTopics = [...updatedLessons[lessonIndex].topics, "Nuevo tema"];
        updatedLessons[lessonIndex] = { ...updatedLessons[lessonIndex], topics: updatedTopics };
        updatedModules[moduleIndex] = { ...updatedModules[moduleIndex], lessons: updatedLessons };
        return { ...prev, modules: updatedModules };
    });
  };

  const removeTopic = (moduleIndex: number, lessonIndex: number, topicIndex: number) => {
    setEditableCourse(prev => {
        if (!prev) return null;
        const updatedModules = [...prev.modules];
        const updatedLessons = [...updatedModules[moduleIndex].lessons];
        const updatedTopics = updatedLessons[lessonIndex].topics.filter((_, idx) => idx !== topicIndex);
        updatedLessons[lessonIndex] = { ...updatedLessons[lessonIndex], topics: updatedTopics };
        updatedModules[moduleIndex] = { ...updatedModules[moduleIndex], lessons: updatedLessons };
        return { ...prev, modules: updatedModules };
    });
  };


  const handleChecklistChange = (itemId: string, completed: boolean) => {
    setEditableCourse(prev => {
      if (!prev || !prev.checklist) return null;
      const updatedChecklist = prev.checklist.map(item =>
        item.id === itemId ? { ...item, completed } : item
      );
      return { ...prev, checklist: updatedChecklist };
    });
  };

  const handleSaveChanges = () => {
    if (!editableCourse) return;
     try {
      const storedCourses = localStorage.getItem('userCourses');
      if (storedCourses) {
        let coursesArray: UserCourseData[] = JSON.parse(storedCourses);
        coursesArray = coursesArray.map(c => c.id === courseId ? editableCourse : c);
        localStorage.setItem('userCourses', JSON.stringify(coursesArray));
      }
      toast({
        title: "Cambios Guardados",
        description: "Los cambios al curso han sido guardados.",
      });
    } catch (error) {
      console.error("Error saving changes to localStorage:", error);
       toast({ variant: "destructive", title: "Error al guardar", description: "No se pudieron guardar los cambios." });
    }
  };

  if (isLoading || !editableCourse) {
    return (
      <div className="flex h-[calc(100vh-var(--header-height,theme(spacing.28)))] items-center justify-center">
        <LoadingSpinner text="Cargando detalles del curso..." size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-grow">
          <Input 
            value={editableCourse.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="font-headline text-3xl sm:text-4xl font-bold text-foreground bg-transparent border-0 border-b-2 border-transparent focus:border-primary focus:ring-0 p-0 h-auto"
          />
          <Input
            value={editableCourse.niche}
            onChange={(e) => handleInputChange('niche', e.target.value)}
            className="text-lg text-muted-foreground bg-transparent border-0 focus:ring-0 p-0 h-auto mt-1"
            placeholder="Nicho del curso"
          />
        </div>
        <Button onClick={() => router.push('/mis-cursos')} variant="outline" size="sm" className="w-full sm:w-auto">
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Mis Cursos
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <Label htmlFor="courseDescription" className="font-headline text-2xl">Descripción del Curso</Label>
        </CardHeader>
        <CardContent>
          <Textarea
            id="courseDescription"
            value={editableCourse.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={4}
            className="text-base whitespace-pre-wrap"
            placeholder="Describe tu curso aquí..."
          />
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Contenido del Curso Detallado</CardTitle>
           <CardDescription className="flex items-center text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 mr-2 text-amber-500" />
            Puedes editar todos los campos. Usa el Asistente IA (próximamente) para refinar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {editableCourse.modules && editableCourse.modules.length > 0 ? (
            <Accordion type="multiple" className="w-full space-y-4" defaultValue={editableCourse.modules.map(m => m.id)}>
              {editableCourse.modules.map((module, moduleIndex) => (
                <AccordionItem key={module.id} value={module.id} className="bg-card/60 border border-border rounded-lg shadow-sm">
                  <AccordionTrigger className="p-4 hover:no-underline text-left w-full">
                    <Input
                        value={module.moduleTitle}
                        onChange={(e) => handleModuleChange(moduleIndex, 'moduleTitle', e.target.value)}
                        className="text-lg font-semibold text-primary bg-transparent border-0 focus:ring-0 p-0 h-auto w-full"
                        placeholder="Título del Módulo"
                      />
                  </AccordionTrigger>
                  <AccordionContent className="p-4 pt-2 space-y-4">
                    <div>
                      <Label htmlFor={`modDesc-${module.id}`} className="text-sm font-medium text-muted-foreground">Descripción del Módulo</Label>
                      <Textarea
                        id={`modDesc-${module.id}`}
                        value={module.moduleDescription}
                        onChange={(e) => handleModuleChange(moduleIndex, 'moduleDescription', e.target.value)}
                        rows={2}
                        className="text-sm mt-1"
                        placeholder="Describe este módulo..."
                      />
                    </div>
                    
                    <h4 className="font-semibold text-md text-foreground/80 pt-2 border-t border-border">Lecciones:</h4>
                    {module.lessons && module.lessons.length > 0 ? (
                      <div className="space-y-3 pl-2">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <Card key={lesson.id} className="p-3 bg-background/70 rounded-md border">
                            <Input
                              value={lesson.lessonTitle}
                              onChange={(e) => handleLessonChange(moduleIndex, lessonIndex, 'lessonTitle', e.target.value)}
                              className="font-medium text-foreground bg-transparent border-0 focus:ring-0 p-0 h-auto w-full mb-2"
                              placeholder="Título de la Lección"
                            />
                            
                            <Label className="text-xs text-muted-foreground">Temas de la lección:</Label>
                            {lesson.topics && lesson.topics.length > 0 && (
                              <ul className="list-disc list-inside pl-1 mt-1 space-y-1">
                                {lesson.topics.map((topic, topicIndex) => (
                                  <li key={`topic-${lesson.id}-${topicIndex}`} className="flex items-center gap-2">
                                    <Input
                                      value={topic}
                                      onChange={(e) => handleTopicChange(moduleIndex, lessonIndex, topicIndex, e.target.value)}
                                      className="text-sm text-muted-foreground bg-transparent border-0 focus:ring-0 p-0 h-auto flex-grow"
                                      placeholder="Nombre del tema"
                                    />
                                    <Button variant="ghost" size="icon" onClick={() => removeTopic(moduleIndex, lessonIndex, topicIndex)} className="h-6 w-6 text-destructive/70 hover:text-destructive">
                                        <Trash2 className="h-3 w-3"/>
                                    </Button>
                                  </li>
                                ))}
                              </ul>
                            )}
                            <Button variant="outline" size="sm" onClick={() => addTopic(moduleIndex, lessonIndex)} className="mt-2">
                                <PlusCircle className="h-4 w-4 mr-1"/> Añadir Tema
                            </Button>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No hay lecciones detalladas para este módulo.</p>
                    )}
                     {/* TODO: Botón para añadir lección */}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <p className="text-muted-foreground">No hay módulos definidos para este curso.</p>
          )}
           {/* TODO: Botón para añadir módulo */}
        </CardContent>
         <CardFooter>
            <p className="text-xs text-muted-foreground italic">
                <BotIcon className="h-3 w-3 mr-1 inline-block"/> Asistente IA para refinar y generar contenido detallado (Próximamente).
            </p>
        </CardFooter>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center"><ListChecks className="mr-2 h-5 w-5 text-primary" /> Checklist de Pasos para tu Curso</CardTitle>
          <CardDescription>Marca los pasos completados para llevar tu curso al éxito.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {editableCourse.checklist?.map((item) => (
            <div key={item.id} className="flex items-center space-x-3 p-3 bg-card rounded-md border hover:bg-muted/50 transition-colors">
              <Checkbox
                id={item.id}
                checked={item.completed}
                onCheckedChange={(checked) => handleChecklistChange(item.id, !!checked)}
              />
              <Label htmlFor={item.id} className={`flex-1 text-sm ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                {item.text}
              </Label>
              {item.link && !item.completed && (
                 <Button variant="link" size="sm" asChild className="p-0 h-auto">
                   <Link href={item.link} target={item.link.startsWith("http") ? "_blank" : "_self"}>
                     Ir a sección
                   </Link>
                 </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center"><FileText className="mr-2 h-5 w-5 text-primary" /> Generación de Guías PDF</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-3">Visualiza el contenido de tu curso que podría ser exportado a PDF. (Funcionalidad de descarga próximamente).</p>
            <div className="border rounded-md p-4 max-h-96 overflow-y-auto bg-background text-sm">
              <h2 className="text-xl font-bold mb-2">{editableCourse.title}</h2>
              <p className="italic mb-4">{editableCourse.description}</p>
              {editableCourse.modules.map(module => (
                <div key={module.id} className="mb-3">
                  <h3 className="text-lg font-semibold mt-2 text-primary">{module.moduleTitle}</h3>
                  <p className="text-xs text-muted-foreground mb-1">{module.moduleDescription}</p>
                  {module.lessons.map(lesson => (
                    <div key={lesson.id} className="ml-2 mb-1">
                      <h4 className="font-medium">{lesson.lessonTitle}</h4>
                      <ul className="list-disc list-inside pl-3 text-xs">
                        {lesson.topics.map((topic, i) => <li key={i}>{topic}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <Button className="mt-4 w-full" disabled><FileText className="mr-2"/>Descargar como PDF (Próximamente)</Button>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center"><Video className="mr-2 h-5 w-5 text-primary" /> Generación de Videos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Herramientas y recursos para ayudarte a crear los videos de tu curso. (Próximamente)</p>
             <ul className="mt-2 space-y-1 text-sm text-muted-foreground list-disc list-inside">
                <li>Recomendaciones de software de grabación y edición.</li>
                <li>Tips para una buena iluminación y audio.</li>
                <li>Integración con herramientas de IA para creación de avatares o voz.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8 flex justify-end">
        <Button onClick={handleSaveChanges} size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Save className="mr-2 h-5 w-5" /> Guardar Cambios del Curso
        </Button>
      </div>
    </div>
  );
}
