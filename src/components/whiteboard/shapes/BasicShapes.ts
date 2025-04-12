
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
    const text = new fabric.Textbox('Double-click to edit', {
      left: 0,
      top: 0,
      fontSize: 16,
      fontFamily: 'Arial',
      fill: '#333333',
      textAlign: 'center',
      width: shapeType === 'rect' ? 100 : 100,
      editingBorderColor: '#1e88e5',
      cursorColor: '#1e88e5',
    });
    
    if (shapeType === 'rect') {
      text.set({
        left: 0,
        top: 40,
      });
    } else {
      text.set({
        left: -50,
        top: -10,
      });
    }
    
    const group = new fabric.Group([shape, text], {
      left: 100,
      top: 100,
      subTargetCheck: true,
    });
    
    canvas.add(group);
    canvas.setActiveObject(group);
    return true;
  }
  
  return false;
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
  
  if (text.enterEditing) {
    setTimeout(() => {
      text.enterEditing();
      canvas.renderAll();
    }, 100);
  }
}

export function addLine(canvas: fabric.Canvas, isArrow = false) {
  const line = new fabric.Line([50, 50, 200, 200], {
    stroke: '#000000',
    strokeWidth: 2,
    selectable: true,
    strokeDashArray: isArrow ? undefined : [5, 5],
  });
  
  if (isArrow) {
    const triangle = new fabric.Triangle({
      width: 15,
      height: 15,
      fill: '#000000',
      left: 200,
      top: 200,
      angle: 45,
    });
    
    const group = new fabric.Group([line, triangle], {
      left: 100,
      top: 100,
    });
    
    canvas.add(group);
    canvas.setActiveObject(group);
  } else {
    canvas.add(line);
    canvas.setActiveObject(line);
  }
}
