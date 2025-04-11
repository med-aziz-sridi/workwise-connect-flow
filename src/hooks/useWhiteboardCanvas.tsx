
import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { useToast } from '@/components/ui/use-toast';

export function useWhiteboardCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [canvasHistory, setCanvasHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const { toast } = useToast();

  // Initialize the canvas
  useEffect(() => {
    if (!canvasRef.current || canvas) return;

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      backgroundColor: '#f8f9fa',
      width: window.innerWidth * 0.9,
      height: window.innerHeight * 0.8,
      preserveObjectStacking: true,
    });

    // Set initial canvas properties
    fabricCanvas.selection = true;
    fabricCanvas.freeDrawingBrush.width = 2;
    fabricCanvas.freeDrawingBrush.color = '#000000';

    // Event listeners for canvas changes
    fabricCanvas.on('object:added', () => saveCanvasState(fabricCanvas));
    fabricCanvas.on('object:modified', () => saveCanvasState(fabricCanvas));
    fabricCanvas.on('object:removed', () => saveCanvasState(fabricCanvas));

    // Event listeners for canvas resizing
    window.addEventListener('resize', () => handleResize(fabricCanvas));

    setCanvas(fabricCanvas);

    return () => {
      fabricCanvas.dispose();
      window.removeEventListener('resize', () => handleResize(fabricCanvas));
    };
  }, []);

  // Handle canvas resizing
  const handleResize = (fabricCanvas: fabric.Canvas) => {
    fabricCanvas.setWidth(window.innerWidth * 0.9);
    fabricCanvas.setHeight(window.innerHeight * 0.8);
    fabricCanvas.renderAll();
  };

  // Save canvas state for undo/redo
  const saveCanvasState = (fabricCanvas: fabric.Canvas) => {
    const json = JSON.stringify(fabricCanvas.toJSON());
    
    if (historyIndex < canvasHistory.length - 1) {
      // If we're in the middle of the history, remove future states
      const newHistory = canvasHistory.slice(0, historyIndex + 1);
      setCanvasHistory([...newHistory, json]);
    } else {
      setCanvasHistory(prev => [...prev, json]);
    }
    
    setHistoryIndex(prev => prev + 1);
  };

  return {
    canvas,
    canvasRef,
    canvasHistory,
    historyIndex,
    setHistoryIndex,
    saveCanvasState
  };
}
