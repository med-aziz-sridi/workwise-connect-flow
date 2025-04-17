
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// Create a new interface that doesn't extend HTMLAttributes
interface ModernCardProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  footer?: React.ReactNode;
  gradient?: boolean;
  hover?: boolean;
  variant?: 'default' | 'outline' | 'glass';
  children?: React.ReactNode;
  className?: string;
}

export const ModernCard = React.forwardRef<HTMLDivElement, ModernCardProps & React.HTMLAttributes<HTMLDivElement>>(
  ({ title, description, icon, footer, gradient, hover, variant = 'default', className, children, ...props }, ref) => {
    return (
      <Card 
        ref={ref}
        className={cn(
          'overflow-hidden border',
          hover && 'transition-all duration-300 hover:shadow-md hover:-translate-y-1',
          gradient && 'bg-gradient-to-br from-white via-white to-gray-50',
          variant === 'glass' && 'bg-white/80 backdrop-blur-sm border-white/20',
          variant === 'outline' && 'bg-background/50 border-border',
          className
        )}
        {...props}
      >
        {(title || description || icon) && (
          <CardHeader className={cn(
            'flex items-start gap-4',
            variant === 'glass' && 'border-b border-white/10'
          )}>
            {icon && (
              <div className="rounded-full p-2 w-10 h-10 flex items-center justify-center bg-primary/10 text-primary">
                {icon}
              </div>
            )}
            <div className="space-y-1">
              {title && <CardTitle>{title}</CardTitle>}
              {description && <CardDescription>{description}</CardDescription>}
            </div>
          </CardHeader>
        )}
        <CardContent className={!title && !description && !icon ? 'pt-6' : ''}>
          {children}
        </CardContent>
        {footer && <CardFooter>{footer}</CardFooter>}
      </Card>
    );
  }
);

ModernCard.displayName = 'ModernCard';
