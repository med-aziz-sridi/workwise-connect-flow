
import { fabric } from 'fabric';
import { WhiteboardSection } from '@/types/whiteboard';

export function addStickyNote(canvas: fabric.Canvas) {
  const colors = ['#fff8c5', '#d1f3d1', '#ffcccb', '#c5dbff', '#e2c5ff'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  
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
    editingBorderColor: '#1e88e5',
    cursorColor: '#1e88e5',
  });
  
  const group = new fabric.Group([rect, textbox], {
    left: 100,
    top: 100,
    subTargetCheck: true,
  });
  
  canvas.add(group);
  canvas.setActiveObject(group);
  
  if (textbox.enterEditing) {
    setTimeout(() => {
      const activeObject = canvas.getActiveObject();
      if (activeObject && activeObject.type === 'group') {
        const textObj = activeObject.getObjects().find((o: any) => o.type === 'textbox');
        if (textObj && textObj.enterEditing) {
          textObj.enterEditing();
          canvas.renderAll();
        }
      }
    }, 100);
  }
}

export function addTaskCard(canvas: fabric.Canvas, section?: string) {
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
