
import React from 'react';
import { BadgeCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

interface VerificationBadgeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  tooltip?: string;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({ 
  className, 
  size = 'md',
  tooltip = 'Verified Account'
}) => {
  const sizeClasses = {
    sm: 'h-3.5 w-3.5',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn('inline-flex text-blue-500', className)}>
            <BadgeCheck className={cn(sizeClasses[size], 'text-blue-500')} />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
