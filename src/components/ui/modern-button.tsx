
import React from 'react';
import { cn } from '@/lib/utils';
import { Button, ButtonProps } from '@/components/ui/button';

interface ModernButtonProps extends ButtonProps {
  gradient?: boolean;
  rounded?: boolean;
  glow?: boolean;
  bouncy?: boolean;
}

export const ModernButton = React.forwardRef<HTMLButtonElement, ModernButtonProps>(
  ({ className, gradient, rounded, glow, bouncy, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          // Base styles
          'relative overflow-hidden transition-all duration-300',
          // Gradient styles
          gradient && 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0',
          // Rounded styles
          rounded && 'rounded-full',
          // Glow styles
          glow && 'shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:shadow-[0_0_25px_rgba(59,130,246,0.7)]',
          // Bouncy styles
          bouncy && 'active:scale-95',
          className
        )}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

ModernButton.displayName = 'ModernButton';
