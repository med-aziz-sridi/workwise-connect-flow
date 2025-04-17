
import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

type ModernBadgeVariant = 
  | 'default'
  | 'outline'
  | 'soft'
  | 'pill'
  | 'dot';

// Create a new interface that doesn't extend BadgeProps directly
interface ModernBadgeProps {
  variant?: ModernBadgeVariant;
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  icon?: React.ReactNode;
  dotColor?: string;
  className?: string;
  children?: React.ReactNode;
}

const colorStyles = {
  default: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
  primary: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  secondary: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
  success: 'bg-green-100 text-green-800 hover:bg-green-200',
  warning: 'bg-amber-100 text-amber-800 hover:bg-amber-200',
  danger: 'bg-red-100 text-red-800 hover:bg-red-200',
  info: 'bg-cyan-100 text-cyan-800 hover:bg-cyan-200',
};

const outlineStyles = {
  default: 'border-gray-300 text-gray-800',
  primary: 'border-blue-300 text-blue-800',
  secondary: 'border-purple-300 text-purple-800',
  success: 'border-green-300 text-green-800',
  warning: 'border-amber-300 text-amber-800',
  danger: 'border-red-300 text-red-800',
  info: 'border-cyan-300 text-cyan-800',
};

export const ModernBadge = React.forwardRef<HTMLDivElement, ModernBadgeProps>(
  ({ className, variant = 'default', color = 'default', icon, dotColor, children, ...props }, ref) => {
    const variantClassNames = {
      default: cn(colorStyles[color]),
      outline: cn('bg-transparent border', outlineStyles[color]),
      soft: cn(colorStyles[color], 'opacity-80'),
      pill: cn(colorStyles[color], 'rounded-full px-3'),
      dot: cn('bg-white border border-gray-200 text-gray-700 pl-2.5'),
    };
    
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1 font-medium',
          variantClassNames[variant],
          className
        )}
        {...props}
      >
        {variant === 'dot' && (
          <span 
            className={cn(
              'w-1.5 h-1.5 rounded-full -ml-1', 
              dotColor || (color === 'default' ? 'bg-gray-500' : `bg-${color}-500`)
            )} 
          />
        )}
        {icon && <span className="mr-1">{icon}</span>}
        {children}
      </div>
    );
  }
);

ModernBadge.displayName = 'ModernBadge';
