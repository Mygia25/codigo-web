// src/components/Logo.tsx
import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface LogoProps { // Ensure export if not already
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ className, size = 'md' }) => {
  let width = 180;
  let height = 45; 
  let placeholderUrl = `https://placehold.co/${width}x${height}.png`;
  let altText = `CÓDIGO Logo size ${size}`;

  if (size === 'sm') {
    width = 120;
    height = 30;
    placeholderUrl = `https://placehold.co/${width}x${height}.png`;
  } else if (size === 'lg') {
    width = 240;
    height = 60;
    placeholderUrl = `https://placehold.co/${width}x${height}.png`;
  }
  // Default 'md' uses the initial width/height

  return (
    <div className={cn('flex items-center justify-start', className)}>
      <Image
        src={placeholderUrl} // Using placeholder
        alt={altText}
        width={width}
        height={height}
        priority // Keep priority if it's often above the fold
        className="object-contain"
        data-ai-hint="company logo" // Added AI hint for placeholder
      />
    </div>
  );
};

export default Logo;
