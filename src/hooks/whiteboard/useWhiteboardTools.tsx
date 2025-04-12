
import { useState, useCallback, useRef } from 'react';
import { fabric } from 'fabric';
import { toast } from 'sonner';
import { useWhiteboardMode } from './useWhiteboardMode';
import { useWhiteboardShapes } from './useWhiteboardShapes'; 
import { useWhiteboardNavigation } from './useWhiteboardNavigation';
import { useWhiteboardStorage } from './useWhiteboardStorage';

export const useWhiteboardTools = (projectId: string) => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentMode, setCurrentMode] = useState('select');
  const [canvasHistory, setCanvasHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [canvasChanged, setCanvasChanged] = useState(false);

  // Get functionality from all the whiteboard hooks
  const { whiteboardMode, toggleWhiteboardMode } = useWhiteboardMode(canvas);
  
  const {
    handleAddShape,
    handleAddStickyNote,
    handleAddTaskCard,
    handleAddText,
    handleAddSection,
    handleAddLine
  } = useWhiteboardShapes(canvas);

  const {
    handleUndo,
    handleRedo,
    handleZoomIn,
    handleZoomOut,
    deleteSelectedObject
  } = useWhiteboardNavigation(canvas, canvasHistory, historyIndex, setHistoryIndex);

  const {
    isSaving,
    saveWhiteboardToDatabase,
    loadWhiteboardFromDatabase
  } = useWhiteboardStorage(projectId, canvas);

  // Initialize canvas function
  const initializeCanvas = useCallback((canvasElement: HTMLCanvasElement) => {
    const newCanvas = new fabric.Canvas(canvasElement, {
      isDrawingMode: false,
      backgroundColor: '#f8f9fa',
      width: canvasElement.clientWidth,
      height: canvasElement.clientHeight,
      preserveObjectStacking: true
    });
    
    return newCanvas;
  }, []);

  // Resize canvas function
  const resizeCanvas = useCallback((canvas: fabric.Canvas, canvasElement: HTMLCanvasElement) => {
    if (!canvas || !canvasElement) return;
    
    canvas.setWidth(canvasElement.clientWidth);
    canvas.setHeight(canvasElement.clientHeight);
    canvas.renderAll();
  }, []);

  // Set up the canvas
  const setupCanvas = useCallback(async (canvasElement: HTMLCanvasElement) => {
    try {
      if (!canvasElement) return () => {};
      
      // Initialize and set up the canvas
      setIsLoading(true);
      const newCanvas = initializeCanvas(canvasElement);
      setCanvas(newCanvas);

      // Load saved canvas data if projectId is provided
      if (projectId) {
        await loadWhiteboardFromDatabase(newCanvas);
      }
      setIsLoading(false);
      
      // Add event listener for window resize
      const handleResize = () => resizeCanvas(newCanvas, canvasElement);
      window.addEventListener('resize', handleResize);
      
      // Auto-save on changes
      newCanvas.on('object:modified', () => setCanvasChanged(true));
      newCanvas.on('object:added', () => setCanvasChanged(true));
      newCanvas.on('object:removed', () => setCanvasChanged(true));

      // Add initial canvas state to history
      saveCanvasState(newCanvas);

      return () => {
        window.removeEventListener('resize', handleResize);
        newCanvas.dispose();
      };
    } catch (error) {
      console.error('Error setting up canvas:', error);
      setIsLoading(false);
      toast.error('Error setting up whiteboard. Please try refreshing the page.');
      return () => {};
    }
  }, [initializeCanvas, loadWhiteboardFromDatabase, projectId, resizeCanvas]);

  // Save canvas state for undo/redo
  const saveCanvasState = useCallback((fabricCanvas: fabric.Canvas) => {
    if (!fabricCanvas) return;
    
    const json = JSON.stringify(fabricCanvas.toJSON());
    
    setCanvasHistory(prev => {
      // If we're in the middle of the history, remove future states
      if (historyIndex < prev.length - 1) {
        return [...prev.slice(0, historyIndex + 1), json];
      }
      return [...prev, json];
    });
    
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  // Auto save changes
  useCallback(() => {
    if (canvas && canvasChanged && projectId) {
      saveWhiteboardToDatabase();
      setCanvasChanged(false);
    }
  }, [canvas, canvasChanged, projectId, saveWhiteboardToDatabase]);

  // Save canvas manually
  const saveCanvas = useCallback(async () => {
    if (!canvas || !projectId) return;
    
    try {
      await saveWhiteboardToDatabase();
      setCanvasChanged(false);
      toast.success('Whiteboard saved successfully');
    } catch (error) {
      console.error('Error manually saving canvas:', error);
      toast.error('Failed to save whiteboard');
    }
  }, [canvas, projectId, saveWhiteboardToDatabase]);

  // Activate tool (e.g., pencil, eraser)
  const activateTool = useCallback((tool: string) => {
    if (!canvas) return;
    
    setCurrentMode(tool);
    
    if (tool === 'pencil') {
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush.color = '#000000';
      canvas.freeDrawingBrush.width = 2;
    } else if (tool === 'eraser') {
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush.color = '#f8f9fa'; // Canvas background color
      canvas.freeDrawingBrush.width = 10;
    }
    
    canvas.renderAll();
  }, [canvas]);

  // Deactivate all tools
  const deactivateAllTools = useCallback(() => {
    if (!canvas) return;
    
    setCurrentMode('select');
    canvas.isDrawingMode = false;
    canvas.renderAll();
  }, [canvas]);

  // Add shape function
  const addShape = useCallback((type: 'rect' | 'circle') => {
    handleAddShape(type);
  }, [handleAddShape]);

  // Select shape function
  const selectShape = useCallback(() => {
    if (!canvas) return;
    
    deactivateAllTools();
    canvas.isDrawingMode = false;
    canvas.selection = true;
    canvas.renderAll();
  }, [canvas, deactivateAllTools]);

  // Delete selection function
  const deleteSelection = useCallback(() => {
    deleteSelectedObject();
  }, [deleteSelectedObject]);

  // Zoom functions
  const zoomIn = useCallback(() => {
    handleZoomIn();
  }, [handleZoomIn]);

  const zoomOut = useCallback(() => {
    handleZoomOut();
  }, [handleZoomOut]);

  const resetZoom = useCallback(() => {
    if (!canvas) return;
    
    canvas.setZoom(1);
    canvas.renderAll();
  }, [canvas]);

  return {
    canvas,
    isLoading,
    setupCanvas,
    currentMode,
    setCurrentMode,
    activateTool,
    deactivateAllTools,
    addShape,
    selectShape,
    deleteSelection,
    zoomIn,
    zoomOut,
    resetZoom,
    isDrawing,
    setIsDrawing,
    saveCanvas,
    canvasChanged,
    whiteboardMode,
    toggleWhiteboardMode
  };
};
