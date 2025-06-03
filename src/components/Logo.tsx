// src/components/Logo.tsx
import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg'; // Added size prop
}

const Logo: React.FC<LogoProps> = ({ className, size = 'md' }) => {
  let width = 180;
  let height = 45; // Maintain 4:1 aspect ratio

  if (size === 'sm') {
    width = 120;
    height = 30;
  } else if (size === 'lg') {
    width = 240;
    height = 60;
  }
  // Default 'md' uses the initial width/height

  return (
    <div className={cn('flex items-center justify-start', className)}>
      <Image
        src="/images/logo_codigo_full.png"
        alt="CÓDIGO Logo - Aquí empezamos desde 0 Inteligente"
        width={width}
        height={height}
        priority
        className="object-contain"
      />
    </div>
  );
};

export default Logo;
