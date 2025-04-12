
import React from 'react';
import { cn } from '@/lib/utils';
import { Task } from '@/types/task';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, MessageCircle } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  isOverlay?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onClick, 
  isOverlay,
  onEdit,
  onDelete
}) => {
  return (
    <div
      className={cn(
        'relative p-4 bg-background rounded-lg border shadow-sm',
        'hover:border-primary transition-colors',
        isOverlay && 'shadow-lg rotate-2 scale-105 opacity-80',
        onClick && 'cursor-pointer'
      )}
    >
      {/* Add dropdown menu with edit and delete options */}
      {(onEdit || onDelete) && (
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-slate-100">
              <MoreVertical size={16} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onEdit && <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>}
              {onDelete && <DropdownMenuItem onClick={onDelete} className="text-red-600">Delete</DropdownMenuItem>}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Task content */}
      <div onClick={onClick}>
        <h4 className="font-medium mb-2 pr-6">{task.title}</h4>
        
        {task.description && (
          <p className="text-sm text-muted-foreground mb-3">
            {task.description}
          </p>
        )}
        
        {/* Tags display */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {task.tags.map((tag, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        {/* Comments count */}
        {task.comments && task.comments.length > 0 && (
          <div className="flex items-center text-xs text-muted-foreground">
            <MessageCircle size={12} className="mr-1" />
            {task.comments.length} comment{task.comments.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
};
