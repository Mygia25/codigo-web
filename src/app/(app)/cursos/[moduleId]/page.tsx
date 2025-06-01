// src/app/(app)/cursos/[moduleId]/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PageTitle from '@/components/PageTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Video, Download, ListChecks, BookOpen } from 'lucide-react';
import Image from 'next/image';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Label } from '@/components/ui/label';

// Mock data - In a real app, this would come from a backend or CMS
const courseModulesData = {
  '1': { 
    title: "Módulo 1: Consciencia", 
    shortDescription: "Descubre tu potencial interior.",
    longDescription: "En este módulo, explorarás las bases de la autoconsciencia, identificarás tus fortalezas y áreas de oportunidad, y comenzarás a definir tu propósito único. Aprenderás técnicas para conectar con tu yo interior y sentar las bases para un crecimiento personal y profesional significativo.",
    videos: Array(7).fill(null).map((_, i) => ({ id: `v${i+1}`, title: `Video ${i+1}: Tema clave del módulo`, thumbnailUrl: `https://placehold.co/600x400.png`, duration: `${Math.floor(Math.random() * 10) + 5}:${String(Math.floor(Math.random()*60)).padStart(2,'0')}` })),
    resources: [
      { id: 'r1', name: "Guía de Autoevaluación.pdf", type: "pdf", url: "#" , dataAiHint: "document manuscript"},
      { id: 'r2', name: "Plantilla de Fortalezas.docx", type: "doc", url: "#", dataAiHint: "template report" },
      { id: 'r3', name: "Ejercicios de Mindfulness.zip", type: "zip", url: "#", dataAiHint: "archive files" },
    ],
    todos: [
      { id: 't1', text: "Completar el cuestionario de autoevaluación.", completed: false },
      { id: 't2', text: "Ver todos los videos del módulo.", completed: false },
      { id: 't3', text: "Realizar el ejercicio de la Rueda de la Vida.", completed: false },
      { id: 't4', text: "Descargar y revisar la plantilla de fortalezas.", completed: false },
    ]
  },
  // Add more modules here as needed, copying the structure from module '1'
  // For brevity, only module 1 is fully fleshed out. Other modules will show a "coming soon" message.
};

interface VideoItem {
  id: string;
  title: string;
  thumbnailUrl: string;
  duration: string;
}

interface ResourceItem {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'zip';
  url: string;
  dataAiHint: string;
}

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

interface CourseModule {
  title: string;
  shortDescription: string;
  longDescription: string;
  videos: VideoItem[];
  resources: ResourceItem[];
  todos: TodoItem[];
}

export default function CursoModuloPage() {
  const params = useParams();
  const router = useRouter();
  const moduleId = params.moduleId as string;
  
  const [moduleData, setModuleData] = useState<CourseModule | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [todos, setTodos] = useState<TodoItem[]>([]);

  useEffect(() => {
    if (moduleId) {
      // Simulate data fetching
      setTimeout(() => {
        const data = (courseModulesData as any)[moduleId];
        if (data) {
          setModuleData(data);
          setTodos(data.todos || []);
        } else {
          // Fallback for modules not fully defined in mock
           setModuleData({
            title: `Módulo ${moduleId}`,
            shortDescription: "Contenido próximamente disponible.",
            longDescription: `El contenido detallado para el Módulo ${moduleId} está en preparación y estará disponible muy pronto. ¡Gracias por tu paciencia!`,
            videos: [],
            resources: [],
            todos: []
           });
        }
        setIsLoading(false);
      }, 500);
    }
  }, [moduleId]);

  const handleTodoChange = (todoId: string) => {
    setTodos(prevTodos => 
      prevTodos.map(todo => 
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-var(--header-height,theme(spacing.28)))] items-center justify-center">
        <LoadingSpinner text="Cargando contenido del módulo..." size="lg" />
      </div>
    );
  }

  if (!moduleData) {
    return (
      <div className="text-center py-10">
        <PageTitle title="Módulo no encontrado" description="No pudimos encontrar el contenido para este módulo." />
        <Button onClick={() => router.push('/dashboard')} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <PageTitle title={moduleData.title} description={moduleData.shortDescription} />
        <Button onClick={() => router.push('/dashboard')} variant="outline" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Dashboard
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center">
            <BookOpen className="mr-3 h-6 w-6 text-primary" />
            ¿Qué aprenderás en este módulo?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-base text-muted-foreground whitespace-pre-wrap">{moduleData.longDescription}</p>
        </CardContent>
      </Card>

      {moduleData.videos.length > 0 && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center">
              <Video className="mr-3 h-6 w-6 text-primary" />
              Videos del Módulo
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {moduleData.videos.map((video) => (
              <Card key={video.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="aspect-video relative">
                  <Image 
                    src={video.thumbnailUrl} 
                    alt={video.title} 
                    layout="fill" 
                    objectFit="cover"
                    data-ai-hint="course video" 
                  />
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                </div>
                <CardHeader className="p-4">
                  <CardTitle className="text-base font-semibold">{video.title}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}
      
      {(moduleData.resources.length > 0 || moduleData.todos.length > 0) && (
        <div className="grid md:grid-cols-2 gap-8">
          {moduleData.resources.length > 0 && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center">
                  <Download className="mr-3 h-6 w-6 text-primary" />
                  Recursos Descargables
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {moduleData.resources.map((resource) => (
                  <a 
                    key={resource.id} 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center p-3 bg-card hover:bg-muted rounded-md transition-colors border"
                  >
                    <Download className="h-5 w-5 mr-3 text-muted-foreground" />
                    <span className="flex-1 text-sm font-medium">{resource.name}</span>
                    <span className="text-xs uppercase text-muted-foreground bg-background px-2 py-0.5 rounded-sm border">{resource.type}</span>
                  </a>
                ))}
              </CardContent>
            </Card>
          )}

          {todos.length > 0 && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center">
                  <ListChecks className="mr-3 h-6 w-6 text-primary" />
                  Lista de Tareas (To-Do)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {todos.map((todo) => (
                  <div key={todo.id} className="flex items-center space-x-3 p-3 bg-card rounded-md border">
                    <Checkbox 
                      id={`todo-${todo.id}`} 
                      checked={todo.completed} 
                      onCheckedChange={() => handleTodoChange(todo.id)} 
                    />
                    <Label 
                      htmlFor={`todo-${todo.id}`} 
                      className={`flex-1 text-sm ${todo.completed ? 'line-through text-muted-foreground' : ''}`}
                    >
                      {todo.text}
                    </Label>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}
       {moduleData.videos.length === 0 && moduleData.resources.length === 0 && moduleData.todos.length === 0 && moduleId !== '1' && (
         <Card className="shadow-lg">
            <CardContent className="p-6 text-center">
                <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
                <p className="text-lg text-muted-foreground">El contenido detallado para este módulo estará disponible pronto.</p>
            </CardContent>
         </Card>
       )}

    </div>
  );
}
