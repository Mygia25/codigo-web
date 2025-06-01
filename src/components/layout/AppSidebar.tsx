// src/components/layout/AppSidebar.tsx
"use client";

import React from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LogOut, UserCircle, ChevronsLeft, ChevronsRight } from "lucide-react";
import Logo from '@/components/Logo';
import { SidebarNav } from './SidebarNav';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

interface AppSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const { user, logout } = useAuth();

  return (
    <div
      className={cn(
        "hidden md:flex flex-col h-full bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div
        className={cn(
          "flex items-center border-b border-sidebar-border p-4 transition-all duration-300 ease-in-out",
          isCollapsed ? "justify-center h-16" : "h-16"
        )}
      >
        {!isCollapsed && <Logo size="md" />}
      </div>

      <div className="flex-grow py-4 overflow-y-auto">
        <SidebarNav isCollapsed={isCollapsed} />
      </div>

      <div className={cn("border-t border-sidebar-border p-2 transition-all duration-300 ease-in-out", isCollapsed ? "py-2" : "py-3")}>
        {!isCollapsed && user && (
          <Link href="/perfil">
            <Button variant="ghost" className="w-full justify-start mb-1 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
              <UserCircle className="mr-2 h-5 w-5" />
              <span>{user.name || 'Perfil'}</span>
            </Button>
          </Link>
        )}
         {!isCollapsed && (
             <Button variant="ghost" onClick={logout} className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                <LogOut className="mr-2 h-5 w-5" />
                Cerrar Sesión
             </Button>
         )}
         {isCollapsed && (
            <Button variant="ghost" size="icon" onClick={logout} className="w-full text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Cerrar Sesión</span>
            </Button>
         )}
      </div>
      <Button
          onClick={() => setIsCollapsed(!isCollapsed)}
          variant="ghost"
          size="icon"
          className="absolute -right-4 top-1/2 -translate-y-1/2 hidden md:flex bg-background hover:bg-muted border rounded-full h-8 w-8 z-10"
          aria-label={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
        >
          {isCollapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
      </Button>
    </div>
  );
};

export default AppSidebar;
