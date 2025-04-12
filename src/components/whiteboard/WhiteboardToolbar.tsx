
import React from 'react';
import { 
  SelectionTools, 
  CreationTools, 
  WorkspaceTools, 
  ViewTools, 
  HistoryTools,
  ActionTools 
} from './toolbar/ToolGroups';
import { useKeyboardShortcuts } from './toolbar/KeyboardShortcuts';

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

const WhiteboardToolbar: React.FC<WhiteboardToolbarProps> = (props) => {
  // Set up keyboard shortcuts
  useKeyboardShortcuts({
    onToolSelect: props.onToolSelect,
    onAddShape: props.onAddShape,
    onAddStickyNote: props.onAddStickyNote,
    onAddText: props.onAddText,
    onAddLine: props.onAddLine,
    onUndo: props.onUndo,
    onRedo: props.onRedo,
    onDelete: props.onDelete,
    onZoomIn: props.onZoomIn,
    onZoomOut: props.onZoomOut,
    onSave: props.onSave
  });

  return (
    <div className="flex flex-wrap gap-2 bg-white p-2 rounded-lg border shadow-sm mx-4 mt-4">
      <SelectionTools 
        activeTool={props.activeTool} 
        onToolSelect={props.onToolSelect} 
      />

      <CreationTools 
        onAddShape={props.onAddShape}
        onAddStickyNote={props.onAddStickyNote}
        onAddText={props.onAddText}
        onAddLine={props.onAddLine}
      />

      <WorkspaceTools 
        whiteboardMode={props.whiteboardMode}
        onAddSection={props.onAddSection}
        onToggleWhiteboardMode={props.onToggleWhiteboardMode}
      />

      <ViewTools 
        onZoomIn={props.onZoomIn}
        onZoomOut={props.onZoomOut}
      />

      <HistoryTools 
        onUndo={props.onUndo}
        onRedo={props.onRedo}
      />

      <ActionTools 
        onDelete={props.onDelete}
        onSave={props.onSave}
        isSaving={props.isSaving}
      />
    </div>
  );
};

export default WhiteboardToolbar;
