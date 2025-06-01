
// src/app/(app)/mis-cursos/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import PageTitle from '@/components/PageTitle';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, BookOpen, Edit3, Trash2 } from "lucide-react";
import type { UserCourseData } from '@/types/course';
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function MisCursosPage() {
  const [courses, setCourses] = useState<UserCourseData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchCourses = () => {
    setIsLoading(true);
    try {
      const storedCourses = localStorage.getItem('userCourses');
      if (storedCourses) {
        setCourses(JSON.parse(storedCourses));
      } else {
        setCourses([]);
      }
    } catch (error) {
      console.error("Error fetching courses from localStorage:", error);
      toast({
        variant: "destructive",
        title: "Error al cargar cursos",
        description: "No se pudieron cargar tus cursos guardados.",
      });
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDeleteCourse = (courseId: string) => {
    try {
      const updatedCourses = courses.filter(course => course.id !== courseId);
      localStorage.setItem('userCourses', JSON.stringify(updatedCourses));
      setCourses(updatedCourses);
      toast({
        title: "Curso Eliminado",
        description: "El curso ha sido eliminado correctamente.",
      });
    } catch (error) {
      console.error("Error deleting course from localStorage:", error);
      toast({
        variant: "destructive",
        title: "Error al Eliminar",
        description: "No se pudo eliminar el curso.",
      });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Cargando cursos...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <PageTitle 
          title="Mis Cursos Creados"
          description="Aquí encontrarás todos los cursos que has generado y guardado."
        />
        <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/generar-curso">
            <PlusCircle className="mr-2 h-5 w-5" />
            Crear Nuevo Curso
          </Link>
        </Button>
      </div>

      {courses.length === 0 ? (
        <Card className="text-center shadow-lg">
          <CardHeader>
            <BookOpen className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <CardTitle className="font-headline text-2xl">Aún no tienes cursos</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-lg">
              ¡Es hora de dar vida a tus ideas! Empieza por generar tu primer curso personalizado.
            </CardDescription>
          </CardContent>
          <CardFooter className="justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/generar-curso">
                <PlusCircle className="mr-2 h-5 w-5" />
                Generar mi Primer Curso
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <CardHeader>
                <CardTitle className="font-headline text-xl">{course.title}</CardTitle>
                <CardDescription className="text-sm truncate h-10">{course.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-xs text-muted-foreground">Nicho: {course.niche}</p>
                <p className="text-xs text-muted-foreground">Creado: {new Date(course.createdAt).toLocaleDateString()}</p>
              </CardContent>
              <CardFooter className="grid grid-cols-2 gap-2 pt-4 border-t">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/mis-cursos/${course.id}/edit`}>
                    <Edit3 className="mr-2 h-4 w-4" /> Ver / Editar
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Estás seguro de que quieres eliminar este curso?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. El curso "{course.title}" será eliminado permanentemente.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteCourse(course.id)}>
                        Sí, eliminar curso
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
