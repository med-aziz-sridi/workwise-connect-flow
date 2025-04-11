
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface TaskFormProps {
  title: string;
  description: string;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({
  title,
  description,
  onTitleChange,
  onDescriptionChange
}) => {
  return (
    <>
      <div className="space-y-1">
        <label htmlFor="title" className="text-sm font-medium">Title</label>
        <Input
          id="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Task title"
        />
      </div>
      
      <div className="space-y-1">
        <label htmlFor="description" className="text-sm font-medium">Description</label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Task description"
          rows={3}
        />
      </div>
    </>
  );
};

export default TaskForm;
