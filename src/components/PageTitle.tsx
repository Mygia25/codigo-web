// src/components/PageTitle.tsx
import React from 'react';

interface PageTitleProps {
  title: string;
  description?: string;
  className?: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ title, description, className }) => {
  return (
    <div className={`mb-6 sm:mb-8 ${className}`}>
      <h1 className="font-headline text-3xl sm:text-4xl font-bold text-foreground">{title}</h1>
      {description && (
        <p className="mt-1 text-base sm:text-lg text-muted-foreground">{description}</p>
      )}
    </div>
  );
};

export default PageTitle;
