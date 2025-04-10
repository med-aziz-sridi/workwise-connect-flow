import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

interface CollaborativeChecklistProps {
  items: ChecklistItem[];
  onUpdate: (items: ChecklistItem[]) => void;
}

export const CollaborativeChecklist = ({ items, onUpdate }: CollaborativeChecklistProps) => {
  const [newItem, setNewItem] = useState('');

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const reorderedItems = Array.from(items);
    const [removed] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, removed);
    
    onUpdate(reorderedItems);
  };

  return (
    <div className="space-y-2">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="checklist">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="flex items-center gap-2 p-2 bg-gray-50 rounded border hover:bg-gray-100 transition-colors"
                    >
                      <div {...provided.dragHandleProps} className="hover:cursor-grab text-gray-400">
                        ≡
                      </div>
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={(e) => 
                          onUpdate(items.map(i => 
                            i.id === item.id ? {...i, completed: e.target.checked} : i
                          ))
                        }
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={item.text}
                        onChange={(e) =>
                          onUpdate(items.map(i =>
                            i.id === item.id ? {...i, text: e.target.value} : i
                          ))
                        }
                        className={`flex-1 bg-transparent border-none focus:ring-0 ${
                          item.completed ? 'line-through text-gray-400' : 'text-gray-700'
                        }`}
                      />
                      <button
                        onClick={() => onUpdate(items.filter(i => i.id !== item.id))}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className="flex gap-2 mt-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add new item"
          className="flex-1 px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          onKeyPress={(e) => {
            if (e.key === 'Enter' && newItem.trim()) {
              onUpdate([...items, { 
                id: `item-${Date.now()}`, 
                text: newItem.trim(), 
                completed: false 
              }]);
              setNewItem('');
            }
          }}
        />
        <Button
          onClick={() => {
            if (newItem.trim()) {
              onUpdate([...items, { 
                id: `item-${Date.now()}`, 
                text: newItem.trim(), 
                completed: false 
              }]);
              setNewItem('');
            }
          }}
          size="sm"
          className="gap-1"
        >
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>
    </div>
  );
};