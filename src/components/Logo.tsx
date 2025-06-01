// src/components/Logo.tsx
import React from 'react';
import { Code2, Zap } from 'lucide-react'; // Or Sigma, or other relevant icon

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', className }) => {
  const sizeClasses = {
    sm: 'h-8 w-8', // Icon size
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };
  const textSizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Code2 className={`${sizeClasses[size]} text-primary`} />
      <div className="flex flex-col">
        <span className={`font-headline font-bold leading-tight text-primary ${textSizeClasses[size]}`}>
          CÓDIGO
        </span>
        <span className="text-xs text-muted-foreground -mt-1">Tu Start Inteligente</span>
      </div>
    </div>
  );
};

export default Logo;
