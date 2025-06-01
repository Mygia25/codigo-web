// src/components/layout/SidebarNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  LayoutDashboard,
  MessageCircle,
  BookOpen,
  DraftingCompass,
  Network,
  Bot,
  type LucideIcon,
  FileSignature
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  disabled?: boolean;
}

export const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/agente-ia", label: "Agente IA", icon: Bot },
  { href: "/ruta-aprendizaje", label: "Ruta de Aprendizaje", icon: BookOpen },
  { href: "/generar-curso", label: "Generar Curso", icon: FileSignature },
  { href: "/ecosistema", label: "Ecosistema Digital", icon: Network },
];

interface SidebarNavProps {
  isCollapsed: boolean;
}

export function SidebarNav({ isCollapsed }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={0}>
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {navItems.map((item) =>
          isCollapsed ? (
            <Tooltip key={item.href} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href={item.disabled ? "#" : item.href}
                  className={cn(
                    buttonVariants({ variant: pathname.startsWith(item.href) ? "default" : "ghost", size: "icon" }),
                    "h-10 w-10",
                    pathname.startsWith(item.href) &&
                      "bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90",
                    item.disabled && "pointer-events-none opacity-50"
                  )}
                  aria-disabled={item.disabled}
                  tabIndex={item.disabled ? -1 : undefined}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="sr-only">{item.label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4 bg-popover text-popover-foreground border-border">
                {item.label}
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              key={item.href}
              href={item.disabled ? "#" : item.href}
              className={cn(
                buttonVariants({ variant: pathname.startsWith(item.href) ? "default" : "ghost", size: "default" }),
                "justify-start h-10 text-base",
                 pathname.startsWith(item.href) &&
                  "bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90",
                item.disabled && "pointer-events-none opacity-50"
              )}
              aria-disabled={item.disabled}
              tabIndex={item.disabled ? -1 : undefined}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.label}
            </Link>
          )
        )}
      </nav>
    </TooltipProvider>
  );
}
