
import { fabric } from 'fabric';
import { addShape, addText, addLine } from './shapes/BasicShapes';
import { addStickyNote, addTaskCard } from './shapes/TaskShapes';
import { addSection, createDefaultTaskSections, createBlankWhiteboard } from './shapes/SectionShapes';

// Re-export everything for backward compatibility
export {
  addShape,
  addText,
  addLine,
  addStickyNote,
  addTaskCard,
  addSection,
  createDefaultTaskSections,
  createBlankWhiteboard
};
