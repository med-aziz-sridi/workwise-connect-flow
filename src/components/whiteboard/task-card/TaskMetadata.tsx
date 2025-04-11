
import React from 'react';
import { Input } from '@/components/ui/input';
import { Calendar, UserCircle } from 'lucide-react';

interface TaskMetadataProps {
  dueDate: string;
  assignee: string;
  onDueDateChange: (date: string) => void;
  onAssigneeChange: (assignee: string) => void;
}

const TaskMetadata: React.FC<TaskMetadataProps> = ({
  dueDate,
  assignee,
  onDueDateChange,
  onAssigneeChange
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1">
        <label htmlFor="dueDate" className="text-sm font-medium flex items-center gap-1">
          <Calendar size={14} /> Due Date
        </label>
        <Input
          id="dueDate"
          type="date"
          value={dueDate}
          onChange={(e) => onDueDateChange(e.target.value)}
        />
      </div>
      
      <div className="space-y-1">
        <label htmlFor="assignee" className="text-sm font-medium flex items-center gap-1">
          <UserCircle size={14} /> Assignee
        </label>
        <Input
          id="assignee"
          value={assignee}
          onChange={(e) => onAssigneeChange(e.target.value)}
          placeholder="Assigned to"
        />
      </div>
    </div>
  );
};

export default TaskMetadata;
