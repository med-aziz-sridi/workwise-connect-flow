
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
    handleAddText,
    handleAddSection,
    handleAddLine,
    handleUndo,
    handleRedo,
    handleZoomIn,
    handleZoomOut,
    toggleWhiteboardMode,
    saveWhiteboardToDatabase,
    loadWhiteboardFromDatabase,
    deleteSelectedObject
  } = useWhiteboardTools(projectId, canvas, canvasHistory, historyIndex, setHistoryIndex);

  useEffect(() => {
    if (canvas && projectId) {
      loadWhiteboardFromDatabase(canvas);
    }
  }, [canvas, projectId]);

  return (
    <div className="flex flex-col w-full h-full bg-gray-50">
      <WhiteboardToolbar 
        activeTool={activeTool}
        whiteboardMode={whiteboardMode}
        onToolSelect={handleToolSelect}
        onAddShape={(type) => handleAddShape(type)}
        onAddStickyNote={handleAddStickyNote}
        onAddText={handleAddText}
        onAddSection={handleAddSection}
        onAddLine={handleAddLine}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onSave={saveWhiteboardToDatabase}
        onDelete={deleteSelectedObject}
        onToggleWhiteboardMode={toggleWhiteboardMode}
        isSaving={isSaving}
      />
      
      <div className="relative flex-1 m-4 overflow-hidden bg-white rounded-xl shadow-xl">
        <div className="absolute inset-0 bg-grid-gray-200 [mask-image:linear-gradient(0deg,#fff,transparent)]">
          <canvas 
            ref={canvasRef} 
            className="w-full h-full touch-pan"
          />
        </div>
      </div>
    </div>
  );
};

export default InteractiveWhiteboard;
