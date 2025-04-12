import React from 'react';
import { cn } from '@/lib/utils';
import { Task } from '@/components/project-checklist/ChecklistTabs';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  isOverlay?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onClick, 
  isOverlay 
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'p-4 bg-background rounded-lg border shadow-sm cursor-pointer',
        'hover:border-primary transition-colors',
        isOverlay && 'shadow-lg rotate-2 scale-105 opacity-80'
      )}
    >
      <h4 className="font-medium mb-2">{task.title}</h4>
      {task.description && (
        <p className="text-sm text-muted-foreground">
          {task.description}
        </p>
      )}
      {task.comments.length > 0 && (
        <div className="mt-2 text-xs text-muted-foreground">
          {task.comments.length} comments
        </div>
      )}
    </div>
  );
};