// src/app/auth/signin/page.tsx
import { Suspense } from 'react';
import SigninInner from './SigninInner'; // Using relative import
import LoadingSpinner from '@/components/LoadingSpinner';

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><LoadingSpinner text="Cargando autenticación..." size="lg"/></div>}>
      <SigninInner />
    </Suspense>
  );
}
