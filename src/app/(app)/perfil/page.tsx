// src/app/(app)/perfil/page.tsx
"use client";

import PageTitle from '@/components/PageTitle';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogOut, Edit3, Save, Image as ImageIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function PerfilPage() {
  const { user, logout, updateUser } = useAuth();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [photoURL, setPhotoURL] = useState('');

  useEffect(() => {
    if (user) {
      setDisplayName(user.name || '');
      setEmail(user.email || '');
      setPhotoURL(user.photoURL || 'https://placehold.co/100x100.png');
    }
  }, [user]);

  const handleSave = () => {
    if (!user) return;

    const updatedUserData = {
      name: displayName,
      email: email, // Email is typically not changed by user, but included if it were
      photoURL: photoURL,
    };
    
    updateUser(updatedUserData); // Update context and localStorage

    toast({
      title: "Perfil Actualizado",
      description: "Tus cambios han sido guardados.",
    });
    setIsEditing(false);
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
            <AvatarImage src={photoURL} alt={displayName} data-ai-hint="profile avatar large"/>
            <AvatarFallback className="text-4xl">{displayName ? displayName.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
          </Avatar>
          <CardTitle className="font-headline text-2xl">{isEditing ? displayName : user?.name || 'Usuario'}</CardTitle>
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
          {isEditing && (
            <div>
              <Label htmlFor="photoURL" className="text-base flex items-center">
                <ImageIcon className="mr-2 h-4 w-4 text-primary"/>
                URL de la Foto de Perfil
              </Label>
              <Input 
                id="photoURL" 
                type="url"
                value={photoURL} 
                onChange={(e) => setPhotoURL(e.target.value)} 
                placeholder="https://ejemplo.com/tu-imagen.png"
                className="text-base mt-1"
              />
            </div>
          )}
          
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
