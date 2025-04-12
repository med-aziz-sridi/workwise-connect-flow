
import { useState, useCallback } from 'react';
import { fabric } from 'fabric';
import { toast } from 'sonner';
import { loadWhiteboardData, saveWhiteboardData } from '@/services/whiteboardService';
import { createDefaultTaskSections } from '@/components/whiteboard/WhiteboardShapes';

export function useWhiteboardStorage(
  projectId?: string,
  canvas: fabric.Canvas | null = null
) {
  const [lastSavedJson, setLastSavedJson] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  // Save whiteboard to database with debounce logic
  const saveWhiteboardToDatabase = useCallback(async () => {
    if (!canvas || !projectId) {
      if (!projectId) {
        toast("Project ID missing, cannot save whiteboard");
      }
      return;
    }
    
    if (isSaving) return;
    
    setIsSaving(true);
    
    try {
      const json = JSON.stringify(canvas.toJSON());
      
      // Only save if there are changes
      if (json === lastSavedJson) {
        toast("No changes to save");
        setIsSaving(false);
        return;
      }
      
      await saveWhiteboardData(projectId, json);
      setLastSavedJson(json);
      toast("Whiteboard saved successfully");
    } catch (error) {
      console.error('Error saving whiteboard:', error);
      toast("Error saving whiteboard");
    } finally {
      setIsSaving(false);
    }
  }, [canvas, projectId, lastSavedJson, isSaving]);

  // Load whiteboard from database
  const loadWhiteboardFromDatabase = useCallback(async (fabricCanvas: fabric.Canvas) => {
    if (!projectId) {
      toast("Project ID missing, cannot load whiteboard");
      return;
    }
    
    try {
      const data = await loadWhiteboardData(projectId);

      if (data && data.canvas_json) {
        const jsonData = typeof data.canvas_json === 'string' 
          ? data.canvas_json 
          : JSON.stringify(data.canvas_json);

        fabricCanvas.loadFromJSON(jsonData, () => {
          fabricCanvas.renderAll();
          setLastSavedJson(jsonData);
          toast("Whiteboard loaded successfully");
        });
      } else {
        // Initialize with default sections for a new whiteboard
        createDefaultTaskSections(fabricCanvas);
        fabricCanvas.renderAll();
        toast("New whiteboard created with default sections");
      }
    } catch (error) {
      console.error('Error loading whiteboard:', error);
      toast("Error loading whiteboard");
      
      // Initialize with default sections even on error
      createDefaultTaskSections(fabricCanvas);
      fabricCanvas.renderAll();
    }
  }, [projectId]);

  return {
    isSaving,
    saveWhiteboardToDatabase,
    loadWhiteboardFromDatabase
  };
}
