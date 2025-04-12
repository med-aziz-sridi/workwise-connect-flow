
import { useEffect, useState, useCallback } from 'react';
import { fabric } from 'fabric';
import { useWhiteboardCanvas } from '@/hooks/useWhiteboardCanvas';
import { useWhiteboardShapes } from './useWhiteboardShapes';
import { useWhiteboardMode } from './useWhiteboardMode';
import { useWhiteboardNavigation } from './useWhiteboardNavigation';
import { useWhiteboardStorage } from './useWhiteboardStorage';
import { toast } from 'sonner';

export const useWhiteboardTools = (projectId: string) => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Import all our specialized hooks
  const { initializeCanvas, resizeCanvas } = useWhiteboardCanvas();
  const { 
    currentMode, 
    setCurrentMode, 
    activateTool, 
    deactivateAllTools 
  } = useWhiteboardMode(canvas);
  const { addShape, selectShape, deleteSelection } = useWhiteboardShapes(canvas);
  const { zoomIn, zoomOut, resetZoom } = useWhiteboardNavigation(canvas);
  const { 
    loadCanvasFromStorage, 
    saveCanvasToStorage, 
    canvasChanged, 
    setCanvasChanged 
  } = useWhiteboardStorage(canvas, projectId);

  const setupCanvas = useCallback(async (canvasElement: HTMLCanvasElement) => {
    try {
      if (!canvasElement) return;
      
      // Initialize and set up the canvas
      setIsLoading(true);
      const newCanvas = initializeCanvas(canvasElement);
      setCanvas(newCanvas);

      // Load saved canvas data
      await loadCanvasFromStorage(newCanvas);
      setIsLoading(false);
      
      // Add event listener for window resize
      const handleResize = () => resizeCanvas(newCanvas, canvasElement);
      window.addEventListener('resize', handleResize);
      
      // Auto-save on changes
      newCanvas.on('object:modified', () => setCanvasChanged(true));
      newCanvas.on('object:added', () => setCanvasChanged(true));
      newCanvas.on('object:removed', () => setCanvasChanged(true));

      return () => {
        window.removeEventListener('resize', handleResize);
        newCanvas.dispose();
      };
    } catch (error) {
      console.error('Error setting up canvas:', error);
      setIsLoading(false);
      toast.error('Error setting up whiteboard. Please try refreshing the page.');
    }
  }, [initializeCanvas, loadCanvasFromStorage, resizeCanvas, setCanvasChanged]);

  // Auto save changes
  useEffect(() => {
    let saveTimeout: ReturnType<typeof setTimeout>;
    
    if (canvas && canvasChanged) {
      saveTimeout = setTimeout(async () => {
        try {
          await saveCanvasToStorage();
          setCanvasChanged(false);
        } catch (error) {
          console.error('Error saving canvas:', error);
          toast.error('Failed to save whiteboard changes');
        }
      }, 2000);
    }
    
    return () => clearTimeout(saveTimeout);
  }, [canvas, canvasChanged, saveCanvasToStorage, setCanvasChanged]);

  const saveCanvas = useCallback(async () => {
    if (!canvas) return;
    
    try {
      await saveCanvasToStorage();
      setCanvasChanged(false);
      toast.success('Whiteboard saved successfully');
    } catch (error) {
      console.error('Error manually saving canvas:', error);
      toast.error('Failed to save whiteboard');
    }
  }, [canvas, saveCanvasToStorage, setCanvasChanged]);

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
    canvasChanged
  };
};
