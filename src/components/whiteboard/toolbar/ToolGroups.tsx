
import React from 'react';
import { ToolButton } from './ToolButton';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
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
  Plus,
  Minus,
  ArrowRight
} from 'lucide-react';

interface SelectionToolsProps {
  activeTool: string;
  onToolSelect: (tool: string) => void;
}

export const SelectionTools: React.FC<SelectionToolsProps> = ({ activeTool, onToolSelect }) => (
  <div className="flex gap-1 items-center border-r pr-2 mr-2">
    <ToolButton 
      icon={<Move size={16} />}
      label="Select (V)"
      active={activeTool === 'select'}
      onClick={() => onToolSelect('select')}
    />
    <ToolButton 
      icon={<Pencil size={16} />}
      label="Draw (P)"
      active={activeTool === 'pencil'}
      onClick={() => onToolSelect('pencil')}
    />
    <ToolButton 
      icon={<Eraser size={16} />}
      label="Erase (E)"
      active={activeTool === 'eraser'}
      onClick={() => onToolSelect('eraser')}
    />
  </div>
);

interface CreationToolsProps {
  onAddShape: (type: 'rect' | 'circle') => void;
  onAddStickyNote: () => void;
  onAddText: () => void;
  onAddLine: (isArrow: boolean) => void;
}

export const CreationTools: React.FC<CreationToolsProps> = ({ 
  onAddShape, 
  onAddStickyNote, 
  onAddText, 
  onAddLine 
}) => (
  <div className="flex gap-1 items-center border-r pr-2 mr-2">
    <ToolButton 
      icon={<Square size={16} />}
      label="Rectangle (R)"
      onClick={() => onAddShape('rect')}
    />
    <ToolButton 
      icon={<Circle size={16} />}
      label="Circle (C)"
      onClick={() => onAddShape('circle')}
    />
    <ToolButton 
      icon={<StickyNote size={16} />}
      label="Sticky Note (S)"
      onClick={onAddStickyNote}
    />
    <ToolButton 
      icon={<Type size={16} />}
      label="Text (T)"
      onClick={onAddText}
    />
    <ToolButton 
      icon={<Minus size={16} />}
      label="Line (L)"
      onClick={() => onAddLine(false)}
    />
    <ToolButton 
      icon={<ArrowRight size={16} />}
      label="Arrow (A)"
      onClick={() => onAddLine(true)}
    />
  </div>
);

interface WorkspaceToolsProps {
  whiteboardMode: 'default' | 'blank';
  onAddSection: () => void;
  onToggleWhiteboardMode: () => void;
}

export const WorkspaceTools: React.FC<WorkspaceToolsProps> = ({
  whiteboardMode,
  onAddSection,
  onToggleWhiteboardMode
}) => (
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
);

interface ViewToolsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export const ViewTools: React.FC<ViewToolsProps> = ({ onZoomIn, onZoomOut }) => (
  <div className="flex gap-1 items-center border-r pr-2 mr-2">
    <ToolButton 
      icon={<ZoomIn size={16} />}
      label="Zoom In (Ctrl/⌘+)"
      onClick={onZoomIn}
    />
    <ToolButton 
      icon={<ZoomOut size={16} />}
      label="Zoom Out (Ctrl/⌘-)"
      onClick={onZoomOut}
    />
  </div>
);

interface HistoryToolsProps {
  onUndo: () => void;
  onRedo: () => void;
}

export const HistoryTools: React.FC<HistoryToolsProps> = ({ onUndo, onRedo }) => (
  <div className="flex gap-1 items-center border-r pr-2 mr-2">
    <ToolButton 
      icon={<Undo size={16} />}
      label="Undo (Ctrl/⌘Z)"
      onClick={onUndo}
    />
    <ToolButton 
      icon={<Redo size={16} />}
      label="Redo (Ctrl/⌘Y)"
      onClick={onRedo}
    />
  </div>
);

interface ActionToolsProps {
  onDelete: () => void;
  onSave: () => void;
  isSaving: boolean;
}

export const ActionTools: React.FC<ActionToolsProps> = ({ onDelete, onSave, isSaving }) => (
  <div className="flex gap-1 items-center">
    <ToolButton 
      icon={<Trash2 size={16} />}
      label="Delete (Del)"
      onClick={onDelete}
    />
    <Button 
      size="sm" 
      className="h-8 bg-blue-600 hover:bg-blue-700 text-white"
      onClick={onSave}
      disabled={isSaving}
    >
      <Save size={16} className="mr-1" />
      {isSaving ? 'Saving...' : 'Save (Ctrl/⌘S)'}
    </Button>
  </div>
);
