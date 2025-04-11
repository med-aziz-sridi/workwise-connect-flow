
import React, { useEffect } from 'react';
import { useWhiteboardCanvas } from '@/hooks/useWhiteboardCanvas';
import { useWhiteboardTools } from '@/hooks/useWhiteboardTools';
import WhiteboardToolbar from './WhiteboardToolbar';

interface InteractiveWhiteboardProps {
  projectId?: string;
}

const InteractiveWhiteboard: React.FC<InteractiveWhiteboardProps> = ({ projectId }) => {
  const { 
    canvas, 
    canvasRef, 
    canvasHistory, 
    historyIndex, 
    setHistoryIndex 
  } = useWhiteboardCanvas();
  
  const {
    activeTool,
    isSaving,
    whiteboardMode,
    handleToolSelect,
    handleAddShape,
    handleAddStickyNote,
    handleAddTaskCard,
    handleAddText,
    handleAddSection,
    handleUndo,
    handleRedo,
    handleZoomIn,
    handleZoomOut,
    toggleWhiteboardMode,
    saveWhiteboardToDatabase,
    loadWhiteboardFromDatabase,
    deleteSelectedObject
  } = useWhiteboardTools(projectId, canvas, canvasHistory, historyIndex, setHistoryIndex);

  // Load whiteboard data when canvas and projectId are available
  useEffect(() => {
    if (canvas && projectId) {
      loadWhiteboardFromDatabase(canvas);
    }
  }, [canvas, projectId]);

  return (
    <div className="flex flex-col w-full h-full">
      <WhiteboardToolbar 
        activeTool={activeTool}
        whiteboardMode={whiteboardMode}
        onToolSelect={handleToolSelect}
        onAddShape={(type) => handleAddShape(type)}
        onAddStickyNote={handleAddStickyNote}
        onAddTaskCard={handleAddTaskCard}
        onAddText={handleAddText}
        onAddSection={handleAddSection}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onSave={saveWhiteboardToDatabase}
        onDelete={deleteSelectedObject}
        onToggleWhiteboardMode={toggleWhiteboardMode}
        isSaving={isSaving}
      />
      
      <div className="relative border rounded-lg shadow-lg overflow-hidden mt-4 bg-white">
        <canvas ref={canvasRef} className="w-full"></canvas>
      </div>
    </div>
  );
};

export default InteractiveWhiteboard;
