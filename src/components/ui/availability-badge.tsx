
import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

interface AvailabilityBadgeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showButton?: boolean;
}

export const AvailabilityBadge: React.FC<AvailabilityBadgeProps> = ({ 
  className, 
  size = 'md',
  showButton = false
}) => {
  const { user, profile } = useAuth();
  const [isAvailable, setIsAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const sizeClasses = {
    sm: 'h-3.5 w-3.5',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  useEffect(() => {
    if (user && profile?.role === 'freelancer') {
      checkAvailability();
    }
  }, [user, profile]);

  const checkAvailability = async () => {
    try {
      setIsLoading(true);
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('available_until')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error checking availability:', error);
        return;
      }

      const availableUntil = data.available_until;
      const isCurrentlyAvailable = availableUntil ? new Date(availableUntil) > new Date() : false;
      
      setIsAvailable(isCurrentlyAvailable);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setAvailability = async () => {
    try {
      if (!user) return;

      // Set availability for the next 24 hours
      const tomorrow = new Date();
      tomorrow.setHours(tomorrow.getHours() + 24);

      const { error } = await supabase
        .from('profiles')
        .update({ available_until: tomorrow.toISOString() })
        .eq('id', user.id);

      if (error) {
        console.error('Error setting availability:', error);
        toast.error('Failed to update availability status');
        return;
      }

      setIsAvailable(true);
      toast.success('You are now marked as available for the next 24 hours');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong');
    }
  };

  if (!user || profile?.role !== 'freelancer') return null;
  if (isLoading) return null;

  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={cn('inline-flex', isAvailable ? 'text-green-500' : 'text-gray-400', className)}>
              <Clock className={cn(sizeClasses[size], isAvailable ? 'text-green-500' : 'text-gray-400')} />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm">
              {isAvailable ? 'Available for work' : 'Not currently available'}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {showButton && (
        <Button 
          variant="outline" 
          size="sm" 
          className={cn("h-6 px-2 text-xs", 
            isAvailable ? "bg-green-50 text-green-700 hover:bg-green-100" : "bg-gray-50"
          )}
          onClick={setAvailability}
          disabled={isAvailable}
        >
          {isAvailable ? 'Available' : 'Set Available'}
        </Button>
      )}
    </div>
  );
};
