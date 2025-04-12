
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ToolButtonProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

export const ToolButton: React.FC<ToolButtonProps> = ({ 
  icon, 
  label, 
  active, 
  onClick 
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button 
          variant={active ? "default" : "outline"} 
          size="sm" 
          className={`h-8 ${active ? 'bg-blue-600 hover:bg-blue-700' : 'bg-white hover:bg-gray-50'}`}
          onClick={onClick}
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs font-medium">
        {label}
      </TooltipContent>
    </Tooltip>
  );
};
