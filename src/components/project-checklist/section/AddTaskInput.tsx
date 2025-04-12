
import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface AddTaskInputProps {
  sectionId: string;
  value: string;
  onChange: (value: string) => void;
  onAddTask: () => void;
}

export const AddTaskInput: React.FC<AddTaskInputProps> = ({
  sectionId,
  value,
  onChange,
  onAddTask
}) => {
  return (
    <div className="mt-2 p-2">
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Add a task"
          onKeyPress={(e) => e.key === 'Enter' && onAddTask()}
          aria-label="Add new task input"
        />
        <Button
          size="sm"
          variant="ghost"
          onClick={onAddTask}
          aria-label="Add task button"
          disabled={!value?.trim()}
        >
          <PlusCircle size={16} />
        </Button>
      </div>
    </div>
  );
};
