
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, MoreHorizontal, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

interface BoardColumn {
  id: string;
  title: string;
  items: ChecklistItem[];
}

interface DraggableTaskBoardProps {
  todoItems: ChecklistItem[];
  inProgressItems: ChecklistItem[];
  doneItems: ChecklistItem[];
  onUpdateSection: (
    section: 'todoItems' | 'inProgressItems' | 'doneItems',
    items: ChecklistItem[]
  ) => Promise<void>;
}

const DraggableTaskBoard: React.FC<DraggableTaskBoardProps> = ({
  todoItems,
  inProgressItems,
  doneItems,
  onUpdateSection
}) => {
  const { toast } = useToast();
  const [columns, setColumns] = useState<{ [key: string]: BoardColumn }>({
    'todo': {
      id: 'todo',
      title: 'To Do',
      items: todoItems,
    },
    'in-progress': {
      id: 'in-progress',
      title: 'In Progress',
      items: inProgressItems,
    },
    'done': {
      id: 'done',
      title: 'Done',
      items: doneItems,
    }
  });
  
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [addingColumn, setAddingColumn] = useState(false);
  const [newTaskTexts, setNewTaskTexts] = useState<{ [key: string]: string }>({});

  // Update the columns when props change
  React.useEffect(() => {
    setColumns(prev => ({
      ...prev,
      'todo': {
        ...prev['todo'],
        items: todoItems,
      },
      'in-progress': {
        ...prev['in-progress'],
        items: inProgressItems,
      },
      'done': {
        ...prev['done'],
        items: doneItems,
      }
    }));
  }, [todoItems, inProgressItems, doneItems]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const { source, destination } = result;
    
    // If dropped in the same place
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }
    
    // If moving within the same column
    if (source.droppableId === destination.droppableId) {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });
      
      updateSection(source.droppableId, copiedItems);
    } 
    // If moving to another column
    else {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });
      
      updateSection(source.droppableId, sourceItems);
      updateSection(destination.droppableId, destItems);
    }
  };

  const updateSection = (columnId: string, items: ChecklistItem[]) => {
    let section: 'todoItems' | 'inProgressItems' | 'doneItems';
    
    switch (columnId) {
      case 'todo':
        section = 'todoItems';
        break;
      case 'in-progress':
        section = 'inProgressItems';
        break;
      case 'done':
        section = 'doneItems';
        break;
      default:
        // For custom columns, we don't have a corresponding section yet
        // We could store these in a separate table or JSON field in the future
        return;
    }
    
    onUpdateSection(section, items);
  };

  const handleAddTask = (columnId: string) => {
    if (!newTaskTexts[columnId] || !newTaskTexts[columnId].trim()) return;
    
    const newTask: ChecklistItem = {
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      text: newTaskTexts[columnId].trim(),
      completed: false,
    };
    
    const column = columns[columnId];
    const updatedItems = [...column.items, newTask];
    
    setColumns({
      ...columns,
      [columnId]: {
        ...column,
        items: updatedItems,
      },
    });
    
    setNewTaskTexts({
      ...newTaskTexts,
      [columnId]: '',
    });
    
    updateSection(columnId, updatedItems);
  };

  const handleRemoveTask = (columnId: string, taskId: string) => {
    const column = columns[columnId];
    const updatedItems = column.items.filter(item => item.id !== taskId);
    
    setColumns({
      ...columns,
      [columnId]: {
        ...column,
        items: updatedItems,
      },
    });
    
    updateSection(columnId, updatedItems);
  };

  const handleToggleTaskComplete = (columnId: string, taskId: string) => {
    const column = columns[columnId];
    const updatedItems = column.items.map(item => 
      item.id === taskId ? { ...item, completed: !item.completed } : item
    );
    
    setColumns({
      ...columns,
      [columnId]: {
        ...column,
        items: updatedItems,
      },
    });
    
    updateSection(columnId, updatedItems);
  };

  const handleAddColumn = () => {
    if (!newColumnTitle.trim()) return;
    
    const newColumnId = `column-${Date.now()}`;
    
    setColumns({
      ...columns,
      [newColumnId]: {
        id: newColumnId,
        title: newColumnTitle.trim(),
        items: [],
      },
    });
    
    setNewColumnTitle('');
    setAddingColumn(false);
    
    toast({
      title: "Column added",
      description: `'${newColumnTitle.trim()}' column has been added.`,
    });
  };

  return (
    <div className="mt-6">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {Object.values(columns).map(column => (
            <div key={column.id} className="w-80 flex-shrink-0">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex justify-between items-center">
                    {column.title}
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" aria-label="Column options">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Droppable droppableId={column.id}>
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="min-h-[200px]"
                      >
                        {column.items.map((item, index) => (
                          <Draggable
                            key={item.id}
                            draggableId={item.id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="mb-2 p-3 bg-white border rounded-md shadow-sm hover:shadow-md transition-shadow"
                              >
                                <div className="flex items-start gap-2">
                                  <input
                                    type="checkbox"
                                    checked={item.completed}
                                    onChange={() => handleToggleTaskComplete(column.id, item.id)}
                                    className="mt-1 h-4 w-4"
                                  />
                                  <div className="flex-1 truncate">
                                    <p className={`text-sm ${item.completed ? 'line-through text-gray-400' : ''}`}>
                                      {item.text}
                                    </p>
                                  </div>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-6 w-6 p-0" 
                                    onClick={() => handleRemoveTask(column.id, item.id)}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                  
                  <div className="pt-2">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Add a task..."
                        value={newTaskTexts[column.id] || ''}
                        onChange={(e) => setNewTaskTexts({
                          ...newTaskTexts,
                          [column.id]: e.target.value,
                        })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleAddTask(column.id);
                          }
                        }}
                      />
                      <Button size="sm" onClick={() => handleAddTask(column.id)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
          
          {/* Add new column */}
          <div className="w-80 flex-shrink-0">
            {addingColumn ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <Input
                      placeholder="Column title..."
                      value={newColumnTitle}
                      onChange={(e) => setNewColumnTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddColumn();
                        } else if (e.key === 'Escape') {
                          setAddingColumn(false);
                          setNewColumnTitle('');
                        }
                      }}
                      autoFocus
                    />
                    <div className="flex space-x-2">
                      <Button onClick={handleAddColumn}>Add Column</Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setAddingColumn(false);
                          setNewColumnTitle('');
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Button 
                variant="outline" 
                className="w-full h-12 border-dashed"
                onClick={() => setAddingColumn(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Column
              </Button>
            )}
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};

export default DraggableTaskBoard;
