// src/app/(app)/perfil/page.tsx
"use client";

import PageTitle from '@/components/PageTitle';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogOut, Edit3, Save, Image as ImageIcon, KeyRound } from 'lucide-react';
import { useState, useEffect, FormEvent } from 'react';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function PerfilPage() {
  const { user, logout, updateUserAccount, isLoading: authIsLoading } = useAuth();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [currentPhotoURL, setCurrentPhotoURL] = useState('');
  const [newPhotoURL, setNewPhotoURL] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
    if (user) {
      setDisplayName(user.name || '');
      setCurrentPhotoURL(user.photoURL || `https://placehold.co/100x100.png?text=${user.name?.charAt(0).toUpperCase() || 'U'}`);
      setNewPhotoURL(user.photoURL || ''); // Initialize with current, or empty if none
    }
  }, [user]);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (newPassword && newPassword !== confirmNewPassword) {
      toast({ variant: "destructive", title: "Error", description: "Las contraseñas no coinciden." });
      return;
    }
    if (newPassword && newPassword.length < 6) {
      toast({ variant: "destructive", title: "Error", description: "La nueva contraseña debe tener al menos 6 caracteres."});
      return;
    }

    setIsSubmitting(true);
    try {
      const updateData: { name?: string; photoURL?: string; password?: string } = {};
      if (displayName !== user.name) updateData.name = displayName;
      if (newPhotoURL && newPhotoURL !== user.photoURL) updateData.photoURL = newPhotoURL;
      if (newPassword) updateData.password = newPassword;

      if (Object.keys(updateData).length > 0) {
        await updateUserAccount(updateData);
        toast({ title: "Perfil Actualizado", description: "Tus cambios han sido guardados." });
        if (newPhotoURL && newPhotoURL !== user.photoURL) setCurrentPhotoURL(newPhotoURL); // Update displayed photo immediately
      } else {
        toast({ title: "Sin cambios", description: "No se detectaron cambios para guardar." });
      }
      setIsEditing(false);
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error al Actualizar", description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCancelEdit = () => {
    // Reset form fields to current user state
    if (user) {
        setDisplayName(user.name || '');
        setNewPhotoURL(user.photoURL || '');
    }
    setNewPassword('');
    setConfirmNewPassword('');
    setIsEditing(false);
  };


  if (authIsLoading && !user) {
    return <div className="flex h-screen items-center justify-center"><LoadingSpinner text="Cargando perfil..." size="lg" /></div>;
  }
  
  if (!user) {
    // This case should ideally be handled by AuthGuard redirecting to signin
    return <div className="text-center py-10">Por favor, inicia sesión para ver tu perfil.</div>;
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <PageTitle 
        title="Tu Perfil"
        description="Gestiona tu información personal y configuración de cuenta."
      />

      <Card className="shadow-lg">
        <form onSubmit={handleSave}>
          <CardHeader className="items-center text-center">
            <Avatar className="h-24 w-24 mb-4 border-4 border-primary">
              <AvatarImage src={isEditing && newPhotoURL ? newPhotoURL : currentPhotoURL} alt={displayName} data-ai-hint="profile avatar large"/>
              <AvatarFallback className="text-4xl">{displayName ? displayName.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
            </Avatar>
            <CardTitle className="font-headline text-2xl">{displayName || 'Usuario'}</CardTitle>
            <CardDescription>{user.email || 'usuario@ejemplo.com'}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="displayName" className="text-base">Nombre para mostrar</Label>
              <Input 
                id="displayName" 
                value={displayName} 
                onChange={(e) => setDisplayName(e.target.value)} 
                disabled={!isEditing || isSubmitting} 
                className="text-base mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-base">Correo Electrónico</Label>
              <Input 
                id="email" 
                type="email" 
                value={user.email || ''} 
                disabled 
                className="text-base mt-1 bg-muted/50" 
              />
            </div>
            {isEditing && (
              <>
                <div>
                  <Label htmlFor="photoURL" className="text-base flex items-center">
                    <ImageIcon className="mr-2 h-4 w-4 text-primary"/>
                    URL de la Foto de Perfil
                  </Label>
                  <Input 
                    id="photoURL" 
                    type="url"
                    value={newPhotoURL} 
                    onChange={(e) => setNewPhotoURL(e.target.value)} 
                    placeholder="https://ejemplo.com/tu-imagen.png"
                    className="text-base mt-1"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="newPassword" className="text-base flex items-center">
                    <KeyRound className="mr-2 h-4 w-4 text-primary"/>
                    Nueva Contraseña (opcional)
                  </Label>
                  <Input 
                    id="newPassword" 
                    type="password"
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    placeholder="Deja en blanco para no cambiar"
                    className="text-base mt-1"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="confirmNewPassword" className="text-base flex items-center">
                    <KeyRound className="mr-2 h-4 w-4 text-primary"/>
                    Confirmar Nueva Contraseña
                  </Label>
                  <Input 
                    id="confirmNewPassword" 
                    type="password"
                    value={confirmNewPassword} 
                    onChange={(e) => setConfirmNewPassword(e.target.value)} 
                    placeholder="Repite la nueva contraseña"
                    className="text-base mt-1"
                    disabled={!newPassword || isSubmitting}
                  />
                </div>
              </>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              {isEditing ? (
                <>
                  <Button type="submit" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSubmitting}>
                    {isSubmitting ? <LoadingSpinner size="sm"/> : <><Save className="mr-2 h-4 w-4" /> Guardar Cambios</>}
                  </Button>
                  <Button type="button" onClick={handleCancelEdit} variant="outline" className="w-full sm:w-auto" disabled={isSubmitting}>
                     Cancelar
                  </Button>
                </>
              ) : (
                <Button type="button" onClick={() => setIsEditing(true)} variant="outline" className="w-full sm:w-auto">
                  <Edit3 className="mr-2 h-4 w-4" /> Editar Perfil
                </Button>
              )}
              <Button onClick={logout} variant="destructive" className="w-full sm:w-auto sm:ml-auto" disabled={isSubmitting || authIsLoading}>
                <LogOut className="mr-2 h-4 w-4" /> Cerrar Sesión
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
