
import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary' | 'secondary';
  label?: string;
}

export const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ size = 'md', variant = 'default', label, className, ...props }, ref) => {
    const sizeClasses = {
      xs: 'h-3 w-3 border-[2px]',
      sm: 'h-4 w-4 border-[2px]',
      md: 'h-6 w-6 border-[3px]',
      lg: 'h-8 w-8 border-[3px]',
    };
    
    const variantClasses = {
      default: 'border-gray-300 border-t-gray-600',
      primary: 'border-primary/30 border-t-primary',
      secondary: 'border-secondary/30 border-t-secondary',
    };
    
    return (
      <div ref={ref} className={cn('flex flex-col items-center', className)} {...props}>
        <div
          className={cn(
            'animate-spin rounded-full',
            sizeClasses[size],
            variantClasses[variant]
          )}
        />
        {label && (
          <span className="mt-2 text-sm text-gray-500">{label}</span>
        )}
      </div>
    );
  }
);

LoadingSpinner.displayName = 'LoadingSpinner';
