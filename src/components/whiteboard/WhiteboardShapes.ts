
import { fabric } from 'fabric';
import { WhiteboardSection } from '@/types/whiteboard';

export function addShape(canvas: fabric.Canvas, shapeType: 'rect' | 'circle') {
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
    return true;
  }
  
  return false;
}

export function addStickyNote(canvas: fabric.Canvas) {
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
}

export function addTaskCard(canvas: fabric.Canvas, section?: string) {
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
  
  // Add section info if provided
  const sectionInfo = section 
    ? new fabric.Textbox(`Section: ${section}`, {
        width: 180,
        left: 10,
        top: 140,
        fontSize: 12,
        fontFamily: 'Arial',
        fill: '#6b7280',
      })
    : new fabric.Textbox('No section assigned', {
        width: 180,
        left: 10,
        top: 140,
        fontSize: 12,
        fontFamily: 'Arial',
        fill: '#6b7280',
      });
  
  const elements = [
    card, titleBar, titleText, descriptionText,
    checkItem1, checkItem2, sectionInfo
  ];
  
  const group = new fabric.Group(elements, {
    left: 100,
    top: 100,
    subTargetCheck: true,
  });
  
  canvas.add(group);
  canvas.setActiveObject(group);
}

export function addText(canvas: fabric.Canvas) {
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
}

export function addSection(canvas: fabric.Canvas, title: string, color: string, textColor: string, left: number, top: number) {
  // Create background rectangle for the section
  const rect = new fabric.Rect({
    width: 250,
    height: 300,
    fill: color,
    rx: 10,
    ry: 10,
    strokeWidth: 1,
    stroke: '#e5e7eb',
  });
  
  // Create section title
  const text = new fabric.Textbox(title, {
    top: 10,
    width: 230,
    left: 10,
    fontSize: 18,
    fontWeight: 'bold',
    fill: textColor,
    fontFamily: 'Arial',
    textAlign: 'center',
  });
  
  // Add a plus button for adding tasks
  const addButton = new fabric.Textbox('+ Add Task', {
    top: 40,
    width: 230,
    left: 10,
    fontSize: 14,
    fill: textColor,
    fontFamily: 'Arial',
    textAlign: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
    padding: 5,
  });
  
  // Create group for the section
  const group = new fabric.Group([rect, text, addButton], {
    left: left,
    top: top,
    subTargetCheck: true,
  });
  
  // Add custom properties
  group.toObject = (function(toObject) {
    return function() {
      return fabric.util.object.extend(toObject.call(this), {
        sectionId: this.sectionId,
        sectionTitle: this.sectionTitle
      });
    };
  })(group.toObject);
  
  group.sectionId = Math.random().toString(36).substring(2, 9);
  group.sectionTitle = title;
  
  canvas.add(group);
  return group;
}

export function createDefaultTaskSections(canvas: fabric.Canvas) {
  const defaultSections = [
    { title: 'To Do', color: '#f3f4f6', textColor: '#111827' },
    { title: 'In Progress', color: '#e5edff', textColor: '#1e40af' },
    { title: 'Done', color: '#f0fdf4', textColor: '#166534' }
  ];
  
  const canvasWidth = canvas.getWidth();
  const spacing = 20;
  const sectionWidth = 250;
  const startLeft = (canvasWidth - (sectionWidth * defaultSections.length + spacing * (defaultSections.length - 1))) / 2;
  
  defaultSections.forEach((section, index) => {
    const left = startLeft + (sectionWidth + spacing) * index;
    addSection(canvas, section.title, section.color, section.textColor, left, 70);
  });
  
  canvas.renderAll();
}

export function createBlankWhiteboard(canvas: fabric.Canvas) {
  // Just initialize an empty whiteboard without any sections
  canvas.clear();
  canvas.setBackgroundColor('#f8f9fa', canvas.renderAll.bind(canvas));
  canvas.renderAll();
}
