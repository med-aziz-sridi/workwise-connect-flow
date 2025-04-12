
import { fabric } from 'fabric';
import { useToast } from '@/components/ui/use-toast';
import {
  addShape,
  addStickyNote,
  addTaskCard,
  addText,
  addSection,
  addLine
} from '@/components/whiteboard/WhiteboardShapes';

export function useWhiteboardShapes(canvas: fabric.Canvas | null = null) {
  const { toast } = useToast();

  // Shape-adding wrappers
  const handleAddShape = (type: 'rect' | 'circle') => {
    if (!canvas) {
      toast({
        title: "Canvas not ready",
        description: "Please wait for the canvas to initialize",
        variant: "destructive",
      });
      return;
    }
    
    addShape(canvas, type);
    canvas.fire('object:added');
    canvas.renderAll();
  };

  const handleAddStickyNote = () => {
    if (!canvas) {
      toast({
        title: "Canvas not ready",
        description: "Please wait for the canvas to initialize",
        variant: "destructive",
      });
      return;
    }
    
    addStickyNote(canvas);
    canvas.fire('object:added');
    canvas.renderAll();
  };

  const handleAddTaskCard = () => {
    if (!canvas) {
      toast({
        title: "Canvas not ready",
        description: "Please wait for the canvas to initialize",
        variant: "destructive",
      });
      return;
    }
    
    addTaskCard(canvas);
    canvas.fire('object:added');
    canvas.renderAll();
  };

  const handleAddText = () => {
    if (!canvas) {
      toast({
        title: "Canvas not ready",
        description: "Please wait for the canvas to initialize",
        variant: "destructive",
      });
      return;
    }
    
    addText(canvas);
    canvas.fire('object:added');
    canvas.renderAll();
  };

  // Create new section
  const handleAddSection = () => {
    if (!canvas) {
      toast({
        title: "Canvas not ready",
        description: "Please wait for the canvas to initialize",
        variant: "destructive",
      });
      return;
    }
    
    const colors = [
      { color: '#f3f4f6', textColor: '#111827' }, // Gray
      { color: '#e5edff', textColor: '#1e40af' }, // Blue
      { color: '#f0fdf4', textColor: '#166534' }, // Green
      { color: '#fff7ed', textColor: '#9a3412' }, // Orange
      { color: '#fef2f2', textColor: '#991b1b' }, // Red
      { color: '#f5f3ff', textColor: '#5b21b6' }  // Purple
    ];
    
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const section = addSection(
      canvas, 
      'New Section', 
      randomColor.color, 
      randomColor.textColor, 
      100, 
      100
    );
    
    canvas.fire('object:added', { target: section });
    canvas.renderAll();
  };

  // Add a method to handle adding lines and arrows
  const handleAddLine = (isArrow: boolean = false) => {
    if (!canvas) {
      toast({
        title: "Canvas not ready",
        description: "Please wait for the canvas to initialize",
        variant: "destructive",
      });
      return;
    }
    
    addLine(canvas, isArrow);
    canvas.fire('object:added');
    canvas.renderAll();
  };

  return {
    handleAddShape,
    handleAddStickyNote,
    handleAddTaskCard,
    handleAddText,
    handleAddSection,
    handleAddLine
  };
}
