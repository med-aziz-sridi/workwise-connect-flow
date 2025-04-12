
import React, { useEffect } from 'react';
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
  Plus,
  Minus,
  ArrowRight
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
  onAddLine: (isArrow: boolean) => void;
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
  onAddLine,
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  onSave,
  onDelete,
  onToggleWhiteboardMode,
  isSaving
}) => {
  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only process shortcuts when not in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      switch (e.key) {
        case 'v': case 'V': // Select tool
          onToolSelect('select');
          break;
        case 'p': case 'P': // Pencil tool
          onToolSelect('pencil');
          break;
        case 'e': case 'E': // Eraser tool
          onToolSelect('eraser');
          break;
        case 'r': case 'R': // Rectangle
          onAddShape('rect');
          break;
        case 'c': case 'C': // Circle
          onAddShape('circle');
          break;
        case 's': case 'S': // Sticky note
          if (!e.ctrlKey && !e.metaKey) { // Avoid conflict with save shortcut
            onAddStickyNote();
          }
          break;
        case 't': case 'T': // Text
          onAddText();
          break;
        case 'l': case 'L': // Line
          onAddLine(false);
          break;
        case 'a': case 'A': // Arrow
          if (!e.ctrlKey && !e.metaKey) { // Avoid conflict with select all
            onAddLine(true);
          }
          break;
        case 'z': // Undo
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            onUndo();
          }
          break;
        case 'y': // Redo
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            onRedo();
          }
          break;
        case 'Delete': case 'Backspace': // Delete
          if (document.activeElement === document.body) { // Only if no input is focused
            e.preventDefault();
            onDelete();
          }
          break;
        case '+': // Zoom in
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            onZoomIn();
          }
          break;
        case '-': // Zoom out
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            onZoomOut();
          }
          break;
        case 's': // Save
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            onSave();
          }
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    onToolSelect, onAddShape, onAddStickyNote, onAddText, onAddLine,
    onUndo, onRedo, onDelete, onZoomIn, onZoomOut, onSave
  ]);

  return (
    <div className="flex flex-wrap gap-2 bg-white p-2 rounded-lg border shadow-sm mx-4 mt-4">
      {/* Selection Tools Group */}
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

      {/* Creation Tools Group */}
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
          label="Zoom In (Ctrl/⌘+)"
          onClick={onZoomIn}
        />
        <ToolButton 
          icon={<ZoomOut size={16} />}
          label="Zoom Out (Ctrl/⌘-)"
          onClick={onZoomOut}
        />
      </div>

      {/* History Tools Group */}
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

      {/* Action Tools Group */}
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
