
import { useState } from 'react';
import { fabric } from 'fabric';
import { useToast } from '@/components/ui/use-toast';
import { loadWhiteboardData, saveWhiteboardData } from '@/services/whiteboardService';
import { createDefaultTaskSections } from '@/components/whiteboard/WhiteboardShapes';

export function useWhiteboardStorage(
  projectId?: string,
  canvas: fabric.Canvas | null = null
) {
  const [lastSavedJson, setLastSavedJson] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Save whiteboard to database
  const saveWhiteboardToDatabase = async () => {
    if (!canvas || !projectId) {
      if (!projectId) {
        toast({
          title: "Project ID missing",
          description: "Cannot save without a project ID",
          variant: "destructive",
        });
      }
      return;
    }
    
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
    if (!projectId) {
      toast({
        title: "Project ID missing",
        description: "Cannot load without a project ID",
        variant: "destructive",
      });
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
          
          toast({
            title: "Whiteboard loaded",
            description: "Your project whiteboard has been loaded",
          });
        });
      } else {
        // Initialize with default sections for a new whiteboard
        createDefaultTaskSections(fabricCanvas);
        fabricCanvas.renderAll();
        
        toast({
          title: "New whiteboard created",
          description: "Started with default sections",
        });
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
      fabricCanvas.renderAll();
    }
  };

  return {
    isSaving,
    saveWhiteboardToDatabase,
    loadWhiteboardFromDatabase
  };
}
