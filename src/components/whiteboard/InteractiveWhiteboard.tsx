import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { useToast } from '@/components/ui/use-toast';
import { WhiteboardData, WhiteboardQueryResponse, WhiteboardIdQueryResponse, WhiteboardMutationResponse } from '@/types/whiteboard';
import { supabase } from '@/integrations/supabase/client';
import WhiteboardToolbar from './WhiteboardToolbar';

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
      // Use raw SQL query to get around type issues with the newly created table
      const { data, error } = await supabase
        .from('project_whiteboards')
        .select('*')
        .eq('project_id', projectId)
        .maybeSingle() as unknown as WhiteboardQueryResponse;

      if (error) throw error;

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

  // Create default task sections for a new whiteboard
  const createDefaultTaskSections = (canvas: fabric.Canvas) => {
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();
    
    const columnWidth = canvasWidth / 4;
    const columnHeight = canvasHeight * 0.8;
    
    // Create the task sections (To Do, In Progress, Review, Done)
    const sections = [
      { title: 'To Do', color: '#f3f4f6', textColor: '#111827' },
      { title: 'In Progress', color: '#e5edff', textColor: '#1e40af' },
      { title: 'Review', color: '#fff7ed', textColor: '#9a3412' },
      { title: 'Done', color: '#f0fdf4', textColor: '#166534' }
    ];
    
    sections.forEach((section, index) => {
      // Create background rectangle for the section
      const rect = new fabric.Rect({
        left: index * columnWidth + 10,
        top: 70,
        width: columnWidth - 20,
        height: columnHeight,
        fill: section.color,
        rx: 10,
        ry: 10,
        strokeWidth: 1,
        stroke: '#e5e7eb',
        selectable: true,
        hasControls: true,
        lockMovementX: false,
        lockMovementY: false,
      });
      
      // Create section title
      const text = new fabric.Textbox(section.title, {
        left: index * columnWidth + 20,
        top: 80,
        width: columnWidth - 40,
        fontSize: 24,
        fontWeight: 'bold',
        fill: section.textColor,
        fontFamily: 'Arial',
        textAlign: 'center',
      });
      
      // Add a plus button for adding tasks
      const addButton = new fabric.Textbox('+ Add Task', {
        left: index * columnWidth + 20,
        top: 120,
        width: columnWidth - 40,
        fontSize: 16,
        fill: '#6b7280',
        fontFamily: 'Arial',
        textAlign: 'center',
        backgroundColor: '#ffffff',
        padding: 10,
      });
      
      // Add objects to canvas
      canvas.add(rect);
      canvas.add(text);
      canvas.add(addButton);
    });
    
    canvas.renderAll();
    saveCanvasState();
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
      
      // Check if a whiteboard record exists for this project using raw query
      const { data: existingData, error: checkError } = await supabase
        .from('project_whiteboards')
        .select('id')
        .eq('project_id', projectId)
        .maybeSingle() as unknown as WhiteboardIdQueryResponse;
      
      if (checkError) throw checkError;
      
      if (existingData) {
        // Update existing whiteboard using raw query
        const { error: updateError } = await supabase
          .from('project_whiteboards')
          .update({
            canvas_json: json,
            updated_at: new Date().toISOString()
          })
          .eq('project_id', projectId) as unknown as WhiteboardMutationResponse;
          
        if (updateError) throw updateError;
      } else {
        // Create new whiteboard record using raw query
        const { error: insertError } = await supabase
          .from('project_whiteboards')
          .insert({
            project_id: projectId,
            canvas_json: json,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }) as unknown as WhiteboardMutationResponse;
          
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

  // Add task card to canvas
  const addTaskCard = () => {
    if (!canvas) return;
    
    // Create a more structured task card
    const card = new fabric.Rect({
      width: 200,
      height: 180,
      fill: '#ffffff',
      rx: 5,
      ry: 5,
      stroke: '#e5e7eb',
      strokeWidth: 1,
      shadow: new fabric.Shadow({ color: 'rgba(0,0,0,0.1)', blur: 3, offsetX: 1, offsetY: 1 }),
    });
    
    const titleBar = new fabric.Rect({
      width: 200,
      height: 30,
      fill: '#f3f4f6',
      rx: 5,
      ry: 5,
    });
    
    const titleText = new fabric.Textbox('Task Title', {
      width: 180,
      left: 10,
      top: 8,
      fontSize: 14,
      fontWeight: 'bold',
      fontFamily: 'Arial',
      fill: '#111827',
    });
    
    const descriptionText = new fabric.Textbox('Task description here...', {
      width: 180,
      left: 10,
      top: 40,
      fontSize: 12,
      fontFamily: 'Arial',
      fill: '#4b5563',
    });
    
    const checkItem1 = new fabric.Textbox('☐ Subtask 1', {
      width: 180,
      left: 10,
      top: 90,
      fontSize: 12,
      fontFamily: 'Arial',
      fill: '#4b5563',
    });
    
    const checkItem2 = new fabric.Textbox('☐ Subtask 2', {
      width: 180,
      left: 10,
      top: 110,
      fontSize: 12,
      fontFamily: 'Arial',
      fill: '#4b5563',
    });
    
    const dueDate = new fabric.Textbox('Due: Tomorrow', {
      width: 180,
      left: 10,
      top: 140,
      fontSize: 12,
      fontFamily: 'Arial',
      fill: '#6b7280',
    });
    
    const assignee = new fabric.Textbox('Assigned to: You', {
      width: 180,
      left: 10,
      top: 160,
      fontSize: 12,
      fontFamily: 'Arial',
      fill: '#6b7280',
    });
    
    const group = new fabric.Group([
      card, titleBar, titleText, descriptionText, 
      checkItem1, checkItem2, dueDate, assignee
    ], {
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
        onAddTaskCard={addTaskCard}
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
