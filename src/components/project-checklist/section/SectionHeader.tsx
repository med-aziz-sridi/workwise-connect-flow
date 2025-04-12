
import React from 'react';
import { Pencil, Trash2, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SectionHeaderProps {
  title: string;
  dragHandleProps: any;
  onEdit: () => void;
  onDelete: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  dragHandleProps,
  onEdit,
  onDelete
}) => {
  return (
    <div
      {...dragHandleProps}
      className="p-4 font-semibold border-b flex justify-between items-center"
    >
      <span>{title}</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button 
            className="text-gray-400 hover:text-gray-600"
            aria-label="Section options"
          >
            <MoreVertical size={16} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={onDelete}
            className="text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
