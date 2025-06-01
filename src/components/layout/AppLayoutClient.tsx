// src/components/layout/AppLayoutClient.tsx
"use client";

import React, { useState, useEffect } from 'react';
import AppSidebar from './AppSidebar';
import AppHeader from './AppHeader';
import { cn } from "@/lib/utils";

interface AppLayoutClientProps {
  children: React.ReactNode;
}

const AppLayoutClient: React.FC<AppLayoutClientProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false); // Default to true (collapsed) or false based on preference
  
  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth < 768) { // md breakpoint
        setIsCollapsed(true);
      }
    };
    checkMobile(); // Initial check
    // Optionally, add resize listener if dynamic collapse on resize is needed
    // window.addEventListener('resize', checkMobile);
    // return () => window.removeEventListener('resize', checkMobile);
  }, []);


  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className={cn("flex flex-col flex-1 transition-all duration-300 ease-in-out", 
                          isCollapsed ? "md:ml-16" : "md:ml-64")}>
        <AppHeader />
        <main className="flex-1 py-4 pr-4 pl-2 sm:py-6 sm:pr-6 sm:pl-3 lg:py-8 lg:pr-8 lg:pl-4 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayoutClient;
