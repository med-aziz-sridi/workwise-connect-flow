
import React from 'react';
import { Button } from '@/components/ui/button';
import SubtaskItem from './SubtaskItem';

interface SubTask {
  id: string;
  text: string;
  completed: boolean;
}

interface SubtaskListProps {
  subtasks: SubTask[];
  onAddSubtask: () => void;
  onChangeSubtask: (id: string, text: string) => void;
  onToggleSubtask: (id: string, completed: boolean) => void;
  onRemoveSubtask: (id: string) => void;
}

const SubtaskList: React.FC<SubtaskListProps> = ({
  subtasks,
  onAddSubtask,
  onChangeSubtask,
  onToggleSubtask,
  onRemoveSubtask
}) => {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">Subtasks</label>
      <div className="space-y-2">
        {subtasks.map((subtask) => (
          <SubtaskItem
            key={subtask.id}
            id={subtask.id}
            text={subtask.text}
            completed={subtask.completed}
            onChange={onChangeSubtask}
            onToggle={onToggleSubtask}
            onRemove={onRemoveSubtask}
          />
        ))}
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full" 
          onClick={onAddSubtask}
        >
          Add Subtask
        </Button>
      </div>
    </div>
  );
};

export default SubtaskList;
