
import { useState } from 'react';
import { fabric } from 'fabric';
import { useWhiteboardShapes } from './useWhiteboardShapes';
import { useWhiteboardNavigation } from './useWhiteboardNavigation';
import { useWhiteboardMode } from './useWhiteboardMode';
import { useWhiteboardStorage } from './useWhiteboardStorage';

export function useWhiteboardTools(
  projectId?: string,
  canvas: fabric.Canvas | null = null,
  canvasHistory: string[] = [],
  historyIndex: number = -1,
  setHistoryIndex: (index: number) => void = () => {}
) {
  const [activeTool, setActiveTool] = useState<string>('select');

  // Handle tool selection
  const handleToolSelect = (tool: string) => {
    if (!canvas) return;
    
    setActiveTool(tool);
    
    // Disable fabric.js object selection when in drawing mode
    canvas.isDrawingMode = tool === 'pencil' || tool === 'eraser';
    
    // Configure brush for different drawing tools
    if (tool === 'pencil') {
      canvas.freeDrawingBrush.color = '#000000';
      canvas.freeDrawingBrush.width = 2;
    } else if (tool === 'eraser') {
      canvas.freeDrawingBrush.color = '#f8f9fa'; // Same as background
      canvas.freeDrawingBrush.width = 10;
    }
  };

  // Import functionality from smaller hooks
  const shapes = useWhiteboardShapes(canvas);
  const navigation = useWhiteboardNavigation(canvas, canvasHistory, historyIndex, setHistoryIndex);
  const modeControls = useWhiteboardMode(canvas);
  const storage = useWhiteboardStorage(projectId, canvas);

  return {
    activeTool,
    whiteboardMode: modeControls.whiteboardMode,
    isSaving: storage.isSaving,
    handleToolSelect,
    ...shapes,
    ...navigation,
    ...modeControls,
    ...storage
  };
}

export default useWhiteboardTools;
