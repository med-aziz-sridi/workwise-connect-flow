
import { useState } from 'react';
import { fabric } from 'fabric';
import { useToast } from '@/components/ui/use-toast';
import { 
  addShape, 
  addStickyNote, 
  addTaskCard, 
  addText,
  createDefaultTaskSections
} from '@/components/whiteboard/WhiteboardShapes';
import { loadWhiteboardData, saveWhiteboardData } from '@/services/whiteboardService';

export function useWhiteboardTools(
  projectId?: string,
  canvas: fabric.Canvas | null = null,
  canvasHistory: string[] = [],
  historyIndex: number = -1,
  setHistoryIndex: (index: number) => void = () => {}
) {
  const [activeTool, setActiveTool] = useState<string>('select');
  const [lastSavedJson, setLastSavedJson] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

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

  // Handle undo
  const handleUndo = () => {
    if (!canvas || historyIndex <= 0) return;
    
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    
    canvas.loadFromJSON(canvasHistory[newIndex], () => {
      canvas.renderAll();
    });
  };

  // Handle redo
  const handleRedo = () => {
    if (!canvas || historyIndex >= canvasHistory.length - 1) return;
    
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    
    canvas.loadFromJSON(canvasHistory[newIndex], () => {
      canvas.renderAll();
    });
  };

  // Handle zoom in
  const handleZoomIn = () => {
    if (!canvas) return;
    
    const zoom = canvas.getZoom();
    canvas.setZoom(zoom * 1.1);
    canvas.renderAll();
  };

  // Handle zoom out
  const handleZoomOut = () => {
    if (!canvas) return;
    
    const zoom = canvas.getZoom();
    canvas.setZoom(zoom / 1.1);
    canvas.renderAll();
  };

  // Delete selected object
  const deleteSelectedObject = () => {
    if (!canvas) return;
    
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.remove(activeObject);
      if (canvas.fire) {
        canvas.fire('object:removed', { target: activeObject });
      }
    }
  };

  // Save whiteboard to database
  const saveWhiteboardToDatabase = async () => {
    if (!canvas || !projectId) return;
    
    setIsSaving(true);
    
    try {
      const json = JSON.stringify(canvas.toJSON());
      
      // Only save if there are changes
      if (json === lastSavedJson) {
        toast({
          title: "No changes to save",
          description: "Your whiteboard is already up to date",
        });
        setIsSaving(false);
        return;
      }
      
      await saveWhiteboardData(projectId, json);
      
      setLastSavedJson(json);
      
      toast({
        title: "Whiteboard saved",
        description: "Your changes have been saved successfully",
      });
    } catch (error) {
      console.error('Error saving whiteboard:', error);
      toast({
        title: "Error saving whiteboard",
        description: "There was an error saving your changes",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Load whiteboard from database
  const loadWhiteboardFromDatabase = async (fabricCanvas: fabric.Canvas) => {
    if (!projectId) return;
    
    try {
      const data = await loadWhiteboardData(projectId);

      if (data && data.canvas_json) {
        const jsonData = typeof data.canvas_json === 'string' 
          ? data.canvas_json 
          : JSON.stringify(data.canvas_json);

        fabricCanvas.loadFromJSON(jsonData, () => {
          fabricCanvas.renderAll();
          setLastSavedJson(jsonData);
          toast({
            title: "Whiteboard loaded",
            description: "Your project whiteboard has been loaded",
          });
        });
      } else {
        // Initialize with default sections for a new whiteboard
        createDefaultTaskSections(fabricCanvas);
      }
    } catch (error) {
      console.error('Error loading whiteboard:', error);
      toast({
        title: "Error loading whiteboard",
        description: "There was an error loading your whiteboard",
        variant: "destructive",
      });
      
      // Initialize with default sections even on error
      createDefaultTaskSections(fabricCanvas);
    }
  };

  // Shape-adding wrappers
  const handleAddShape = (type: 'rect' | 'circle') => {
    if (!canvas) return;
    addShape(canvas, type);
    if (canvas.fire) {
      canvas.fire('object:added');
    }
  };

  const handleAddStickyNote = () => {
    if (!canvas) return;
    addStickyNote(canvas);
    if (canvas.fire) {
      canvas.fire('object:added');
    }
  };

  const handleAddTaskCard = () => {
    if (!canvas) return;
    addTaskCard(canvas);
    if (canvas.fire) {
      canvas.fire('object:added');
    }
  };

  const handleAddText = () => {
    if (!canvas) return;
    addText(canvas);
    if (canvas.fire) {
      canvas.fire('object:added');
    }
  };

  return {
    activeTool,
    isSaving,
    handleToolSelect,
    handleAddShape,
    handleAddStickyNote,
    handleAddTaskCard,
    handleAddText,
    handleUndo,
    handleRedo,
    handleZoomIn,
    handleZoomOut,
    saveWhiteboardToDatabase,
    loadWhiteboardFromDatabase,
    deleteSelectedObject
  };
}
