
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Square,
  Circle,
  Pencil,
  StickyNote,
  CheckSquare,
  Move,
  ZoomIn,
  ZoomOut,
  Eraser,
  Type,
  Save,
  Undo,
  Redo,
  Trash2
} from 'lucide-react';

interface WhiteboardToolbarProps {
  activeTool: string;
  onToolSelect: (tool: string) => void;
  onAddShape: (type: 'rect' | 'circle') => void;
  onAddStickyNote: () => void;
  onAddTaskCard: () => void;
  onAddText: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onSave: () => void;
  onDelete: () => void;
  isSaving: boolean;
}

const WhiteboardToolbar: React.FC<WhiteboardToolbarProps> = ({
  activeTool,
  onToolSelect,
  onAddShape,
  onAddStickyNote,
  onAddTaskCard,
  onAddText,
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  onSave,
  onDelete,
  isSaving
}) => {
  return (
    <div className="flex flex-wrap gap-1 bg-white p-2 rounded-lg border shadow-sm">
      <div className="flex gap-1 items-center border-r pr-2 mr-2">
        <ToolButton 
          icon={<Move size={16} />}
          label="Select"
          active={activeTool === 'select'}
          onClick={() => onToolSelect('select')}
        />
        <ToolButton 
          icon={<Pencil size={16} />}
          label="Draw"
          active={activeTool === 'pencil'}
          onClick={() => onToolSelect('pencil')}
        />
        <ToolButton 
          icon={<Eraser size={16} />}
          label="Erase"
          active={activeTool === 'eraser'}
          onClick={() => onToolSelect('eraser')}
        />
      </div>
      
      <div className="flex gap-1 items-center border-r pr-2 mr-2">
        <ToolButton 
          icon={<Square size={16} />}
          label="Rectangle"
          onClick={() => onAddShape('rect')}
        />
        <ToolButton 
          icon={<Circle size={16} />}
          label="Circle"
          onClick={() => onAddShape('circle')}
        />
        <ToolButton 
          icon={<StickyNote size={16} />}
          label="Sticky Note"
          onClick={onAddStickyNote}
        />
        <ToolButton 
          icon={<CheckSquare size={16} />}
          label="Task Card"
          onClick={onAddTaskCard}
        />
        <ToolButton 
          icon={<Type size={16} />}
          label="Text"
          onClick={onAddText}
        />
      </div>
      
      <div className="flex gap-1 items-center border-r pr-2 mr-2">
        <ToolButton 
          icon={<ZoomIn size={16} />}
          label="Zoom In"
          onClick={onZoomIn}
        />
        <ToolButton 
          icon={<ZoomOut size={16} />}
          label="Zoom Out"
          onClick={onZoomOut}
        />
      </div>
      
      <div className="flex gap-1 items-center border-r pr-2 mr-2">
        <ToolButton 
          icon={<Undo size={16} />}
          label="Undo"
          onClick={onUndo}
        />
        <ToolButton 
          icon={<Redo size={16} />}
          label="Redo"
          onClick={onRedo}
        />
      </div>
      
      <div className="flex gap-1 items-center border-r pr-2 mr-2">
        <ToolButton 
          icon={<Trash2 size={16} />}
          label="Delete"
          onClick={onDelete}
        />
      </div>
      
      <div className="flex gap-1 items-center">
        <Button 
          size="sm" 
          className="h-8" 
          onClick={onSave}
          disabled={isSaving}
        >
          <Save size={16} className="mr-1" />
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </div>
  );
};

interface ToolButtonProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const ToolButton: React.FC<ToolButtonProps> = ({ icon, label, active, onClick }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button 
          variant={active ? "default" : "outline"} 
          size="sm" 
          className={`h-8 ${active ? '' : 'bg-white'}`}
          onClick={onClick}
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
};

export default WhiteboardToolbar;
