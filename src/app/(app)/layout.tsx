// src/app/(app)/layout.tsx
import type { ReactNode } from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import AppLayoutClient from '@/components/layout/AppLayoutClient';

export default function AppRoutesLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <AppLayoutClient>
        {children}
      </AppLayoutClient>
    </AuthGuard>
  );
}
