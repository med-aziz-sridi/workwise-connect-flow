
import { useState } from 'react';
import { fabric } from 'fabric';
import { useToast } from '@/components/ui/use-toast';
import {
  createDefaultTaskSections,
  createBlankWhiteboard
} from '@/components/whiteboard/WhiteboardShapes';

export function useWhiteboardMode(canvas: fabric.Canvas | null = null) {
  const [whiteboardMode, setWhiteboardMode] = useState<'default' | 'blank'>('default');
  const { toast } = useToast();

  // Toggle between default sections and blank whiteboard
  const toggleWhiteboardMode = () => {
    if (!canvas) {
      toast({
        title: "Canvas not ready",
        description: "Please wait for the canvas to initialize",
        variant: "destructive",
      });
      return;
    }
    
    if (whiteboardMode === 'default') {
      createBlankWhiteboard(canvas);
      setWhiteboardMode('blank');
      toast({
        title: "Blank mode",
        description: "Switched to blank whiteboard",
      });
    } else {
      createDefaultTaskSections(canvas);
      setWhiteboardMode('default');
      toast({
        title: "Default mode",
        description: "Switched to default task sections",
      });
    }
    
    canvas.renderAll();
  };

  return {
    whiteboardMode,
    toggleWhiteboardMode
  };
}
