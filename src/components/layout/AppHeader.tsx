// src/components/layout/AppHeader.tsx
"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, LogOut, UserCircle, Settings, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useAuth } from '@/hooks/useAuth';
import Logo from '@/components/Logo';
import { usePathname } from 'next/navigation';
import { type NavItem, navItems } from './SidebarNav'; // Assuming SidebarNav exports navItems

interface AppHeaderProps {
  pageTitle?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({ pageTitle }) => {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const getPageTitle = () => {
    if(pageTitle) return pageTitle;
    const currentNavItem = navItems.find(item => pathname.startsWith(item.href));
    return currentNavItem ? currentNavItem.label : "CÓDIGO";
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Abrir menú</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col p-0 bg-sidebar">
            <div className="p-4 border-b border-sidebar-border">
              <Logo size="md" />
            </div>
            <nav className="flex-grow grid gap-2 text-lg font-medium p-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary hover:bg-sidebar-accent ${pathname.startsWith(item.href) ? 'bg-sidebar-accent text-primary' : 'text-sidebar-foreground'}`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-auto p-4 border-t border-sidebar-border">
                <Button variant="ghost" onClick={logout} className="w-full justify-start text-sidebar-foreground hover:text-primary hover:bg-sidebar-accent">
                    <LogOut className="mr-2 h-5 w-5" />
                    Cerrar Sesión
                </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex-1">
        <h1 className="font-headline text-xl md:text-2xl text-foreground">{getPageTitle()}</h1>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user?.photoURL ?? "https://placehold.co/100x100.png"} alt={user?.name ?? "Usuario"} data-ai-hint="profile avatar" />
              <AvatarFallback>{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
            </Avatar>
            <span className="sr-only">Menú de usuario</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user?.name ?? 'Usuario'}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email ?? 'usuario@ejemplo.com'}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/perfil">
              <UserCircle className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <Settings className="mr-2 h-4 w-4" />
            <span>Configuración</span>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>Ayuda</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-700/20 dark:focus:text-red-500">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Cerrar Sesión</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default AppHeader;
