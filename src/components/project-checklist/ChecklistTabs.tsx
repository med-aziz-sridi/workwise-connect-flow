
import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: Date;
}

export interface ChecklistItem {
  id: string;
  text: string;
  comments: Comment[];
  completed?: boolean;
}

interface Section {
  id: string;
  title: string;
  items: ChecklistItem[];
}

export interface ChecklistTabsProps {
  sections: Section[];
  onSectionsChange: (sections: Section[]) => void;
  onAddComment: (sectionId: string, taskId: string, comment: Comment) => void;
  
  // For backward compatibility with existing usage
  todoItems?: ChecklistItem[];
  inProgressItems?: ChecklistItem[];
  doneItems?: ChecklistItem[];
  onUpdateSection?: (
    section: 'todoItems' | 'inProgressItems' | 'doneItems', 
    items: ChecklistItem[]
  ) => Promise<void>;
}

const ChecklistTabs: React.FC<ChecklistTabsProps> = ({
  sections = [],
  onSectionsChange,
  onAddComment,
  // Backward compatibility props
  todoItems,
  inProgressItems,
  doneItems,
  onUpdateSection,
}) => {
  // Create sections from the old props format if needed
  React.useEffect(() => {
    if (todoItems || inProgressItems || doneItems) {
      const convertedSections = [
        {
          id: 'todo',
          title: 'To Do',
          items: todoItems || []
        },
        {
          id: 'in-progress',
          title: 'In Progress',
          items: inProgressItems || []
        },
        {
          id: 'done',
          title: 'Done',
          items: doneItems || []
        }
      ];
      
      if (sections.length === 0) {
        onSectionsChange?.(convertedSections);
      }
    }
  }, [todoItems, inProgressItems, doneItems]);

  const [newSectionTitle, setNewSectionTitle] = React.useState('');
  const [newTaskTexts, setNewTaskTexts] = React.useState<Record<string, string>>({});
  const [selectedTask, setSelectedTask] = React.useState<{ sectionId: string; taskId: string } | null>(null);
  const [newComment, setNewComment] = React.useState('');

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !sections) return;

    const { source, destination, type } = result;

    if (type === 'SECTION') {
      const reorderedSections = [...sections];
      const [movedSection] = reorderedSections.splice(source.index, 1);
      reorderedSections.splice(destination.index, 0, movedSection);
      onSectionsChange(reorderedSections);
      
      // Support for old props format
      if (onUpdateSection) {
        updateOldPropsFormat(reorderedSections);
      }
    } else if (type === 'TASK') {
      const sourceSectionIndex = sections.findIndex(s => s.id === source.droppableId);
      const destSectionIndex = sections.findIndex(s => s.id === destination.droppableId);
      
      if (sourceSectionIndex === -1 || destSectionIndex === -1) return;

      // Handle same-section movement
      if (source.droppableId === destination.droppableId) {
        const sectionCopy = { ...sections[sourceSectionIndex] };
        const items = [...sectionCopy.items];
        const [movedItem] = items.splice(source.index, 1);
        items.splice(destination.index, 0, movedItem);

        const newSections = [...sections];
        newSections[sourceSectionIndex] = { ...sectionCopy, items };
        onSectionsChange(newSections);
        
        // Support for old props format
        if (onUpdateSection) {
          updateOldPropsFormat(newSections);
        }
      } else {
        // Handle cross-section movement
        const sourceSection = { ...sections[sourceSectionIndex] };
        const destSection = { ...sections[destSectionIndex] };
        
        const task = sourceSection.items[source.index];
        if (!task) return;

        const newSourceItems = [...sourceSection.items];
        newSourceItems.splice(source.index, 1);
        
        const newDestItems = [...destSection.items];
        newDestItems.splice(destination.index, 0, task);

        const newSections = [...sections];
        newSections[sourceSectionIndex] = { ...sourceSection, items: newSourceItems };
        newSections[destSectionIndex] = { ...destSection, items: newDestItems };
        onSectionsChange(newSections);
        
        // Support for old props format
        if (onUpdateSection) {
          updateOldPropsFormat(newSections);
        }
      }
    }
  };
  
  // Function to update the old props format when sections change
  const updateOldPropsFormat = (updatedSections: Section[]) => {
    if (!onUpdateSection) return;
    
    const todoSection = updatedSections.find(s => s.id === 'todo');
    const inProgressSection = updatedSections.find(s => s.id === 'in-progress');
    const doneSection = updatedSections.find(s => s.id === 'done');
    
    if (todoSection) {
      onUpdateSection('todoItems', todoSection.items);
    }
    
    if (inProgressSection) {
      onUpdateSection('inProgressItems', inProgressSection.items);
    }
    
    if (doneSection) {
      onUpdateSection('doneItems', doneSection.items);
    }
  };

  const handleAddSection = () => {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      title: newSectionTitle || 'New Section',
      items: [],
    };
    const updatedSections = [...sections, newSection];
    onSectionsChange(updatedSections);
    setNewSectionTitle('');
  };
  
  const handleEditSection = (sectionId: string, newTitle: string) => {
    const updatedSections = sections.map(section => 
      section.id === sectionId ? { ...section, title: newTitle } : section
    );
    onSectionsChange(updatedSections);
  };
  
  const handleDeleteSection = (sectionId: string) => {
    const updatedSections = sections.filter(section => section.id !== sectionId);
    onSectionsChange(updatedSections);
  };

  const handleAddTask = (sectionId: string) => {
    const text = newTaskTexts[sectionId] || 'New Task';
    const newTask: ChecklistItem = {
      id: `task-${Date.now()}`,
      text,
      comments: [],
    };
    const updatedSections = sections.map(section => 
      section.id === sectionId 
        ? { ...section, items: [...section.items, newTask] }
        : section
    );
    onSectionsChange(updatedSections);
    
    // Support for old props format
    if (onUpdateSection) {
      updateOldPropsFormat(updatedSections);
    }
    
    setNewTaskTexts({ ...newTaskTexts, [sectionId]: '' });
  };

  const handleCommentSubmit = () => {
    if (!selectedTask || !newComment.trim()) return;

    const comment: Comment = {
      id: `comment-${Date.now()}`,
      text: newComment,
      author: 'Current User',
      createdAt: new Date(),
    };

    onAddComment(selectedTask.sectionId, selectedTask.taskId, comment);
    setNewComment('');
  };

  return (
    <div className="h-full p-4 bg-gray-50">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="sections" direction="horizontal" type="SECTION">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex gap-4 overflow-x-auto pb-4"
              aria-label="Checklist sections"
            >
              {sections.map((section, index) => (
                <Draggable key={section.id} draggableId={section.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="bg-white rounded-lg shadow-sm w-72 flex-shrink-0"
                      role="group"
                      aria-label={`Section: ${section.title}`}
                    >
                      <div
                        {...provided.dragHandleProps}
                        className="p-4 font-semibold border-b flex justify-between items-center"
                      >
                        {section.title}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button 
                              className="text-gray-400 hover:text-gray-600"
                              aria-label="Section options"
                            >
                              <MoreVertical size={16} />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {
                              const newTitle = prompt('Enter new section title', section.title);
                              if (newTitle) handleEditSection(section.id, newTitle);
                            }}>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteSection(section.id)}
                              className="text-red-600"
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      <Droppable droppableId={section.id} type="TASK">
                        {(provided) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="p-2 min-h-[100px]"
                          >
                            {section.items.map((item, index) => (
                              <Draggable key={item.id} draggableId={item.id} index={index}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="bg-white p-3 mb-2 rounded shadow hover:shadow-md transition-shadow cursor-pointer"
                                    onClick={() => setSelectedTask({ 
                                      sectionId: section.id, 
                                      taskId: item.id 
                                    })}
                                    role="button"
                                    aria-label={`Task: ${item.text}`}
                                  >
                                    <div className="text-gray-800">{item.text}</div>
                                    {item.comments.length > 0 && (
                                      <div className="text-sm text-gray-500 mt-1">
                                        {item.comments.length} 💬
                                      </div>
                                    )}
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                            
                            <div className="mt-2">
                              <Input
                                value={newTaskTexts[section.id] || ''}
                                onChange={(e) => setNewTaskTexts({ 
                                  ...newTaskTexts, 
                                  [section.id]: e.target.value 
                                })}
                                placeholder="Add a task"
                                onKeyPress={(e) => e.key === 'Enter' && handleAddTask(section.id)}
                                aria-label="Add new task input"
                              />
                              <Button
                                variant="ghost"
                                className="w-full mt-2"
                                onClick={() => handleAddTask(section.id)}
                                aria-label="Add task button"
                              >
                                Add Task
                              </Button>
                            </div>
                          </div>
                        )}
                      </Droppable>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              
              <div className="bg-white/50 p-4 rounded-lg w-72 flex-shrink-0">
                <Input
                  value={newSectionTitle}
                  onChange={(e) => setNewSectionTitle(e.target.value)}
                  placeholder="New section title"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSection()}
                  aria-label="Add new section input"
                />
                <Button 
                  className="w-full mt-2" 
                  onClick={handleAddSection}
                  aria-label="Add section button"
                >
                  Add Section
                </Button>
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Comment Modal */}
      {selectedTask && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center"
          onClick={() => setSelectedTask(null)}
          role="dialog"
          aria-label="Task comments dialog"
        >
          <div 
            className="bg-white rounded-lg p-6 w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Task Comments</h3>
            <div className="max-h-96 overflow-y-auto mb-4">
              {sections
                .find(s => s.id === selectedTask.sectionId)
                ?.items.find(t => t.id === selectedTask.taskId)
                ?.comments.map(comment => (
                  <div 
                    key={comment.id} 
                    className="mb-4 p-3 bg-gray-50 rounded"
                    aria-label="Comment"
                  >
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{comment.author}</span>
                      <span className="text-gray-500">
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-800">{comment.text}</p>
                  </div>
                ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit()}
                aria-label="Write comment input"
              />
              <Button 
                onClick={handleCommentSubmit}
                aria-label="Add comment button"
              >
                Add
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setSelectedTask(null)}
                aria-label="Close comments button"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChecklistTabs;
