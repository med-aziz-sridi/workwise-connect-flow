
import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import {
  Square,
  Circle,
  Pencil,
  StickyNote,
  Move,
  ZoomIn,
  ZoomOut,
  Eraser,
  Type,
  Save,
  Undo,
  Redo,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import WhiteboardToolbar from './WhiteboardToolbar';

interface WhiteboardData {
  id: string;
  project_id: string;
  canvas_json: string;
  updated_at: string;
}

interface InteractiveWhiteboardProps {
  projectId?: string;
}

const InteractiveWhiteboard: React.FC<InteractiveWhiteboardProps> = ({ projectId }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [canvasHistory, setCanvasHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const { toast } = useToast();
  const [activeTool, setActiveTool] = useState<string>('select');
  const [lastSavedJson, setLastSavedJson] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

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
    fabricCanvas.on('object:added', saveCanvasState);
    fabricCanvas.on('object:modified', saveCanvasState);
    fabricCanvas.on('object:removed', saveCanvasState);

    // Event listeners for canvas resizing
    window.addEventListener('resize', handleResize);

    setCanvas(fabricCanvas);

    // Load whiteboard data from database if projectId exists
    if (projectId) {
      loadWhiteboardData(fabricCanvas);
    }

    return () => {
      fabricCanvas.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, [projectId]);

  // Handle canvas resizing
  const handleResize = () => {
    if (!canvas) return;
    
    canvas.setWidth(window.innerWidth * 0.9);
    canvas.setHeight(window.innerHeight * 0.8);
    canvas.renderAll();
  };

  // Save canvas state for undo/redo
  const saveCanvasState = () => {
    if (!canvas) return;
    
    const json = JSON.stringify(canvas.toJSON());
    
    if (historyIndex < canvasHistory.length - 1) {
      // If we're in the middle of the history, remove future states
      const newHistory = canvasHistory.slice(0, historyIndex + 1);
      setCanvasHistory([...newHistory, json]);
    } else {
      setCanvasHistory(prev => [...prev, json]);
    }
    
    setHistoryIndex(prev => prev + 1);
  };

  // Load whiteboard data from database
  const loadWhiteboardData = async (fabricCanvas: fabric.Canvas) => {
    try {
      const { data, error } = await supabase
        .from('project_whiteboards')
        .select('*')
        .eq('project_id', projectId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data && data.canvas_json) {
        fabricCanvas.loadFromJSON(data.canvas_json, () => {
          fabricCanvas.renderAll();
          setLastSavedJson(data.canvas_json);
          toast({
            title: "Whiteboard loaded",
            description: "Your project whiteboard has been loaded",
          });
        });
      } else {
        // Initialize with a blank canvas
        saveCanvasState();
        toast({
          title: "New whiteboard",
          description: "A new whiteboard has been created for this project",
        });
      }
    } catch (error) {
      console.error('Error loading whiteboard:', error);
      toast({
        title: "Error loading whiteboard",
        description: "There was an error loading your whiteboard",
        variant: "destructive",
      });
    }
  };

  // Save whiteboard data to database
  const saveWhiteboardData = async () => {
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
      
      // Check if a whiteboard record exists for this project
      const { data: existingData, error: checkError } = await supabase
        .from('project_whiteboards')
        .select('id')
        .eq('project_id', projectId)
        .maybeSingle();
      
      if (checkError && checkError.code !== 'PGRST116') throw checkError;
      
      if (existingData) {
        // Update existing whiteboard
        const { error: updateError } = await supabase
          .from('project_whiteboards')
          .update({
            canvas_json: json,
            updated_at: new Date().toISOString()
          })
          .eq('project_id', projectId);
          
        if (updateError) throw updateError;
      } else {
        // Create new whiteboard record
        const { error: insertError } = await supabase
          .from('project_whiteboards')
          .insert({
            project_id: projectId,
            canvas_json: json,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
          
        if (insertError) throw insertError;
      }
      
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

  // Add shape to canvas
  const addShape = (shapeType: 'rect' | 'circle') => {
    if (!canvas) return;
    
    let shape;
    
    if (shapeType === 'rect') {
      shape = new fabric.Rect({
        left: 100,
        top: 100,
        width: 100,
        height: 100,
        fill: 'rgba(255, 255, 255, 0.8)',
        stroke: '#000000',
        strokeWidth: 1,
      });
    } else if (shapeType === 'circle') {
      shape = new fabric.Circle({
        left: 100,
        top: 100,
        radius: 50,
        fill: 'rgba(255, 255, 255, 0.8)',
        stroke: '#000000',
        strokeWidth: 1,
      });
    }
    
    if (shape) {
      canvas.add(shape);
      canvas.setActiveObject(shape);
      saveCanvasState();
    }
  };

  // Add sticky note to canvas
  const addStickyNote = () => {
    if (!canvas) return;
    
    const colors = ['#fff8c5', '#d1f3d1', '#ffcccb', '#c5dbff', '#e2c5ff'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Create container group for sticky note
    const rect = new fabric.Rect({
      width: 150,
      height: 150,
      fill: randomColor,
      rx: 5,
      ry: 5,
      shadow: new fabric.Shadow({ color: 'rgba(0,0,0,0.2)', blur: 5, offsetX: 2, offsetY: 2 }),
    });
    
    const textbox = new fabric.Textbox('Click to edit', {
      width: 130,
      left: 10,
      top: 30,
      fontSize: 16,
      fontFamily: 'Arial',
      fill: '#333333',
    });
    
    const group = new fabric.Group([rect, textbox], {
      left: 100,
      top: 100,
      subTargetCheck: true,
    });
    
    canvas.add(group);
    canvas.setActiveObject(group);
    saveCanvasState();
  };

  // Add text to canvas
  const addText = () => {
    if (!canvas) return;
    
    const text = new fabric.Textbox('Click to edit text', {
      left: 100,
      top: 100,
      width: 200,
      fontSize: 16,
      fontFamily: 'Arial',
      fill: '#333333',
      editable: true,
    });
    
    canvas.add(text);
    canvas.setActiveObject(text);
    saveCanvasState();
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
      saveCanvasState();
    }
  };

  return (
    <div className="flex flex-col w-full h-full">
      <WhiteboardToolbar 
        activeTool={activeTool}
        onToolSelect={handleToolSelect}
        onAddShape={(type) => addShape(type)}
        onAddStickyNote={addStickyNote}
        onAddText={addText}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onSave={saveWhiteboardData}
        onDelete={deleteSelectedObject}
        isSaving={isSaving}
      />
      
      <div className="relative border rounded-lg shadow-lg overflow-hidden mt-4 bg-white">
        <canvas ref={canvasRef} className="w-full"></canvas>
      </div>
    </div>
  );
};

export default InteractiveWhiteboard;
