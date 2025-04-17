
import React from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export interface AvatarData {
  src?: string;
  name: string;
  fallback?: string;
}

interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  avatars: AvatarData[];
  max?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ avatars, max = 4, size = 'md', className, ...props }, ref) => {
    const displayAvatars = avatars.slice(0, max);
    const remainingCount = avatars.length - max;
    
    const sizeClasses = {
      sm: 'h-8 w-8 text-xs',
      md: 'h-10 w-10 text-sm',
      lg: 'h-12 w-12 text-base',
    };
    
    const getInitials = (name: string) => {
      return name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    };
    
    return (
      <div
        ref={ref}
        className={cn('flex -space-x-2', className)}
        {...props}
      >
        {displayAvatars.map((avatar, index) => (
          <Avatar
            key={index}
            className={cn(
              sizeClasses[size],
              'border-2 border-background',
              'transition-transform hover:translate-y-[-5px]'
            )}
          >
            <AvatarImage src={avatar.src} alt={avatar.name} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
              {avatar.fallback || getInitials(avatar.name)}
            </AvatarFallback>
          </Avatar>
        ))}
        
        {remainingCount > 0 && (
          <div
            className={cn(
              sizeClasses[size],
              'rounded-full bg-gray-100 border-2 border-background flex items-center justify-center',
              'transition-transform hover:translate-y-[-5px]'
            )}
          >
            <span className="text-gray-600 font-medium">+{remainingCount}</span>
          </div>
        )}
      </div>
    );
  }
);

AvatarGroup.displayName = 'AvatarGroup';
