// src/app/(app)/perfil/page.tsx
"use client";

import PageTitle from '@/components/PageTitle';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogOut, Edit3, Save } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function PerfilPage() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || ''); // Email typically not editable

  const handleSave = () => {
    // In a real app, this would call an API to update user info
    console.log("Guardando perfil:", { displayName, email });
    toast({
      title: "Perfil Actualizado",
      description: "Tus cambios han sido guardados (simulación).",
    });
    setIsEditing(false);
    // Potentially update user context if API returns new data
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <PageTitle 
        title="Tu Perfil"
        description="Gestiona tu información personal y configuración de cuenta."
      />

      <Card className="shadow-lg">
        <CardHeader className="items-center text-center">
          <Avatar className="h-24 w-24 mb-4 border-4 border-primary">
            <AvatarImage src={user?.photoURL || `https://placehold.co/100x100.png`} alt={user?.name} data-ai-hint="profile avatar large"/>
            <AvatarFallback className="text-4xl">{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
          </Avatar>
          <CardTitle className="font-headline text-2xl">{user?.name || 'Usuario'}</CardTitle>
          <CardDescription>{user?.email || 'usuario@ejemplo.com'}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="displayName" className="text-base">Nombre para mostrar</Label>
            <Input 
              id="displayName" 
              value={displayName} 
              onChange={(e) => setDisplayName(e.target.value)} 
              disabled={!isEditing} 
              className="text-base mt-1"
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-base">Correo Electrónico</Label>
            <Input 
              id="email" 
              type="email" 
              value={email} 
              disabled // Email generally not editable by user directly
              className="text-base mt-1 bg-muted/50" 
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            {isEditing ? (
              <Button onClick={handleSave} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                <Save className="mr-2 h-4 w-4" /> Guardar Cambios
              </Button>
            ) : (
              <Button onClick={() => setIsEditing(true)} variant="outline" className="w-full sm:w-auto">
                <Edit3 className="mr-2 h-4 w-4" /> Editar Perfil
              </Button>
            )}
            <Button onClick={logout} variant="destructive" className="w-full sm:w-auto sm:ml-auto">
              <LogOut className="mr-2 h-4 w-4" /> Cerrar Sesión
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
