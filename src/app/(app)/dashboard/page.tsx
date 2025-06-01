// src/app/(app)/dashboard/page.tsx
"use client";

import PageTitle from '@/components/PageTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Zap, Target, Lightbulb, Award, BarChart3 } from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

interface ProgressItem {
  id: string;
  title: string;
  description: string;
  progress: number;
  icon: React.ElementType;
  completed?: boolean;
}

const progressData: ProgressItem[] = [
  { id: '1', title: "Módulo 1: Consciencia", description: "Descubre tu potencial interior.", progress: 100, icon: Lightbulb, completed: true },
  { id: '2', title: "Módulo 2: Orden", description: "Organiza tus ideas y recursos.", progress: 75, icon: Target },
  { id: '3', title: "Módulo 3: Determinación", description: "Define tus metas y objetivos.", progress: 50, icon: Zap },
  { id: '4', title: "Módulo 4: Implementación", description: "Pon en marcha tu plan de acción.", progress: 20, icon: CheckCircle2 },
  { id: '5', title: "Módulo 5: Ganancia", description: "Monetiza tu conocimiento.", progress: 0, icon: Award },
  { id: '6', title: "Módulo 6: Optimización", description: "Mejora continua y escalabilidad.", progress: 0, icon: BarChart3 },
];

const overallProgress = Math.round(progressData.reduce((acc, item) => acc + item.progress, 0) / progressData.length);

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <PageTitle 
        title={`Bienvenido, ${user?.name?.split(' ')[0] || 'Usuario'}!`}
        description="Aquí puedes ver tu progreso en el método CÓDIGO y los próximos pasos."
      />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Progreso General</CardTitle>
          <CardDescription>Tu avance total en el método CÓDIGO.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Progress value={overallProgress} className="h-4 flex-1" />
            <span className="text-xl font-semibold text-primary">{overallProgress}%</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {progressData.map((item) => (
          <Link href={`/cursos/${item.id}`} key={item.id} legacyBehavior>
            <a className="block">
              <Card className={`shadow-md hover:shadow-xl transition-shadow duration-300 h-full flex flex-col ${item.completed ? 'opacity-70 border-primary/30' : 'hover:border-primary/50'}`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium font-headline">{item.title}</CardTitle>
                  <item.icon className={`h-6 w-6 ${item.completed ? 'text-green-500' : 'text-primary'}`} />
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                  <Progress value={item.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1 text-right">{item.progress}% completado</p>
                </CardContent>
              </Card>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}
