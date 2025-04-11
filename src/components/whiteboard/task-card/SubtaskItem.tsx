
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface SubtaskItemProps {
  id: string;
  text: string;
  completed: boolean;
  onChange: (id: string, text: string) => void;
  onToggle: (id: string, completed: boolean) => void;
  onRemove: (id: string) => void;
}

const SubtaskItem: React.FC<SubtaskItemProps> = ({
  id,
  text,
  completed,
  onChange,
  onToggle,
  onRemove
}) => {
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id={`subtask-${id}`}
        checked={completed}
        onCheckedChange={(checked) => onToggle(id, !!checked)}
      />
      <Input
        value={text}
        onChange={(e) => onChange(id, e.target.value)}
        placeholder="Subtask"
        className="flex-1"
      />
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => onRemove(id)}
      >
        <X size={14} />
      </Button>
    </div>
  );
};

export default SubtaskItem;
