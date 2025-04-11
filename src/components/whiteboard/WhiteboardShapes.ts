
import { fabric } from 'fabric';

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

export function addTaskCard(canvas: fabric.Canvas) {
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

export function createDefaultTaskSections(canvas: fabric.Canvas) {
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
}
