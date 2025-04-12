
import { useState } from 'react';
import { fabric } from 'fabric';
import { useToast } from '@/components/ui/use-toast';

export function useWhiteboardNavigation(
  canvas: fabric.Canvas | null = null,
  canvasHistory: string[] = [],
  historyIndex: number = -1,
  setHistoryIndex: (index: number) => void = () => {}
) {
  const { toast } = useToast();

  // Handle undo
  const handleUndo = () => {
    if (!canvas || historyIndex <= 0) {
      if (historyIndex <= 0) {
        toast({
          title: "Nothing to undo",
          description: "You're at the beginning of your history",
        });
      }
      return;
    }
    
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    
    canvas.loadFromJSON(canvasHistory[newIndex], () => {
      canvas.renderAll();
      toast({
        title: "Undo successful",
        description: "Previous action has been undone",
      });
    });
  };

  // Handle redo
  const handleRedo = () => {
    if (!canvas || historyIndex >= canvasHistory.length - 1) {
      if (historyIndex >= canvasHistory.length - 1) {
        toast({
          title: "Nothing to redo",
          description: "You're at the latest state",
        });
      }
      return;
    }
    
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    
    canvas.loadFromJSON(canvasHistory[newIndex], () => {
      canvas.renderAll();
      toast({
        title: "Redo successful",
        description: "Action has been redone",
      });
    });
  };

  // Handle zoom in
  const handleZoomIn = () => {
    if (!canvas) return;
    
    const zoom = canvas.getZoom();
    canvas.setZoom(zoom * 1.1);
    canvas.renderAll();
    
    toast({
      title: "Zoomed in",
      description: `Current zoom: ${Math.round(zoom * 110)}%`,
    });
  };

  // Handle zoom out
  const handleZoomOut = () => {
    if (!canvas) return;
    
    const zoom = canvas.getZoom();
    canvas.setZoom(zoom / 1.1);
    canvas.renderAll();
    
    toast({
      title: "Zoomed out",
      description: `Current zoom: ${Math.round(zoom * 90)}%`,
    });
  };

  // Delete selected object
  const deleteSelectedObject = () => {
    if (!canvas) return;
    
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.remove(activeObject);
      canvas.fire('object:removed', { target: activeObject });
      canvas.renderAll();
      
      toast({
        title: "Deleted",
        description: "Selected object has been removed",
      });
    } else {
      toast({
        title: "Nothing selected",
        description: "Select an object to delete first",
      });
    }
  };

  return {
    handleUndo,
    handleRedo,
    handleZoomIn,
    handleZoomOut,
    deleteSelectedObject
  };
}
