// src/components/Logo.tsx
import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <div className={cn('flex items-center justify-start', className)}>
      <Image
        src="/images/logo_codigo_full.png"
        alt="CÓDIGO Logo - Aquí empezamos desde 0 Inteligente"
        width={180} // Ajustado para un mejor aspecto en el sidebar
        height={45} // Ajustado para mantener la proporción
        priority
        className="object-contain"
      />
    </div>
  );
};

export default Logo;
