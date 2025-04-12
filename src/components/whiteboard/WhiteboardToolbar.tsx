import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';
import {
  Square,
  Circle,
  Pencil,
  StickyNote,
  Move,
  ZoomIn,
  ZoomOut,
  Eraser,
  Type,
  Save,
  Undo,
  Redo,
  Trash2,
  Layout,
  Plus
} from 'lucide-react';
import { Label } from '@/components/ui/label';

interface WhiteboardToolbarProps {
  activeTool: string;
  whiteboardMode: 'default' | 'blank';
  onToolSelect: (tool: string) => void;
  onAddShape: (type: 'rect' | 'circle') => void;
  onAddStickyNote: () => void;
  onAddText: () => void;
  onAddSection: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onSave: () => void;
  onDelete: () => void;
  onToggleWhiteboardMode: () => void;
  isSaving: boolean;
}

const WhiteboardToolbar: React.FC<WhiteboardToolbarProps> = ({
  activeTool,
  whiteboardMode,
  onToolSelect,
  onAddShape,
  onAddStickyNote,
  onAddText,
  onAddSection,
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  onSave,
  onDelete,
  onToggleWhiteboardMode,
  isSaving
}) => {
  return (
    <div className="flex flex-wrap gap-2 bg-white p-2 rounded-lg border shadow-sm mx-4 mt-4">
      {/* Selection Tools Group */}
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

      {/* Creation Tools Group */}
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
          icon={<Type size={16} />}
          label="Text"
          onClick={onAddText}
        />
      </div>

      {/* Workspace Tools Group */}
      <div className="flex gap-1 items-center border-r pr-2 mr-2">
        <ToolButton 
          icon={<Plus size={16} />}
          label="Add Section"
          onClick={onAddSection}
        />
        <div className="flex items-center space-x-2 ml-1">
          <Switch
            id="whiteboard-mode"
            checked={whiteboardMode === 'default'}
            onCheckedChange={onToggleWhiteboardMode}
            className="data-[state=checked]:bg-blue-600"
          />
          <Label htmlFor="whiteboard-mode" className="text-xs font-medium text-gray-600">
            {whiteboardMode === 'default' ? 'Template' : 'Freeform'}
          </Label>
        </div>
      </div>

      {/* View Tools Group */}
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

      {/* History Tools Group */}
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

      {/* Action Tools Group */}
      <div className="flex gap-1 items-center">
        <ToolButton 
          icon={<Trash2 size={16} />}
          label="Delete"
          onClick={onDelete}
        />
        <Button 
          size="sm" 
          className="h-8 bg-blue-600 hover:bg-blue-700 text-white"
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
          className={`h-8 ${active ? 'bg-blue-600 hover:bg-blue-700' : 'bg-white hover:bg-gray-50'}`}
          onClick={onClick}
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs font-medium">
        {label}
      </TooltipContent>
    </Tooltip>
  );
};

export default WhiteboardToolbar;