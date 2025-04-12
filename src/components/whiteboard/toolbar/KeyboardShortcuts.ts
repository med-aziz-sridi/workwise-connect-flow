
import { useEffect } from 'react';

interface ShortcutHandlers {
  onToolSelect: (tool: string) => void;
  onAddShape: (type: 'rect' | 'circle') => void;
  onAddStickyNote: () => void;
  onAddText: () => void;
  onAddLine: (isArrow: boolean) => void;
  onUndo: () => void;
  onRedo: () => void;
  onDelete: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onSave: () => void;
}

export const useKeyboardShortcuts = (handlers: ShortcutHandlers) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only process shortcuts when not in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      switch (e.key) {
        case 'v': case 'V': // Select tool
          handlers.onToolSelect('select');
          break;
        case 'p': case 'P': // Pencil tool
          handlers.onToolSelect('pencil');
          break;
        case 'e': case 'E': // Eraser tool
          handlers.onToolSelect('eraser');
          break;
        case 'r': case 'R': // Rectangle
          handlers.onAddShape('rect');
          break;
        case 'c': case 'C': // Circle
          handlers.onAddShape('circle');
          break;
        case 's': case 'S': // Sticky note
          if (!e.ctrlKey && !e.metaKey) { // Avoid conflict with save shortcut
            handlers.onAddStickyNote();
          }
          break;
        case 't': case 'T': // Text
          handlers.onAddText();
          break;
        case 'l': case 'L': // Line
          handlers.onAddLine(false);
          break;
        case 'a': case 'A': // Arrow
          if (!e.ctrlKey && !e.metaKey) { // Avoid conflict with select all
            handlers.onAddLine(true);
          }
          break;
        case 'z': // Undo
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            handlers.onUndo();
          }
          break;
        case 'y': // Redo
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            handlers.onRedo();
          }
          break;
        case 'Delete': case 'Backspace': // Delete
          if (document.activeElement === document.body) { // Only if no input is focused
            e.preventDefault();
            handlers.onDelete();
          }
          break;
        case '+': // Zoom in
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            handlers.onZoomIn();
          }
          break;
        case '-': // Zoom out
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            handlers.onZoomOut();
          }
          break;
        case 's': // Save
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            handlers.onSave();
          }
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
};
