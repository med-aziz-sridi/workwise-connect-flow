
import React from 'react';
import { cn } from '@/lib/utils';

// Create a new interface that doesn't have conflicting types
interface SectionProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  titleClassName?: string;
  subtitleClassName?: string;
  headerClassName?: string;
  action?: React.ReactNode;
  divided?: boolean;
  gradient?: boolean;
  className?: string;
}

export const Section = React.forwardRef<HTMLDivElement, SectionProps & Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>>(
  ({ 
    className, 
    children, 
    title, 
    subtitle, 
    titleClassName, 
    subtitleClassName, 
    headerClassName, 
    action, 
    divided = false,
    gradient = false,
    ...props 
  }, ref) => {
    return (
      <section
        ref={ref}
        className={cn(
          'w-full py-6 md:py-8',
          gradient && 'bg-gradient-to-br from-white via-white to-gray-50',
          className
        )}
        {...props}
      >
        {(title || subtitle || action) && (
          <div className={cn(
            'flex flex-col sm:flex-row sm:items-center justify-between mb-6',
            headerClassName
          )}>
            <div>
              {title && (
                <h2 className={cn(
                  'text-2xl font-bold tracking-tight',
                  titleClassName
                )}>
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className={cn(
                  'mt-1 text-muted-foreground',
                  subtitleClassName
                )}>
                  {subtitle}
                </p>
              )}
            </div>
            {action && (
              <div className="mt-4 sm:mt-0">
                {action}
              </div>
            )}
          </div>
        )}
        
        {divided && <div className="h-px bg-gray-200 my-6" />}
        
        <div>
          {children}
        </div>
      </section>
    );
  }
);

Section.displayName = 'Section';
