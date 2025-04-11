
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TaskFormProps {
  title: string;
  description: string;
  section?: string;
  availableSections?: string[];
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onSectionChange?: (section: string) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({
  title,
  description,
  section,
  availableSections = [],
  onTitleChange,
  onDescriptionChange,
  onSectionChange
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

      {onSectionChange && availableSections.length > 0 && (
        <div className="space-y-1">
          <label htmlFor="section" className="text-sm font-medium">Section</label>
          <Select 
            value={section} 
            onValueChange={onSectionChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a section" />
            </SelectTrigger>
            <SelectContent>
              {availableSections.map((sectionName) => (
                <SelectItem key={sectionName} value={sectionName}>
                  {sectionName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </>
  );
};

export default TaskForm;
